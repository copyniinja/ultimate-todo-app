import { UserRepo } from "@/repositories/user.repository";

export function createUserService(userRepo: UserRepo) {
  // Register user
  async function register({ email, name }: { email: string; name: string }) {
    // check if the user already exists
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error("Email already exists");
    // hash password
    // create user
    const user = await userRepo.create(email, name);

    return user;
  }

  return {
    register,
  };
}

export type UserService = ReturnType<typeof createUserService>;
