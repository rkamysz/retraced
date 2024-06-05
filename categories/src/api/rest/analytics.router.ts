import { Router } from "express";
import { Container } from "../../dependencies";
import {
  NumberOfSubcategoriesMessage,
  NumberOfTopLevelCategoriesMessage,
} from "../events/messages";
import { convertToStringNumber } from "./analytics.mappers";

export class AnalyticsRouterBuilder {
  static build(container: Container): Router {
    const router = Router();
    const { publisher } = container;

    router.get("/:categoryId", async (req, res) => {
      const categoryId = req.params.categoryId;
      const message = NumberOfSubcategoriesMessage.create(+categoryId);

      publisher.sendMessage(message);
      publisher.listen(
        "analytics_responses",
        (msg) => {
          res.status(201).send(convertToStringNumber(msg.content));
        },
        { noAck: false, correlationId: message.correlationId }
      );
    });

    router.get("/", async (req, res) => {
      const message = NumberOfTopLevelCategoriesMessage.create();

      publisher.sendMessage(message);
      publisher.listen(
        "analytics_responses",
        (msg) => {
          res.status(201).send(convertToStringNumber(msg.content));
        },
        { noAck: false, correlationId: message.correlationId }
      );
    });

    return router;
  }
}
