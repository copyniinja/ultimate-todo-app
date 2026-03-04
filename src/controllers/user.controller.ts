import { UserService } from "@/services/user.service";
import { Request, Response } from "express";

export function createUserController(userService: UserService) {
  async function register(req: Request, res: Response) {
    try {
      const { email, name } = req.body;

      const user = await userService.register({ email, name });
      console.log(user);
      // Response
      res.status(201).json({ success: true, message: "User registered" });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  }

  return {
    register,
  };
}

export type UserController = ReturnType<typeof createUserController>;
