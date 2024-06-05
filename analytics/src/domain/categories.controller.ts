import { Result } from "@soapjs/soap";
import { Container } from "../dependencies";

export class CategoriesController {
  constructor(private container: Container) {}

  async count(categoryId: number): Promise<Result<{ count: number }>> {
    const {
      container: {
        categories: { useCases },
      },
    } = this;

    const { content, failure } = await useCases.countCategories.execute(
      categoryId
    );

    if (failure) {
      return Result.withFailure(failure);
    }

    return Result.withContent(content);
  }
}
