import express from "express";
import { CategoriesRouterBuilder } from "./api/rest/categories.router";
import { Dependencies } from "./dependencies";
import { Config } from "./config";
import { AnalyticsRouterBuilder } from "./api/rest/analytics.router";

export const bootstrap = async () => {
  const config = Config.create("./.env");
  const app = express();
  app.use(express.json());
  const dependencies = new Dependencies();

  await dependencies.configure(config);

  app.use("/categories", CategoriesRouterBuilder.build(dependencies.container));
  app.use("/analytics", AnalyticsRouterBuilder.build(dependencies.container));

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

bootstrap();
