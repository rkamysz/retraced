import { Result } from "@soapjs/soap";
import { Category, CategoryNode } from "./category";
import { RemoveCategoriesOptions } from "./types";
import { Container } from "../dependencies";

export class CategoriesController {
  constructor(private container: Container) {}

  async create(category: Category): Promise<Result<Category>> {
    const {
      container: {
        categories: { useCases },
      },
    } = this;

    const { content, failure } = await useCases.addCategory.execute(category);

    if (failure) {
      return Result.withFailure(failure);
    }

    return Result.withContent(content);
  }

  async list(id?: number): Promise<Result<CategoryNode[]>> {
    const {
      container: {
        categories: { useCases },
      },
    } = this;

    const result = await useCases.listCategories.execute(id);

    if (result.isFailure) {
      return Result.withFailure(result.failure);
    }

    return Result.withContent(result.content);
  }

  async remove(options: RemoveCategoriesOptions): Promise<Result<boolean>> {
    const {
      container: {
        categories: { useCases },
      },
    } = this;

    const { content, failure } = await useCases.removeCategory.execute(
      options.id,
      options.recursive
    );

    if (failure) {
      return Result.withFailure(failure);
    }

    return Result.withContent(content);
  }
}
