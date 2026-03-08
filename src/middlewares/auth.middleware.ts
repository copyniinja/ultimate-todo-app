import { Role, TokenService } from "@/services/token.service";
import { NextFunction, Request, Response } from "express";

export function createAuthMiddleware(tokenService: TokenService) {
  function authenticate() {
    return function (req: Request, res: Response, next: NextFunction) {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "No bearer token in auth header",
        });
      }
      const [_, token] = authHeader.split(" ");
      // verify token
      try {
        const tokenObject = tokenService.verifyAccessToken(token);
        if (!tokenObject.isValid) {
          return res.status(401).json({
            success: false,
            message: `${tokenObject.error} token: ${tokenObject.message}`,
          });
        }

        req.userId = tokenObject.userId;
        req.role = tokenObject.role || "USER";

        // to the next middlewares
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal server",
        });
      }
    };
  }

  // authorization
  function authorization(roles: Role[]) {
    return function (req: Request, res: Response, next: NextFunction) {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }
      if (!req.role || !roles.includes(req.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions",
        });
      }
      next();
    };
  }

  return {
    authenticate,
    authorization,
  };
}

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;
