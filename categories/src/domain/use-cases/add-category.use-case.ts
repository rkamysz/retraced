import { Result, UseCase } from "@soapjs/soap";
import { Category } from "../category";
import { CategoryRepository } from "../category.repository";

export class AddCategoryUseCase implements UseCase<Category> {
  constructor(private repository: CategoryRepository) {}

  async execute(category: Category): Promise<Result<Category>> {
    return this.repository.add(category);
  }
}
