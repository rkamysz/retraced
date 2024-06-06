import { Router } from "express";
import { Container } from "../../../dependencies";
import { CategoriesHandlers } from "./categories.handlers";

/**
 * Class responsible for building the Categories Router.
 */
export class CategoriesRouter {
  /**
   * Builds and configures the categories router.
   *
   * This method creates a new router and sets up the following routes:
   * - POST /: Adds a new category using the addCategory handler.
   * - GET /: Retrieves the category tree using the getCategoryTree handler.
   * - GET /:id: Retrieves the category tree for a specific category ID using the getCategoryTree handler.
   * - DELETE /:id: Removes a category by ID using the removeCategory handler.
   *
   * Each route handler is initialized with the publisher from the provided container.
   *
   * @param {Container} container - The dependency container that includes the publisher instance.
   * @returns {Router} The configured router with category routes.
   */
  static build(container: Container): Router {
    const router = Router();

    router.post("/", CategoriesHandlers.addCategory(container.messageService));
    router.get(
      "/",
      CategoriesHandlers.getCategoryTree(container.messageService)
    );
    router.get(
      "/:id",
      CategoriesHandlers.getCategoryTree(container.messageService)
    );
    router.delete(
      "/:id",
      CategoriesHandlers.removeCategory(container.messageService)
    );

    return router;
  }
}
