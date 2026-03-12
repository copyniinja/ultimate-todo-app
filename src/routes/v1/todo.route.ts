import { Middlewares } from "@/app";
import { TodoController } from "@/controllers/todo.controller";
import { Router } from "express";

export function createTodoRoutes(
  todoController: TodoController,
  middlewares: Middlewares,
) {
  const { validate, auth } = middlewares;
  const router = Router();

  router.get("/todo");

  return router;
}
