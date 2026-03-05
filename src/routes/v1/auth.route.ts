import { Middlewares } from "@/app";
import { AuthController } from "@/controllers/auth.controller";
import { loginUserSchema, registerUserSchema } from "@/validators";
import { Router } from "express";

export function createAuthRoutes(
  userController: AuthController,
  middlewares: Middlewares,
) {
  const router = Router();
  const { validate } = middlewares;

  router.post(
    "/register",
    validate(registerUserSchema),
    userController.register,
  );

  router.post("/login", validate(loginUserSchema), userController.login);

  return router;
}
