import { ConfigVars } from "@soapjs/soap";
import { existsSync } from "fs";

export class Config {
  static create(envPath: string) {
    if (existsSync(envPath)) {
      const vars = new ConfigVars(envPath);

      return new Config(
        vars.getNumberEnv("CATEGORIES_PORT"),
        vars.getStringEnv("ORACLE_DB_USER"),
        vars.getStringEnv("ORACLE_DB_PASSWORD"),
        vars.getStringEnv("ORACLE_DB_CONN_STRING"),
        vars.getStringEnv("AMQ_URL"),
        vars.getStringEnv("AMQ_CATEGORIES_CHANNEL")
      );
    }

    return new Config(
      +process.env.CATEGORIES_PORT,
      process.env.ORACLE_DB_USER,
      process.env.ORACLE_DB_PASSWORD,
      process.env.ORACLE_DB_CONN_STRING,
      process.env.AMQ_URL,
      process.env.AMQ_CATEGORIES_CHANNE
    );
  }

  constructor(
    public readonly port: number,
    public readonly dbUser: string,
    public readonly dbPassword: string,
    public readonly dbConnString: string,
    public readonly amqUrl: string,
    public readonly amqCategoriesChannel: string
  ) {}
}
