import { AnyObject } from "@soapjs/soap";
import { Queues } from "./message-publisher";

const generateCorrelationId = () => {
  return Math.random().toString() + new Date().getTime().toString();
};

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

export class NumberOfSubcategoriesMessage extends Message {
  static create(categoryId: number, correlationId?: string) {
    return new NumberOfSubcategoriesMessage(
      Queues.AnalyticsRequests,
      correlationId || generateCorrelationId(),
      "NumberOfSubcategories",
      {
        categoryId: categoryId,
      }
    );
  }
}

export class NumberOfTopLevelCategoriesMessage extends Message {
  static create(correlationId?: string) {
    return new NumberOfSubcategoriesMessage(
      Queues.AnalyticsRequests,
      correlationId || generateCorrelationId(),
      "NumberOfTopLevelCategories",
      {
        categoryId: null,
      }
    );
  }
}
