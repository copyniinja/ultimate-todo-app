import { loadEnv } from "./config/env";
import { createLogger } from "./logger/winston";

export async function bootstrap() {
  // Config
  const env = loadEnv();
  // Logger
  const logger = createLogger(env);
  logger.info("Hello world");
}
