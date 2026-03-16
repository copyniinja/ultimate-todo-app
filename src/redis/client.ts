import { Env } from "@/configs/env";
import { Logger } from "@/logger/types";
import IORedis from "ioredis";

let redisClient: IORedis | null = null;

export function createRedis(env: Env, logger: Logger): IORedis | any {
  if (redisClient) return redisClient;

  const url = new URL(env.REDIS_URL);

  redisClient = new IORedis({
    host: url.hostname,
    port: Number(url.port),
    password: env.REDIS_PASSWORD,
    username: url.username || "default",
    connectionName: "todo-app",
    maxRetriesPerRequest: 5,
    retryStrategy: (times) => Math.min(times * 100, 3000),
    enableOfflineQueue: env.NODE_ENV !== "production",
  });

  redisClient.on("error", (err) => {
    logger.error("Redis connection error", { err });
  });

  return redisClient;
}
