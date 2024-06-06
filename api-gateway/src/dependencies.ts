import * as Soap from "@soapjs/soap";
import { MessageService } from "./api/messages/message-service";
import { Config } from "./config";
import { AmqService } from "./api/messages/amq.service";
import { AnalyticsQueues } from "./api/rest/analytics/analytics.messages";
import { CategoryQueues } from "./api/rest/categories/categories.messages";

export type Container = {
  messageService: MessageService;
};

export class Dependencies implements Soap.Dependencies {
  public readonly container: Container = { messageService: null };
  async configure(config: Config): Promise<void> {
    /**
     * EVENTS
     */
    this.container.messageService = new AmqService(config.amqUrl, [
      AnalyticsQueues.AnalyticsRequests,
      AnalyticsQueues.AnalyticsResponses,
      CategoryQueues.AddCategoryRequests,
      CategoryQueues.AddCategoryResponses,
      CategoryQueues.RemoveCategoryRequests,
      CategoryQueues.RemoveCategoryResponses,
      CategoryQueues.GetCategoryTreeRequests,
      CategoryQueues.GetCategoryTreeResponses,
    ]);

    await this.container.messageService.init();
  }
}
