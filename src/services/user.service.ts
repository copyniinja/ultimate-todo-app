import { UserRepo } from "@/repositories/user.repository";
import bcrypt from "bcrypt";
import { Role } from "./token.service";

export function createUserService(userRepo: UserRepo) {
  // Register user
  async function register({
    email,
    name,
    password,
    role,
  }: {
    email: string;
    name: string;
    password: string;
    role: Role;
  }) {
    // check if the user already exists
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error("Email already exists");
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user
    return userRepo.create(email, name, hashedPassword, role);
  }

  async function getUserByEmail(email: string) {
    return userRepo.findByEmail(email);
  }

  async function login(email: string, password: string) {
    // check user exists
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("User does not exists");
    // compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");
    // return user without password
    return { ...user, password: undefined };
  }

  return {
    register,
    login,
  };
}

export type UserService = ReturnType<typeof createUserService>;
