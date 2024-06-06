import { Message } from "../../messages/message";

/**
 * Enum representing the different category queues.
 * @enum {string}
 */
export enum CategoryQueues {
  AddCategoryRequests = "add_category_requests",
  AddCategoryResponses = "add_category_responses",
  RemoveCategoryRequests = "remove_category_requests",
  RemoveCategoryResponses = "remove_category_responses",
  GetCategoryTreeRequests = "get_category_tree_requests",
  GetCategoryTreeResponses = "get_category_tree_responses",
}
/**
 * Represents a message for adding a category.
 * @extends {Message}
 */
export class AddCategoryMessage extends Message {
  /** The token identifying this type of message */
  static Token = "AddCategoryMessage";

  /**
   * Creates an instance of AddCategoryMessage.
   *
   * @param {string} name - The name of the category to be added.
   * @param {number} parentId - The ID of the parent category.
   * @returns {AddCategoryMessage} The created message instance.
   */
  static create(name: string, parentId: number) {
    return new AddCategoryMessage(
      CategoryQueues.AddCategoryRequests,
      this.Token,
      {
        name,
        parentId,
      }
    );
  }
}

/**
 * Represents a message for getting the category tree.
 * @extends {Message}
 */
export class GetCategoryTreeMessage extends Message {
  /** The token identifying this type of message */
  static Token = "GetCategoryTreeMessage";

  /**
   * Creates an instance of GetCategoryTreeMessage.
   *
   * @param {number} categoryId - The ID of the category whose tree is to be fetched.
   * @returns {GetCategoryTreeMessage} The created message instance.
   */
  static create(categoryId: number) {
    return new GetCategoryTreeMessage(
      CategoryQueues.GetCategoryTreeRequests,
      this.Token,
      {
        categoryId,
      }
    );
  }
}

/**
 * Represents a message for removing a category.
 * @extends {Message}
 */
export class RemoveCategoryMessage extends Message {
  /** The token identifying this type of message */
  static Token = "RemoveCategoryMessage";

  /**
   * Creates an instance of RemoveCategoryMessage.
   *
   * @param {number} categoryId - The ID of the category to be removed.
   * @returns {RemoveCategoryMessage} The created message instance.
   */
  static create(categoryId: number, recursive: boolean) {
    return new RemoveCategoryMessage(
      CategoryQueues.RemoveCategoryRequests,
      this.Token,
      {
        categoryId,
        recursive,
      }
    );
  }
}
