import { Env } from "@/configs/env";
import { TokenRepo } from "@/repositories/token.repository";
import { UserService } from "@/services/user.service";
import jwt from "jsonwebtoken";

// Create token service
export function createTokenService(
  env: Env,
  userService: UserService,
  tokenRepo: TokenRepo,
) {
  // config
  const ACCESS_SECRET = env.JWT_ACCESS_SECRET;
  const REFRESH_SECRET = env.JWT_REFRESH_SECRET;
  const ACCESS_TTL = env.JWT_ACCESS_TTL_SECONDS;
  const REFRESH_TTL = env.JWT_REFRESH_TTL_SECONDS;
  const BCRYPT_ROUNDS = 10;

  // generate jwt access token
  function generateAccessToken(userId: number, role: string) {
    const payload = {
      sub: userId,
      role,
    };
    return jwt.sign(payload, ACCESS_SECRET, {
      algorithm: "HS256",
    });
  }

  // verify access token
  function verifyAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, ACCESS_SECRET, {
        algorithms: ["HS256"],
      }) as jwt.JwtPayload;

      if (!payload.sub) {
        throw new Error("UserId missing");
      }
      if (!payload.role) {
        throw new Error("Role missing");
      }
      return {
        isValid: true,
        userId: Number(payload.sub),
        role: payload.role as string,
      };
    } catch (error: any) {
      return {
        isValid: false,
        error: error.name === "TokenExpiredError" ? "expired" : "invalid",
        message: error.message,
      };
    }
  }

  return {};
}

export type TokenService = ReturnType<typeof createTokenService>;
