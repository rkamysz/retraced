import { Result } from "@soapjs/soap";
import { CategoryRepository } from "../domain/category.repository";
import { CategoriesOracle } from "./categories.oracle";

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private source: CategoriesOracle) {}

  async count(categoryId: number): Promise<Result<{ count: number }>> {
    try {
      const result = await this.source.countCategories(categoryId);
      return Result.withContent({ count: result });
    } catch (error) {
      return Result.withFailure(error);
    }
  }
}
