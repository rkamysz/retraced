import express from "express";
import { CategoriesRouter } from "./api/rest/categories/categories.router";
import { Dependencies } from "./dependencies";
import { Config } from "./config";
import { AnalyticsRouter } from "./api/rest/analytics/analytics.router";

/**
 * Initializes and starts the api-gateway2.
 *
 * This function performs the following tasks:
 * 1. Creates a configuration object from the .env file.
 * 2. Sets up an Express application with JSON parsing middleware.
 * 3. Configures application dependencies.
 * 4. Registers route handlers for categories and analytics endpoints.
 * 5. Starts the server on the specified port and logs the server status.
 *
 * @returns {Promise<void>} A promise that resolves when the server is successfully started.
 *
 * @async
 */
export const bootstrap = async () => {
  const config = Config.create("./.env");
  const app = express();
  app.use(express.json());
  const dependencies = new Dependencies();

  await dependencies.configure(config);

  app.use("/categories", CategoriesRouter.build(dependencies.container));
  app.use("/analytics", AnalyticsRouter.build(dependencies.container));

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

bootstrap();
