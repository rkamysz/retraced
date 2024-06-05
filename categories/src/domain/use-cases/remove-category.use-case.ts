import { Result, UseCase } from "@soapjs/soap";

import { CategoryRepository } from "../category.repository";

export class RemoveCategoryUseCase implements UseCase<boolean> {
  constructor(private repository: CategoryRepository) {}

  async execute(id: number, recursive: boolean): Promise<Result<boolean>> {
    return this.repository.remove(id, recursive);
  }
}
