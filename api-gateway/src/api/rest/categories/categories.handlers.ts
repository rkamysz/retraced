import { NextFunction, Request, Response } from "express";
import { MessageService } from "../../messages/message-service";
import {
  AddCategoryMessage,
  CategoryQueues,
  GetCategoryTreeMessage,
  RemoveCategoryMessage,
} from "./categories.messages";
import { Message } from "amqplib";
import { MessageResult } from "../../messages/message-result";
import {
  convertCategoryTreeToJson,
  convertCategoryTreeToString,
} from "./categories.mappers";

/**
 * Handles requests for category-related actions using AMQP messaging.
 */
export class CategoriesHandlers {
  /**
   * Handles the addition of a new category by sending an appropriate message
   * to the message queue and setting up a listener for the response.
   *
   * @param {MessageService} messageService - The service used to send and receive AMQP messages.
   * @returns {Function} An express middleware function that handles the request.
   */
  static addCategory(messageService: MessageService) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, parent_id } = req.body;
        const message = AddCategoryMessage.create(name, parent_id);

        messageService.sendMessage(message);
        messageService.listen(
          CategoryQueues.AddCategoryResponses,
          this.onAddCategoryResponse(res),
          { noAck: false, correlationId: message.correlationId }
        );
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Returns a callback function to handle the response for adding a category.
   *
   * @param {Response} res - The response object to send back HTTP responses.
   * @returns {Function} A function to process the message received from the queue.
   */
  static onAddCategoryResponse(res: Response) {
    return (msg: Message) => {
      const result = MessageResult.toResult(msg);
      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        res.status(201).send(result.content);
      }
    };
  }

  /**
   * Handles fetching the category tree by sending a message to the message queue and setting
   * up a listener for the response, which depends on whether a specific category ID was requested.
   *
   * @param {MessageService} messageService - The service used to send and receive AMQP messages.
   * @returns {Function} An express middleware function that handles the request.
   */
  static getCategoryTree(messageService: MessageService) {
    return async (req, res, next) => {
      try {
        const { id } = req.params;
        const { type } = req.query;
        const message = GetCategoryTreeMessage.create(id);

        messageService.sendMessage(message);
        messageService.listen(
          CategoryQueues.GetCategoryTreeResponses,
          this.onGetCategoryTreeResponse(res, type),
          { noAck: false, correlationId: message.correlationId }
        );
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Returns a callback function to handle the response for fetching the category tree.
   *
   * @param {Response} res - The response object to send back HTTP responses.
   * @param {string} type - The type of response format requested, 'string' or 'json'.
   * @returns {Function} A function to process the message received from the queue.
   */
  static onGetCategoryTreeResponse(res: Response, type: string) {
    return (msg: Message) => {
      const result = MessageResult.toResult(msg);

      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        const tree =
          type === "string"
            ? convertCategoryTreeToString(result.content)
            : convertCategoryTreeToJson(result.content);

        res.status(201).send(tree);
      }
    };
  }

  /**
   * Handles the removal of a category by sending a message to the message queue and setting up
   * a listener for the response.
   *
   * @param {MessageService} messageService - The service used to send and receive AMQP messages.
   * @returns {Function} An express middleware function that handles the request.
   */
  static removeCategory(messageService: MessageService) {
    return async (req, res, next) => {
      try {
        const { id } = req.params;
        const { recursive } = req.query;
        const message = RemoveCategoryMessage.create(id, recursive === "true");

        messageService.sendMessage(message);
        messageService.listen(
          CategoryQueues.RemoveCategoryResponses,
          this.onRemoveCategoryResponse(res),
          { noAck: false, correlationId: message.correlationId }
        );
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Returns a callback function to handle the response for removing a category.
   *
   * @param {Response} res - The response object to send back HTTP responses.
   * @returns {Function} A function to process the message received from the queue.
   */
  static onRemoveCategoryResponse(res: Response) {
    return (msg: Message) => {
      const result = MessageResult.toResult(msg);

      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        res.status(201).send(result.content);
      }
    };
  }
}
