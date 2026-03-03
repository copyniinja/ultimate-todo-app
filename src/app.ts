import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Response } from "express";
import helmet from "helmet";
import { Env } from "./configs/env";
import { PrismaClient } from "./generated/prisma/client";
import { Logger } from "./logger/types";
import {
  corsErrorHandler,
  corsMiddleware,
} from "./middlewares/cors.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notfound.middleware";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";
import { requestLoggerMiddleware } from "./middlewares/requestLogger.middleware";

export function createApp(prisma: PrismaClient, logger: Logger, env: Env) {
  const app = express();

  // Middlewares
  app
    .disable("x-powered-by")
    .set("trust proxy", 1)
    .use(requestLoggerMiddleware(logger))
    .use(helmet())
    .use(corsMiddleware(logger, env))
    .use(rateLimitMiddleware())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(compression({ threshold: 1024 }));

  // Health
  app.get("/health", healthProbeHandler);

  // API

  // Global error handler
  app
    .use(notFoundHandler(logger))
    .use(corsErrorHandler)
    .use(errorHandler(logger, env));

  return app;
}

// Health probe handler
function healthProbeHandler(_req: any, res: Response) {
  res.json({ status: "ok" });
}
