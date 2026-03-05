import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Response } from "express";
import helmet from "helmet";
import { Env } from "./configs/env";
import { UserController } from "./controllers/user.controller";
import { PrismaClient } from "./generated/prisma/client";
import { Logger } from "./logger/types";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import {
  corsErrorHandler,
  corsMiddleware,
} from "./middlewares/cors.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notfound.middleware";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";
import { requestLoggerMiddleware } from "./middlewares/requestLogger.middleware";
import { ValidateMiddleware } from "./middlewares/validate.middleware";
import { v1Routes } from "./routes/v1";

//  Types
export type Controllers = { user: UserController };
export type Middlewares = {
  auth: AuthMiddleware;
  validate: ValidateMiddleware;
};
export type Dependencies = {
  env: Env;
  logger: Logger;
  prisma: PrismaClient;
  controllers: Controllers;
  middlewares: Middlewares;
};

// Application
export function createApp(deps: Dependencies) {
  const app = express();

  // Middlewares
  app
    .disable("x-powered-by")
    .set("trust proxy", 1)
    .use(requestLoggerMiddleware(deps.logger))
    .use(helmet())
    .use(corsMiddleware(deps.logger, deps.env))
    .use(rateLimitMiddleware())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(compression({ threshold: 1024 }));

  // API
  app.use("/api/v1", v1Routes(deps.controllers, deps.middlewares));

  // Health
  app.get("/health", healthProbeHandler);

  // Global error handler
  app
    .use(notFoundHandler(deps.logger))
    .use(corsErrorHandler)
    .use(errorHandler(deps.logger, deps.env));

  return app;
}

// Health probe handler
function healthProbeHandler(_req: any, res: Response) {
  res.json({ status: "ok" });
}
