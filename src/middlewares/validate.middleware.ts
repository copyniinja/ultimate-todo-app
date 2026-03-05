// middlewares/validation.middleware.ts
import { Logger } from "@/logger/types";
import { NextFunction, Request, Response } from "express";
import { z, ZodObject } from "zod";

export function createValidationMiddleware(logger: Logger) {
  return function validate(schema: ZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // safeParse
        const result = schema.safeParse({
          body: req.body,
          params: req.params,
          query: req.query,
          cookies: req.cookies,
        });

        if (!result.success) {
          const flattenErrors = z.flattenError(result.error);
          logger.warn("validation_failed", {
            url: req.url,
            method: req.method,
            ip: req.ip,
            userAgent: req.get("user-agent"),
            path: req.path,
            query: sanitizeData(req.query),
            body: sanitizeData(req.body),
            errors: flattenErrors,
            timestamp: new Date().toISOString(),
          });

          return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: flattenErrors,
          });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}

export type ValidateMiddleware = ReturnType<typeof createValidationMiddleware>;
// Sanitize sensitive data (password ,token)
function sanitizeData(data: any): any {
  if (!data) return data;

  const sensitiveFields = ["password", "token", "secret", "creditCard", "ssn"];
  const sanitized = { ...data };

  Object.keys(sanitized).forEach((key) => {
    if (sensitiveFields.includes(key.toLowerCase())) {
      sanitized[key] = "*******";
    }
  });

  return sanitized;
}
