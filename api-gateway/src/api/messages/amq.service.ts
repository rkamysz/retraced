import amqp from "amqplib";
import { AnyFunction } from "@soapjs/soap";
import { MessageService } from "./message-service";
import { Message } from "./message";

export class AmqService implements MessageService {
  protected channel;
  protected connection;

  constructor(protected url: string, protected queues: string[]) {}

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

  ack(message) {
    this.channel.ack(message);
  }

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
