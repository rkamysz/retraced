import { Dependencies } from "./dependencies";
import { Config } from "./config";
import { CategoriesController } from "./domain/categories.controller";
import { Queues } from "./api/events/message-publisher";
import { CountResultMessage } from "./api/events/messages";

export const bootstrap = async () => {
  const config = Config.create("./.env");
  const dependencies = new Dependencies();
  await dependencies.configure(config);

  const controller = new CategoriesController(dependencies.container);

  dependencies.container.publisher.listen(
    Queues.AnalyticsRequests,
    async (msg) => {
      const { categoryId } = JSON.parse(msg.content.toString());
      const result = await controller.count(+categoryId);

      dependencies.container.publisher.sendMessage(
        CountResultMessage.create(
          result.content.count,
          msg.properties.correlationId,
          msg.properties.replyTo
        )
      );
    },
    { noAck: false }
  );
};

bootstrap();
