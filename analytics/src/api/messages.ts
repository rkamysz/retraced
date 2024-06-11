import { Message } from "./messages/message";

export enum AnalyticsQueues {
  AnalyticsRequests = "analytics_requests",
  AnalyticsResponses = "analytics_responses",
}

export class CountResultMessage extends Message {
  static create(count: number, correlationId: string) {
    return new CountResultMessage(
      AnalyticsQueues.AnalyticsResponses,
      correlationId,
      {
        count,
      }
    );
  }
}
