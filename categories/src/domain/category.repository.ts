import { Result } from "@soapjs/soap";
import { Category, CategoryNode } from "./category";

export interface CategoryRepository {
  add(category: Category): Promise<Result<Category>>;
  remove(id: number, recursive: boolean): Promise<Result<boolean>>;
  list(id: number): Promise<Result<CategoryNode[]>>;
}
