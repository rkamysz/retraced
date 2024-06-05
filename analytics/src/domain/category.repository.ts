import { Result } from "@soapjs/soap";

export interface CategoryRepository {
  count(categoryId: number): Promise<Result<{ count: number }>>;
}
