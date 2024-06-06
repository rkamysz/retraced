import { AnyFunction } from "@soapjs/soap";
import { Message } from "amqplib";
import { Response } from "express";
import {
  CountSubcategoriesMessage,
  CountTopLevelCategoriesMessage,
  AnalyticsQueues,
} from "./analytics.messages";
import { convertToStringNumber } from "./analytics.mappers";
import { MessageService } from "../../messages/message-service";

/**
 * Class containing handlers for analytics-related requests.
 */
export class AnalyticsHandlers {
  /**
   * Creates a handler function to fetch the number of subcategories for a given category ID.
   *
   * This function sends a message to fetch the number of subcategories for the specified category ID
   * and listens for the response on the "analytics_responses" queue. The response is then sent back
   * to the client as a stringified number.
   *
   * @param {MessageService} messageService - The message messageService instance.
   * @returns {Function} The handler function for fetching the number of subcategories.
   */
  static countSubcategories(messageService: MessageService): AnyFunction {
    return (req, res, next) => {
      try {
        const categoryId = req.params.categoryId;
        const message = CountSubcategoriesMessage.create(+categoryId);

        messageService.sendMessage(message);
        messageService.listen(
          AnalyticsQueues.AnalyticsResponses,
          this.handleMessageResponse(res),
          { noAck: false, correlationId: message.correlationId }
        );
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Creates a handler function to fetch the number of top-level categories.
   *
   * This function sends a message to fetch the number of top-level categories
   * and listens for the response on the "analytics_responses" queue. The response is then sent back
   * to the client as a stringified number.
   *
   * @param {MessageService} messageService - The message messageService instance.
   * @returns {Function} The handler function for fetching the number of top-level categories.
   */
  static countTopLevelCategories(messageService: MessageService): AnyFunction {
    return (req, res, next) => {
      try {
        const message = CountTopLevelCategoriesMessage.create();

        messageService.sendMessage(message);
        messageService.listen(
          AnalyticsQueues.AnalyticsResponses,
          this.handleMessageResponse(res),
          { noAck: false, correlationId: message.correlationId }
        );
      } catch (error) {
        next(error);
      }
    };
  }

  static handleMessageResponse(res: Response) {
    return (msg: Message) => {
      res.status(201).send(convertToStringNumber(msg.content));
    };
  }
}
