import { Logger } from "@/logger/types";
import { NextFunction, Request, Response } from "express";

export function requestLoggerMiddleware(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // hide passwords in logs
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = "******";
    if (safeBody.confirmPassword) safeBody.confirmPassword = "******";

    // Log incoming request
    logger.info("Incoming request", {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get("user-agent"),
      body: Object.keys(safeBody).length > 0 ? safeBody : undefined,
      query: req.query,
      params: req.params,
      user: (req as any).user || null,
    });
    // Log response when finished
    const oldJson = res.json;
    res.json = function (body) {
      const duration = Date.now() - start;
      logger.info("Response sent", {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
      });
      return oldJson.call(this, body);
    };
    next();
  };
}
