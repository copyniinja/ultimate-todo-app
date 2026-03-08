import { Env } from "@/configs/env";
import { TokenRepo } from "@/repositories/token.repository";
import { UserService } from "@/services/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
// types
export type Role = "ADMIN" | "USER";

// Create token service
export function createTokenService(
  env: Env,
  userService: UserService,
  tokenRepo: TokenRepo,
) {
  // config
  const ACCESS_SECRET = env.JWT_ACCESS_SECRET;
  const ACCESS_TTL = env.JWT_ACCESS_TTL_SECONDS;
  const REFRESH_TTL = env.JWT_REFRESH_TTL_SECONDS;
  const BCRYPT_ROUNDS = 10;

  // generate jwt access token
  function generateAccessToken(userId: number, role: Role) {
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
        role: payload.role as Role,
      };
    } catch (error: any) {
      return {
        isValid: false,
        error: error.name === "TokenExpiredError" ? "expired" : "invalid",
        message: error.message,
      };
    }
  }

  // hash refresh token
  async function hashRefreshToken(token: string) {
    return bcrypt.hash(token, BCRYPT_ROUNDS);
  }
  // compare refresh token
  async function compareRefreshToken(plainToken: string, hashedToken: string) {
    return bcrypt.compare(plainToken, hashedToken);
  }
  // generate random cryptographically secure refresh token
  function generateRefreshToken() {
    return randomBytes(40).toString("hex");
  }

  // create token pair
  async function createTokenPair(userId: number, role: Role) {
    const accessToken = generateAccessToken(userId, role);
    const rawRefreshToken = generateRefreshToken();
    const hashedRefreshToken = await hashRefreshToken(rawRefreshToken);
    const family = randomBytes(16).toString("hex");
    const now = new Date();

    await tokenRepo.create({
      userId,
      hashedToken: hashedRefreshToken,
      family: family,
      createdAt: now,
      lastUsedAt: now,
      expiresAt: new Date(now.getTime() + REFRESH_TTL * 1000),
      role,
    });
    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: ACCESS_TTL,
    };
  }

  // refresh flow with token rotation
  async function refreshToken(oldRefreshToken: string) {
    // find existing record by hash
    const record = await tokenRepo.findByHashedToken(
      await hashRefreshToken(oldRefreshToken),
    );
    if (!record) return null;
    const now = new Date();
    // token expired?
    if (now > record.expiresAt) {
      await tokenRepo.deleteByFamily(record.family);
      return null;
    }
    // Rotate issue new token
    const newRawRefreshToken = generateRefreshToken();
    const newHashedRefreshToken = await hashRefreshToken(newRawRefreshToken);

    // update token
    await tokenRepo.updateHashedToken(record.hashedToken, {
      hashedToken: newHashedRefreshToken,
      lastUsedAt: now,
    });
    // new access token
    const newAccessToken = generateAccessToken(record.userId, record.role);

    return {
      newAccessToken,
      refreshToken: newRawRefreshToken,
      expiresIn: ACCESS_TTL,
    };
  }

  // revoke refresh token
  async function revokeRefreshToken(token: string) {
    const hash = await hashRefreshToken(token);
    await tokenRepo.deleteByHashedToken(hash);
  }

  return {
    generateAccessToken,
    verifyAccessToken,
    createTokenPair,
    refreshToken,
    revokeRefreshToken,
  };
}

export type TokenService = ReturnType<typeof createTokenService>;
