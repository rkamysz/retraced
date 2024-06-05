import { Result } from "@soapjs/soap";
import { Category, CategoryNode } from "../domain/category";
import { CategoryRepository } from "../domain/category.repository";
import { CategoriesOracle } from "./categories.oracle";

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(private source: CategoriesOracle) {}

  async add(category: Category): Promise<Result<Category>> {
    try {
      const result = await this.source.addCategory(
        category.name,
        category.parent_id
      );

      return Result.withContent(
        new Category(result[0], category.name, category.parent_id)
      );
    } catch (error) {
      return Result.withFailure(error);
    }
  }

  async remove(id: number, recursive: boolean): Promise<Result<boolean>> {
    try {
      await this.source.deleteCategory(id, recursive);
      return Result.withContent(true);
    } catch (error) {
      return Result.withFailure(error);
    }
  }

  async list(id?: number): Promise<Result<CategoryNode[]>> {
    try {
      const tree = await this.source.getCategories(id);

      return Result.withContent(tree);
    } catch (error) {
      return Result.withFailure(error);
    }
  }
}
