import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { Env } from "./config/env";
import { PrismaClient } from "./generated/prisma/client";
import { Logger } from "./logger/types";
import { rateLimitMiddleware } from "./middleware/rateLimit.middleware";
import { requestLoggerMiddleware } from "./middleware/requestLogger.middleware";
export function createApp(prisma: PrismaClient, logger: Logger, env: Env) {
  const app = express();

  // middlewares
  app
    .disable("x-powered-by")
    .set("trust proxy", 1)
    .use(requestLoggerMiddleware(logger))
    .use(helmet())
    // .use(cors())
    .use(rateLimitMiddleware())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(compression({ threshold: 1024 }));

  // Health
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}
