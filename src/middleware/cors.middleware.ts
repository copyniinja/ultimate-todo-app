import { Env } from "@/config/env";
import cors, { CorsOptions } from "cors";
import { NextFunction, Request, Response } from "express";
import { Logger } from "../logger/types";

// CORS middleware
export function corsMiddleware(logger: Logger, env: Env) {
  // Allowed origins
  const allowedOrigins = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];

  // CORS options
  const corsOptions: CorsOptions = {
    origin(requestOrigin, callback) {
      // allow request with no origin (mobile,postman)
      if (!requestOrigin) return callback(null, true);

      // allow request in development mode
      if (env.NODE_ENV === "development") return callback(null, true);

      // only allow request defined in env (in production)
      if (allowedOrigins.includes(requestOrigin)) return callback(null, true);

      // blocked: log and deny
      logger.warn(`CORS blocked origin:${requestOrigin || "no-origin"}`);
      return callback(
        new Error(`Origin ${requestOrigin} not allowed by CORS`),
        false,
      );
    },

    // cookies,authentication header
    credentials: true,
    // allowed http method
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    // allowed request headers
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-CSRF-Token",
    ],
    // cache preflight (OPTIONS)
    maxAge: 86400, // 24h
    // return 204 for OPTIONS
    optionsSuccessStatus: 204,
  };
  return cors(corsOptions);
}

// CORS global error handler
export function corsErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.message.includes("not allowed by CORS")) {
    return res.status(403).json({
      success: false,
      message: "CORS policy: This origin is not allowed",
    });
  }
  next(err);
}
