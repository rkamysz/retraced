import { Message } from "../../messages/message";

export enum AnalyticsQueues {
  AnalyticsRequests = "analytics_requests",
  AnalyticsResponses = "analytics_responses",
}

export class CountSubcategoriesMessage extends Message {
  static Token = "CountSubcategoriesMessage";
  static create(categoryId: number) {
    return new CountSubcategoriesMessage(
      AnalyticsQueues.AnalyticsRequests,
      this.Token,
      {
        categoryId,
      }
    );
  }
}

export class CountTopLevelCategoriesMessage extends Message {
  static Token = "CountTopLevelCategoriesMessage";
  static create() {
    return new CountTopLevelCategoriesMessage(
      AnalyticsQueues.AnalyticsRequests,
      this.Token,
      {
        categoryId: null,
      }
    );
  }
}
