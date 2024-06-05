import { Router } from "express";
import { Container } from "../../dependencies";
import { CategoriesController } from "../../domain/categories.controller";
import { Category } from "../../domain/category";
import {
  convertCategoryTreeToJson,
  convertCategoryTreeToString,
} from "./categories.mappers";

export class CategoriesRouterBuilder {
  static build(container: Container): Router {
    const controller = new CategoriesController(container);
    const router = Router();

    router.post("/", async (req, res) => {
      const { name, parent_id } = req.body;
      const result = await controller.create(
        new Category(null, name, parent_id)
      );

      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        res.status(201).send(result.content);
      }
    });

    router.get("/", async (req, res) => {
      const result = await controller.list();
      const { type } = req.query;

      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        const tree =
          type === "string"
            ? convertCategoryTreeToString(result.content)
            : convertCategoryTreeToJson(result.content);

        res.status(201).send(tree);
      }
    });

    router.get("/:id", async (req, res) => {
      const { id } = req.params;
      const result = await controller.list(+id);
      const { type } = req.query;
      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        const tree =
          type === "string"
            ? convertCategoryTreeToString(result.content)
            : convertCategoryTreeToJson(result.content);
        res.status(201).send(tree);
      }
    });

    router.get("/:id", async (req, res) => {
      const { id } = req.params;
      const result = await controller.list(+id);

      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        res.status(201).send(result.content);
      }
    });

    router.delete("/:id", async (req, res) => {
      const { id } = req.params;
      const { recursive } = req.query;

      const result = await controller.remove({
        id: +id,
        recursive: recursive === "true",
      });

      if (result.isFailure) {
        res.status(500).send(result.failure.error.message);
      } else {
        res.status(201).send(result.content);
      }
    });

    return router;
  }
}
