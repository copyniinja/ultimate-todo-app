import { PrismaClient } from "@prisma/client";

export interface RefreshToken {
  hashedToken: string;
  userId: number;
  family: string;
  expiresAt: Date;
  lastUsedAt: Date;
  createdAt: Date;
  role: "ADMIN" | "USER";
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

export function createTokenRepository(prisma: PrismaClient): TokenRepo {
  // create token
  async function create(record: RefreshToken) {
    await prisma.token.create({ data: record });
  }
  // find by hashed token
  async function findByHashedToken(hashedToken: string) {
    return prisma.token.findFirst({
      where: {
        hashedToken,
      },
    });
  }

  async function updateHashedToken(
    oldHash: string,
    update: Partial<RefreshToken>,
  ) {
    await prisma.token.update({
      where: {
        hashedToken: oldHash,
      },
      data: update,
    });
  }

  async function deleteByHashedToken(hashedToken: string) {
    await prisma.token.delete({ where: { hashedToken } });
  }

  async function deleteByFamily(family: string) {
    await prisma.token.deleteMany({ where: { family } });
  }

  async function deleteAllByUserId(userId: number) {
    await prisma.token.deleteMany({
      where: {
        userId,
      },
    });
  }

  return {
    create,
    deleteAllByUserId,
    deleteByFamily,
    deleteByHashedToken,
    findByHashedToken,

    updateHashedToken,
  };
}
