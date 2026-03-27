import { Middlewares } from "@/app";
import { TodoController } from "@/controllers/todo.controller";
import {
  createTodoSchema,
  todoIdSchema,
  updateTodoSchema,
} from "@/validators/todo.validator";
import { Router } from "express";

export function createTodoRoutes(
  todoController: TodoController,
  middlewares: Middlewares,
) {
  const {
    validate,
    auth,
    cache: { protectedCache, publicCache },
  } = middlewares;
  const router = Router();

  router.use(auth.authenticate()).use(auth.authorization(["USER"]));

  router.post("/", validate(createTodoSchema), todoController.create);
  router.get(
    "/",
    validate(createTodoSchema),
    protectedCache({ keyPrefix: "todos" }),
    todoController.getAll,
  );
  router.get(
    "/:id",
    validate(todoIdSchema),
    protectedCache({ keyPrefix: "todo", ttl: 120 }),
    todoController.getOne,
  );
  router.put("/:id", validate(updateTodoSchema), todoController.update);
  router.delete("/:id", validate(todoIdSchema), todoController.remove);
  router.patch(
    "/:id/complete",
    validate(todoIdSchema),
    todoController.markCompleted,
  );
  router.patch(
    "/:id/notify",
    validate(todoIdSchema),
    todoController.markNotified,
  );

  return router;
}
