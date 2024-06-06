import { NextFunction, Request, Response } from "express";
import { MessageService } from "../../messages/message-service";
import {
  AddCategoryMessage,
  CategoryQueues,
  GetCategoryTreeMessage,
  RemoveCategoryMessage,
} from "./categories.messages";
import { Message } from "amqplib";

/**
 * Class containing handlers for categories-related requests.
 */
export class CategoriesHandlers {
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

  static onAddCategoryResponse(res: Response) {
    return (msg: Message) => {
      // if (result.isFailure) {
      //   res.status(500).send(result.failure.error.message);
      // } else {
      //   res.status(201).send(result.content);
      // }
    };
  }

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

  static onGetCategoryTreeResponse(res: Response, type: string) {
    return (msg: Message) => {
      /*
      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        const tree =
          type === "string"
            ? convertCategoryTreeToString(result.content)
            : convertCategoryTreeToJson(result.content);

        res.status(201).send(tree);
      }
      */
    };
  }

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

  static onRemoveCategoryResponse(res: Response) {
    return (msg: Message) => {
      /*
      const result = await controller.remove({
        id: +id,
        recursive: recursive === "true",
      });

      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        res.status(201).send(result.content);
      }
      */
    };
  }
}
