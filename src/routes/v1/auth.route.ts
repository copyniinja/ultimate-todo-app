import { Middlewares } from "@/app";
import { AuthController } from "@/controllers/auth.controller";
import { Request, Response, Router } from "express";
import { loginUserSchema, registerUserSchema } from "../../validators";

export function createAuthRoutes(
  authController: AuthController,
  middlewares: Middlewares,
) {
  const router = Router();
  const { validate, auth } = middlewares;

  router.post(
    "/register",
    validate(registerUserSchema),
    authController.register,
  );

  router.post("/login", validate(loginUserSchema), authController.login);

  router.get(
    "/test-auth",
    auth.authenticate(),
    auth.authorization(["ADMIN"]),
    (req: Request, res: Response) => {
      res.json({
        success: true,
        user: req.userId,
        role: req.role,
      });
    },
  );

  router.post("/refresh", authController.refresh);
  return router;
}
