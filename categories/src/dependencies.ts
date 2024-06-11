import * as Soap from "@soapjs/soap";
import { OracleSource } from "./data/oracle.source";
import { CategoriesOracle } from "./data/categories.oracle";
import { CategoryRepositoryImpl } from "./data/category.repository-impl";
import { CategoryRepository } from "./domain/category.repository";
import { AddCategoryUseCase } from "./domain/use-cases/add-category.use-case";
import { RemoveCategoryUseCase } from "./domain/use-cases/remove-category.use-case";
import { ListCategoriesUseCase } from "./domain/use-cases/list-categories.use-case";
import { Config } from "./config";
import { CategoryQueues } from "./api/messages";
import { MessageService } from "./api/messages/message-service";
import { AmqService } from "./api/messages/amq.service";

export type Container = {
  messageService: MessageService;
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
      CategoryQueues.AddCategoryRequests,
      CategoryQueues.AddCategoryResponses,
      CategoryQueues.RemoveCategoryRequests,
      CategoryQueues.RemoveCategoryResponses,
      CategoryQueues.GetCategoryTreeRequests,
      CategoryQueues.GetCategoryTreeResponses,
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
        addCategory: new AddCategoryUseCase(categoryRepository),
        removeCategory: new RemoveCategoryUseCase(categoryRepository),
        listCategories: new ListCategoriesUseCase(categoryRepository),
      },
    };
  }
}
