import { createTodoController } from "@/controllers/todo.controller";
import { createApp } from "./app";
import { loadEnv } from "./configs/env";
import { createAuthController } from "./controllers/auth.controller";
import { createLogger } from "./logger/winston";
import { createAuthMiddleware } from "./middlewares/auth.middleware";
import { createValidationMiddleware } from "./middlewares/validate.middleware";
import { createPrisma } from "./prisma/client";
import { createRedis } from "./redis/client";
import { createTodoRepository } from "./repositories/todo.repository";
import { createTokenRepository } from "./repositories/token.repository";
import { createUserRepository } from "./repositories/user.repository";
import { createMailerService } from "./services/mailer.service";
import { createTodoService } from "./services/todo.service";
import { createTokenService } from "./services/token.service";
import { createUserService } from "./services/user.service";

export async function bootstrap() {
  // Dependencies
  const env = loadEnv();
  const logger = createLogger(env);
  const prisma = createPrisma(env);
  const redis = createRedis(env, logger);

  // Catch unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at Promise:", {
      reason: reason instanceof Error ? reason.stack : reason,
      promise,
    });
    // exit in production
    if (env.NODE_ENV === "production") {
      process.exit(1);
    }
  });

  // Catch uncaught synchronous exceptions
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", {
      error: error.stack || error.message || error,
    });
    process.exit(1);
  });

  // Database connection
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`; // ping database
    logger.info("Prisma connected");
  } catch (error) {
    logger.error("prisma connection failed:", { error });
    process.exit(1);
  }

  // redis connection
  try {
    await redis.ping();
    logger.info("Redis connected");
  } catch (err) {
    logger.error("Redis connection failed", { err });
    process.exit(1);
  }

  // Composition root - wire repositories, services, and controllers
  // repos
  const userRepo = createUserRepository(prisma);
  const tokenRepo = createTokenRepository(prisma);
  const todoRepo = createTodoRepository(prisma);
  // services
  const userService = createUserService(userRepo);
  const tokenService = createTokenService(env, tokenRepo);
  const mailerService = createMailerService(env, logger);
  const todoService = createTodoService(todoRepo);
  // middlewares
  const authMiddleware = createAuthMiddleware(tokenService);
  const validateMiddleware = createValidationMiddleware(logger);
  // controllers
  const authController = createAuthController(
    userService,
    tokenService,
    mailerService,
  );
  const todoController = createTodoController(todoService);

  // Group dependencies
  const deps = {
    env,
    logger,
    prisma,
    controllers: {
      auth: authController,
      todo: todoController,
    },
    middlewares: {
      auth: authMiddleware,
      validate: validateMiddleware,
    },
  };

  // App
  const app = createApp(deps);
  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port:${env.PORT}`);
  });

  // Graceful shutdown
  async function shutdown(signal: string) {
    try {
      logger.info(`${signal} received. Shutting down...`);
      server.close(() => logger.info("HTTP server closed."));
      // Database disconnection
      await prisma.$disconnect();
      logger.info("Prisma disconnected.");
      process.exit(0);
    } catch (error) {
      logger.error("Shutdown failed:", { error });
      process.exit(1);
    }
  }

  // Signal event listeners
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
