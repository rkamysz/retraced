import amqp from "amqplib";
import { AnyFunction } from "@soapjs/soap";
import { MessageService } from "./message-service";
import { Message } from "./message";

/**
 * Provides a service for interacting with an AMQP server such as RabbitMQ.
 * This service handles connecting, sending messages, and subscribing to messages.
 */
export class AmqService implements MessageService {
  /**
   * Active channel for the AMQP connection.
   * @protected
   */
  protected channel;

  /**
   * Connection object for the AMQP server.
   * @protected
   */
  protected connection;

  /**
   * Initializes the AMQP service with the specified connection URL and queues.
   * @param {string} url - The AMQP server URL.
   * @param {string[]} queues - An array of queue names to assert during initialization.
   */
  constructor(protected url: string, protected queues: string[]) {}

  /**
   * Initializes the AMQP connection and channel, and asserts the necessary queues.
   * Logs the status upon successfully establishing the connection and channel.
   * @async
   */
  async init() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
    const promises = [];

    this.queues.forEach((queue) => {
      promises.push(this.channel.assertQueue(queue, { durable: true }));
    });

    await Promise.all(promises);

    console.log("RabbitMQ Connect and Channel Established");
  }

  /**
   * Sends a message to a specified queue.
   * @param {Message} message - The message object containing the data and queue information.
   * @async
   * @throws Logs an error if the message fails to send.
   */
  async sendMessage(message: Message) {
    try {
      const sent = this.channel.sendToQueue(message.queue, message.toBuffer(), {
        correlationId: message.correlationId,
        replyTo: message.queue,
      });

      if (sent) {
        console.log("Message sent:", message);
      } else {
        console.log("Failed to send message:", message);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }
  /**
   * Sets up a listener for messages on a specified queue.
   * Optionally filters messages based on the correlation ID.
   * @param {string} queue - The name of the queue to listen to.
   * @param {Function} callback - The callback function to handle incoming messages.
   * @param {Object} options - Configuration options for message consumption such as noAck and correlationId.
   */
  listen(
    queue: string,
    callback: AnyFunction,
    options: { noAck: boolean; correlationId?: string; [key: string]: unknown }
  ) {
    const { noAck, correlationId } = options;
    this.channel.consume(
      queue,
      (msg) => {
        if (
          !correlationId ||
          (correlationId && msg.properties.correlationId === correlationId)
        ) {
          callback(msg);
          this.channel.ack(msg);
        } else {
          this.channel.nack(msg);
        }
      },
      { noAck }
    );
  }
  /**
   * Acknowledges a message, indicating that it has been successfully processed.
   * @param {Message} message - The message to acknowledge.
   */
  ack(message) {
    this.channel.ack(message);
  }
  /**
   * Closes the AMQP channel and connection.
   * Logs each closure action.
   * @async
   */
  async close() {
    if (this.channel) {
      await this.channel.close();
      console.log("Channel closed");
    }
    if (this.connection) {
      await this.connection.close();
      console.log("Connection closed");
    }
  }
}
