import * as Soap from "@soapjs/soap";
import { OracleSource } from "./data/oracle.source";
import { CategoriesOracle } from "./data/categories.oracle";
import { CategoryRepositoryImpl } from "./data/category.repository-impl";
import { CategoryRepository } from "./domain/category.repository";
import { CountCategoriesUseCase } from "./domain/use-cases/count-categories.use-case";
import { Config } from "./config";
import { MessageService } from "./api/messages/message-service";
import { AmqService } from "./api/messages/amq.service";
import { AnalyticsQueues } from "./api/messages";

export type Container = {
  messageService: MessageService;
  categories: {
    repository: CategoryRepository;
    useCases: {
      countCategories: CountCategoriesUseCase;
    };
  };
};

export class Dependencies implements Soap.Dependencies {
  public readonly container: Container = {
    messageService: null,
    categories: null,
  };
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
    this.container.messageService = new AmqService(config.amqUrl, [
      AnalyticsQueues.AnalyticsRequests,
      AnalyticsQueues.AnalyticsResponses,
    ]);
    await this.container.messageService.init();

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
