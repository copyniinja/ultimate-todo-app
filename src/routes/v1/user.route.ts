import { Middlewares } from "@/app";
import { UserController } from "@/controllers/user.controller";
import { Router } from "express";

export function createUserRoutes(
  userController: UserController,
  middlewares: Middlewares,
) {
  const router = Router();
  const { validate } = middlewares;

  router.post("/register", userController.register);

  return router;
}
