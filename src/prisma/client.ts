import { Env } from "@/config/env";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

let prisma: PrismaClient | null = null;

export function createPrisma(env: Env): PrismaClient {
  if (prisma) return prisma;

  const connectionString = `${env.DATABASE_URL}`;
  const adapter = new PrismaPg({ connectionString });

  prisma = new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "info", "warn"] : ["error"],
    adapter,
  });
  return prisma;
}
