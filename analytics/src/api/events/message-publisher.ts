import amqp from "amqplib";
import { Message } from "./messages";
import { AnyFunction, AnyObject } from "@soapjs/soap";

export interface Messages {
  init();
  close();
  sendMessage(message: Message);
  listen(
    queue: string,
    callback: AnyFunction,
    options: { noAck: boolean; [key: string]: unknown }
  );
  ack(message);
}

export enum Queues {
  AnalyticsRequests = "analytics_requests",
  AnalyticsResponses = "analytics_responses",
}

export class AmqMessages implements Messages {
  private channel;
  private connection;

  constructor(private url: string, private queues: string[]) {}

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
