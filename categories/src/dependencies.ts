import * as Soap from "@soapjs/soap";
import { OracleSource } from "./data/oracle.source";
import { CategoriesOracle } from "./data/categories.oracle";
import { CategoryRepositoryImpl } from "./data/category.repository-impl";
import { CategoryRepository } from "./domain/category.repository";
import { AddCategoryUseCase } from "./domain/use-cases/add-category.use-case";
import { AmqMessages, Messages, Queues } from "./api/events/message-publisher";
import { RemoveCategoryUseCase } from "./domain/use-cases/remove-category.use-case";
import { ListCategoriesUseCase } from "./domain/use-cases/list-categories.use-case";
import { Config } from "./config";

export type Container = {
  publisher: Messages;
  categories: {
    repository: CategoryRepository;
    useCases: {
      addCategory: AddCategoryUseCase;
      removeCategory: RemoveCategoryUseCase;
      listCategories: ListCategoriesUseCase;
    };
  };
};

export class Dependencies implements Soap.Dependencies {
  public readonly container: Container = { publisher: null, categories: null };
  async configure(config: Config): Promise<void> {
    console.log("Connecting to DB ...", config.dbConnString);
    /**
     * DB
     */
    const oracleSource = new OracleSource();
    const connection = await oracleSource.initialize({
      user: config.dbUser,
      password: config.dbPassword,
      connectionString: config.dbConnString,
    });
    /**
     * EVENTS
     */
    this.container.publisher = new AmqMessages(config.amqUrl, [
      Queues.AnalyticsRequests,
      Queues.AnalyticsResponses,
    ]);
    await this.container.publisher.init();
    /**
     * BL COMPONENTS
     */
    const categoryRepository = new CategoryRepositoryImpl(
      new CategoriesOracle(connection)
    );

    this.container.categories = {
      repository: categoryRepository,
      useCases: {
        addCategory: new AddCategoryUseCase(categoryRepository),
        removeCategory: new RemoveCategoryUseCase(categoryRepository),
        listCategories: new ListCategoriesUseCase(categoryRepository),
      },
    };
  }
}
