import { ConfigVars } from "@soapjs/soap";
import { existsSync } from "fs";

export class Config {
  static create(envPath: string) {
    if (existsSync(envPath)) {
      const vars = new ConfigVars(envPath);

      return new Config(
        vars.getNumberEnv("PORT"),
        vars.getStringEnv("AMQ_URL"),
        vars.getStringEnv("AMQ_CATEGORIES_CHANNEL")
      );
    }

    return new Config(
      +process.env.PORT,
      process.env.AMQ_URL,
      process.env.AMQ_CATEGORIES_CHANNE
    );
  }

  constructor(
    public readonly port: number,
    public readonly amqUrl: string,
    public readonly amqCategoriesChannel: string
  ) {}
}
