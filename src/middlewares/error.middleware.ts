import { Env } from "@/configs/env";
import { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";
import { Logger } from "../logger/types";

export function errorHandler(logger: Logger, env: Env) {
  return (err: any, req: Request, res: Response, _next: NextFunction) => {
    let status = err.status || 500;
    let message = err.message || "Internal Server Error";
    let details: any = undefined;

    // Handle Zod validation errors
    if (err instanceof ZodError) {
      status = 400;
      message = "Validation failed";
      details = z.treeifyError(err);
      logger.warn("Validation error", { url: req.originalUrl, details });
    }

    // Prisma/DB not found → 404
    if (err.code === "P2025" || err.meta?.cause?.includes("not found")) {
      status = 404;
      message = "Resource not found";
    }

    // Log full context
    logger.error("Unhandled error", {
      method: req.method,
      url: req.originalUrl,
      status,
      message,
      stack: err.stack,
      user: (req as any).user || null,
      ip: req.ip,
    });

    // Response (hide stack in production)
    const response: any = {
      success: false,
      status,
      message,
    };

    if (details) response.details = details;

    if (env.NODE_ENV !== "production" && err.stack) {
      response.stack = err.stack;
    }

    res.status(status).json(response);
  };
}
