import { createApp } from "./app";
import { loadEnv } from "./configs/env";
import { createUserController } from "./controllers/user.controller";
import { createLogger } from "./logger/winston";
import { createPrisma } from "./prisma/client";
import { createUserRepository } from "./repositories/user.repository";
import { createUserService } from "./services/user.service";

export async function bootstrap() {
  // Dependencies
  const env = loadEnv();
  const logger = createLogger(env);
  const prisma = createPrisma(env);

  // Database connection
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`; // ping database
    logger.info("Prisma connected");
  } catch (error) {
    logger.error("prisma connection failed:", { error });
    process.exit(1);
  }

  // Composition root - wire repositories, services, and controllers
  const userRepo = createUserRepository(prisma);
  const userService = createUserService(userRepo);
  const userController = createUserController(userService);

  // Group dependencies
  const deps = {
    env,
    logger,
    prisma,
    controllers: {
      user: userController,
    },
  };

  // App
  const app = createApp(deps);
  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port:${env.PORT}`);
  });

  // Graceful shutdown
  async function shutdown(signal: string) {
    logger.info(`${signal} received. Shutting down...`);
    server.close(() => logger.info("HTTP server closed."));
    // Database disconnection
    await prisma.$disconnect();
    logger.info("Prisma disconnected.");
    process.exit(0);
  }

  // Signal event listeners
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
