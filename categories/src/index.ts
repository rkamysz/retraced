import { Dependencies } from "./dependencies";
import { Config } from "./config";
import { CategoryQueues } from "./api/messages";
import { CategoriesController } from "./domain/categories.controller";
import { CategoriesListeners } from "./categories.listeners";

/**
 * Bootstrap function to initialize the application.
 * 
 * This function performs the following steps:
 * 1. Creates a configuration object from the `.env` file.
 * 2. Initializes dependencies.
 * 3. Configures the dependencies with the loaded configuration.
 * 4. Creates a `CategoriesController` instance.
 * 5. Retrieves the `messageService` from the dependency container.
 * 6. Sets up message listeners for various category-related operations.
 * 
 * @returns {Promise<void>} - A promise that resolves when the bootstrap process is complete.
 */
export const bootstrap = async () => {
  const config = Config.create("./.env");
  const dependencies = new Dependencies();

  await dependencies.configure(config);

  const controller = new CategoriesController(dependencies.container);
  const { messageService } = dependencies.container;

  messageService.listen(
    CategoryQueues.AddCategoryRequests,
    CategoriesListeners.onAddCategory(controller, messageService),
    { noAck: false }
  );

  messageService.listen(
    CategoryQueues.GetCategoryTreeRequests,
    CategoriesListeners.onGetCategoryTree(controller, messageService),
    { noAck: false }
  );

  messageService.listen(
    CategoryQueues.RemoveCategoryRequests,
    CategoriesListeners.onRemoveCategory(controller, messageService),
    { noAck: false }
  );
};

bootstrap();
