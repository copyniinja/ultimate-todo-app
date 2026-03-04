import { UserController } from "@/controllers/user.controller";
import { Router } from "express";

export function createUserRoutes(userController: UserController) {
  const router = Router();

  router.post("/register", userController.register);

  return router;
}
