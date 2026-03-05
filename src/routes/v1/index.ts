import { Controllers, Middlewares } from "@/app";
import { Router } from "express";
import { createAuthRoutes } from "./auth.route";

export function v1Routes(controllers: Controllers, middlewares: Middlewares) {
  const router = Router();

  // Mount resource specific routers
  router.use("/auth", createAuthRoutes(controllers.auth, middlewares));

  return router;
}
