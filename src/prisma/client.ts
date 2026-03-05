import { Env } from "@/configs/env";

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export function createPrisma(env: Env): PrismaClient {
  if (prisma) return prisma;

  prisma = new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "info", "warn"] : ["error"],
  });
  return prisma;
}
