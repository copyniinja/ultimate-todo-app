import { UserRepo } from "@/repositories/user.repository";

export function createUserService(userRepo: UserRepo) {
  // Register user
  async function register({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    // check if the user already exists
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error("Email already exists");
    // hash password
    // create user
    const user = await userRepo.create(email, name, password);

    return user;
  }

  return {
    register,
  };
}

export type UserService = ReturnType<typeof createUserService>;
