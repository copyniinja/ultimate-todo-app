import { UserService } from "@/services/user.service";
import { Request, Response } from "express";

export function createAuthController(userService: UserService) {
  async function register(req: Request, res: Response) {
    try {
      const { email, name, password } = req.body;

      const user = await userService.register({ email, name, password });
      console.log(user);
      // Response
      res.status(201).json({ success: true, message: "User registered" });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: (error as Error).message });
    }
  }

  async function login(req: Request, res: Response) {}
  return {
    register,
    login,
  };
}

export type AuthController = ReturnType<typeof createAuthController>;
