import { Controllers, Middlewares } from "@/app";
import { Router } from "express";
import { createUserRoutes } from "./user.route";

export function v1Routes(controllers: Controllers, middlewares: Middlewares) {
  const router = Router();

  // Mount resource specific routers
  router.use("/users", createUserRoutes(controllers.user, middlewares));

  return router;
}
