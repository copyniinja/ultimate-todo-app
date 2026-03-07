import { PrismaClient } from "@prisma/client";

export interface RefreshToken {
  hashedToken: string;
  userId: number;
  family: string;
  expiresAt: Date;
  lastUsedAt: Date;
  createdAt: Date;
}
export interface TokenRepo {
  create(record: RefreshToken): Promise<void>;
  findByHashedToken(hashedToken: string): Promise<RefreshToken | null>;
  updateHashedToken(
    oldHash: string,
    update: Partial<RefreshToken>,
  ): Promise<void>;
  deleteByHashedToken(hashedToken: string): Promise<void>;
  deleteByFamily(family: string): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
}

export function createTokenRepository(prisma: PrismaClient): TokenRepo | void {}
