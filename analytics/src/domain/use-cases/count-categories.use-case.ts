import { Result, UseCase } from "@soapjs/soap";
import { CategoryRepository } from "../category.repository";

export class CountCategoriesUseCase implements UseCase<{ count: number }> {
  constructor(private repository: CategoryRepository) {}

  async execute(categoryId: number): Promise<Result<{ count: number }>> {
    return this.repository.count(categoryId);
  }
}
