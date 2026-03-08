import { TokenService } from "@/services/token.service";
import { UserService } from "@/services/user.service";
import { Request, Response } from "express";

export function createAuthController(
  userService: UserService,
  tokenService: TokenService,
) {
  async function register(req: Request, res: Response) {
    try {
      const { email, name, password, role } = req.body;

      const user = await userService.register({ email, name, password, role });
      // Response
      res.status(201).json({ success: true, message: "User registered" });
    } catch (error) {
      res
        .status(400)
        .json({ success: false, message: (error as Error).message });
    }
  }

  async function login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      // verify user credentials
      const user = await userService.login(email, password);

      // generate tokens
      const { accessToken, expiresIn, refreshToken } =
        await tokenService.createTokenPair(user.id, user.role);

      // set refresh token in secure cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });

      // response
      res.status(200).json({
        success: true,
        accessToken,
        expiresIn,
        user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
  return {
    register,
    login,
  };
}

export type AuthController = ReturnType<typeof createAuthController>;
