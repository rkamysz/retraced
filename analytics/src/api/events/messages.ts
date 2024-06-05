import { AnyObject } from "@soapjs/soap";
import { Queues } from "./message-publisher";

export class Message {
  constructor(
    public readonly queue: string,
    public readonly correlationId: string,
    public readonly event: string,
    public readonly rawData: AnyObject
  ) {}

  toString() {
    return JSON.stringify(this.rawData);
  }

  toBuffer() {
    return Buffer.from(this.toString());
  }
}

export class CountResultMessage extends Message {
  static create(
    count: number,
    correlationId: string,
    replyTo: "NumberOfSubcategories" | "NumberOfTopLevelCategories"
  ) {
    return new CountResultMessage(
      Queues.AnalyticsResponses,
      correlationId,
      replyTo,
      {
        count,
      }
    );
  }
}
