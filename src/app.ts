import express from "express";
import { PrismaClient } from "../generated/prisma/client";
import { Env } from "./config/env";
import { Logger } from "./logger/types";
export function createApp(prisma: PrismaClient, logger: Logger, env: Env) {
  const app = express();

  return app;
}
