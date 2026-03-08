import { Middlewares } from "@/app";
import { AuthController } from "@/controllers/auth.controller";
import { Router } from "express";
import { loginUserSchema, registerUserSchema } from "../../validators";

export function createAuthRoutes(
  authController: AuthController,
  middlewares: Middlewares,
) {
  const router = Router();
  const { validate } = middlewares;

  router.post(
    "/register",
    validate(registerUserSchema),
    authController.register,
  );

  router.post("/login", validate(loginUserSchema), authController.login);

  return router;
}
