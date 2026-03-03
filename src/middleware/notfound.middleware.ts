import { NextFunction, Request, Response } from "express";
import { Logger } from "../logger/types";

export function notFoundHandler(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Log the 404 for monitoring
    logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
      user: (req as any).user || null,
    });

    res.status(404).json({
      success: false,
      status: 404,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  };
}
