import { Result, UseCase } from "@soapjs/soap";
import { CategoryNode } from "../category";
import { CategoryRepository } from "../category.repository";

export class ListCategoriesUseCase implements UseCase<CategoryNode[]> {
  constructor(private repository: CategoryRepository) {}

  async execute(id?: number): Promise<Result<CategoryNode[]>> {
    return this.repository.list(id);
  }
}
