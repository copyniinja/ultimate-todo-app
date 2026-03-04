import { PrismaClient } from "@/generated/prisma/client";

export function createUserRepository(prisma: PrismaClient) {
  // Find a user by email
  async function findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { todos: true },
    });
  }
  // Create a user
  async function create(email: string, name: string) {
    return prisma.user.create({
      data: {
        email,
        name,
      },
    });
  }
  return {
    findByEmail,
    create,
  };
}

export type UserRepo = ReturnType<typeof createUserRepository>;
