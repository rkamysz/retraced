import * as Soap from "@soapjs/soap";
import { OracleSource } from "./data/oracle.source";
import { CategoriesOracle } from "./data/categories.oracle";
import { CategoryRepositoryImpl } from "./data/category.repository-impl";
import { CategoryRepository } from "./domain/category.repository";
import { CountCategoriesUseCase } from "./domain/use-cases/count-categories.use-case";
import { AmqMessages, Messages, Queues } from "./api/events/message-publisher";
import { Config } from "./config";

export type Container = {
  publisher: Messages;
  categories: {
    repository: CategoryRepository;
    useCases: {
      countCategories: CountCategoriesUseCase;
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
        countCategories: new CountCategoriesUseCase(categoryRepository),
      },
    };
  }
}
