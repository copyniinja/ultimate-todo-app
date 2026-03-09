import { Env } from "@/configs/env";
import { TokenRepo } from "@/repositories/token.repository";
import jwt from "jsonwebtoken";
import { createHmac, randomBytes } from "node:crypto";
// types
export type Role = "ADMIN" | "USER";

// Create token service
export function createTokenService(env: Env, tokenRepo: TokenRepo) {
  // config
  const ACCESS_SECRET = env.JWT_ACCESS_SECRET;
  const REFRESH_SECRET = env.JWT_REFRESH_SECRET;
  const ACCESS_TTL = env.JWT_ACCESS_TTL_SECONDS;
  const REFRESH_TTL = env.JWT_REFRESH_TTL_SECONDS;
  // const BCRYPT_ROUNDS = 10;

  // generate jwt access token
  function generateAccessToken(userId: number, role: Role) {
    const payload = {
      sub: userId,
      role,
    };
    return jwt.sign(payload, ACCESS_SECRET, {
      algorithm: "HS256",
      expiresIn: ACCESS_TTL,
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
  function hashRefreshToken(token: string) {
    return createHmac("sha256", REFRESH_SECRET).update(token).digest("hex");
  }

  // generate random cryptographically secure refresh token
  function generateRefreshToken() {
    return randomBytes(40).toString("hex");
  }

  // create token pair
  async function createTokenPair(userId: number, role: Role) {
    const accessToken = generateAccessToken(userId, role);
    const rawRefreshToken = generateRefreshToken();
    const hashedRefreshToken = hashRefreshToken(rawRefreshToken);
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
      hashRefreshToken(oldRefreshToken),
    );
    if (!record) throw new Error("Invalid refresh token");
    const now = new Date();
    // token expired?
    if (now > record.expiresAt) {
      await tokenRepo.deleteByFamily(record.family);
      throw new Error("Refresh token expired");
    }
    // Rotate issue new token
    const newRawRefreshToken = generateRefreshToken();
    const newHashedRefreshToken = hashRefreshToken(newRawRefreshToken);

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
      expiresInRefresh: REFRESH_TTL,
    };
  }

  // revoke refresh token
  async function revokeRefreshToken(token: string) {
    const hash = hashRefreshToken(token);
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
