import { Role } from "@/services/token.service";
import { PrismaClient } from "@prisma/client";

export function createUserRepository(prisma: PrismaClient) {
  // Find a user by email
  async function findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { todos: true },
    });
  }
  // Create a user
  async function create(
    email: string,
    name: string,
    password: string,
    role: Role,
  ) {
    return prisma.user.create({
      data: {
        email,
        name,
        password,
        role,
      },
    });
  }
  return {
    findByEmail,
    create,
  };
}

export type UserRepo = ReturnType<typeof createUserRepository>;
