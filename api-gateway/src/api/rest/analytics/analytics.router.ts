import { Router } from "express";
import { Container } from "../../../dependencies";
import { AnalyticsHandlers } from "./analytics.handlers";

/**
 * Class responsible for building the Analytics Router.
 */
export class AnalyticsRouter {
  /**
   * Builds and configures the analytics router.
   *
   * This method creates a new router and sets up the following routes:
   * - GET /:categoryId: Sends a message to get the number of subcategories for the specified category ID.
   * - GET /: Sends a message to get the number of top-level categories.
   *
   * Each route sends a message using the publisher from the provided container and listens for a response
   * on the "analytics_responses" queue. The response is then sent back to the client as a stringified number.
   *
   * @param {Container} container - The dependency container that includes the publisher instance.
   * @returns {Router} The configured router with analytics routes.
   */
  static build(container: Container): Router {
    const router = Router();
    const { messageService: publisher } = container;

    router.get("/:categoryId", AnalyticsHandlers.countSubcategories(publisher));
    router.get("/", AnalyticsHandlers.countTopLevelCategories(publisher));

    return router;
  }
}
