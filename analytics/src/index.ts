import { Dependencies } from "./dependencies";
import { Config } from "./config";
import { CategoriesController } from "./domain/categories.controller";
import { AnalyticsQueues, CountResultMessage } from "./api/messages";

export const bootstrap = async () => {
  const config = Config.create("./.env");
  const dependencies = new Dependencies();
  await dependencies.configure(config);

  const controller = new CategoriesController(dependencies.container);

  dependencies.container.messageService.listen(
    AnalyticsQueues.AnalyticsRequests,
    async (msg) => {
      const { categoryId } = JSON.parse(msg.content.toString());
      const result = await controller.count(+categoryId);

      dependencies.container.messageService.sendMessage(
        CountResultMessage.create(
          result.content.count,
          msg.properties.correlationId
        )
      );
    },
    { noAck: false }
  );
};

bootstrap();
