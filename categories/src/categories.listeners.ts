import { Message } from "amqplib";
import { CategoryQueues } from "./api/messages";
import { MessageResult } from "./api/messages/message-result";
import { MessageService } from "./api/messages/message-service";
import { CategoriesController } from "./domain/categories.controller";
import { Category } from "./domain/category";

/**
 * Class representing listeners for category-related messages.
 */
export class CategoriesListeners {
  /**
   * Listener for adding a category.
   *
   * @param {CategoriesController} controller - The controller managing categories.
   * @param {MessageService} messageService - The service used to send messages.
   * @returns {Function} - A function to handle the message for adding a category.
   */
  static onAddCategory(
    controller: CategoriesController,
    messageService: MessageService
  ) {
    return async (msg: Message) => {
      const { name, parentId } = JSON.parse(msg.content.toString());
      const result = await controller.create(
        new Category(null, name, parentId)
      );

      if (result.isSuccess) {
        messageService.sendMessage(
          MessageResult.createSuccessResponse(
            CategoryQueues.AddCategoryResponses,
            "AddCategoryMessage",
            result.content
          )
        );
      } else {
        messageService.sendMessage(
          MessageResult.createFailureResponse(
            CategoryQueues.AddCategoryResponses,
            "AddCategoryMessage",
            result.failure.error
          )
        );
      }
    };
  }

  /**
   * Listener for retrieving the category tree.
   *
   * @param {CategoriesController} controller - The controller managing categories.
   * @param {MessageService} messageService - The service used to send messages.
   * @returns {Function} - A function to handle the message for retrieving the category tree.
   */
  static onGetCategoryTree(
    controller: CategoriesController,
    messageService: MessageService
  ) {
    return async (msg: Message) => {
      const { categoryId } = JSON.parse(msg.content.toString());
      const result = await controller.list(categoryId);

      if (result.isSuccess) {
        messageService.sendMessage(
          MessageResult.createSuccessResponse(
            CategoryQueues.GetCategoryTreeResponses,
            "GetCategoryTreeMessage",
            result.content
          )
        );
      } else {
        messageService.sendMessage(
          MessageResult.createFailureResponse(
            CategoryQueues.GetCategoryTreeResponses,
            "GetCategoryTreeMessage",
            result.failure.error
          )
        );
      }
    };
  }

  /**
   * Listener for removing a category.
   *
   * @param {CategoriesController} controller - The controller managing categories.
   * @param {MessageService} messageService - The service used to send messages.
   * @returns {Function} - A function to handle the message for removing a category.
   */
  static onRemoveCategory(
    controller: CategoriesController,
    messageService: MessageService
  ) {
    return async (msg: Message) => {
      const { categoryId, recursive } = JSON.parse(msg.content.toString());
      const result = await controller.remove({ id: categoryId, recursive });

      if (result.isSuccess) {
        messageService.sendMessage(
          MessageResult.createSuccessResponse(
            CategoryQueues.RemoveCategoryResponses,
            "RemoveCategoryMessage",
            result.content
          )
        );
      } else {
        messageService.sendMessage(
          MessageResult.createFailureResponse(
            CategoryQueues.RemoveCategoryResponses,
            "RemoveCategoryMessage",
            result.failure.error
          )
        );
      }
    };
  }
}
