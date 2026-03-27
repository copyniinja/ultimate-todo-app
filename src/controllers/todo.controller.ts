import { CacheService } from "@/services/cache.service";
import { TodoService } from "@/services/todo.service";
import { getErrorMessage } from "@/utils/error.util";
import { Request, Response } from "express";

const VERSION = `v1`;
export function createTodoController(
  todoService: TodoService,
  cacheService: CacheService,
) {
  async function create(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }
      const todo = await todoService.createTodo(userId, req.body);
      if (todo.id) {
        await cacheService.invalidate(
          `api:todos:u:${userId}:/api/${VERSION}/todos`,
        );
      }

      return res.status(201).json(todo);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: getErrorMessage(error) });
    }
  }

  async function getOne(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      const todo = await todoService.getTodo(id, userId);
      return res.status(200).json(todo);
    } catch (error) {
      return res
        .status(404)
        .json({ success: false, error: getErrorMessage(error) });
    }
  }

  async function update(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      const updatedTodo = await todoService.updateTodo(id, userId, req.body);
      if (updatedTodo.id) {
        await cacheService.invalidate(
          `api:todos:u:${userId}:/api/${VERSION}/todos/${updatedTodo.id}`,
        );
      }
      return res.status(200).json(updatedTodo);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: getErrorMessage(error) });
    }
  }

  async function markCompleted(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      await todoService.completeTodo(id, userId);

      await cacheService.invalidate(
        `api:todos:u:${userId}:/api/${VERSION}/todos/${id}`,
      );

      return res.status(204).send();
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: getErrorMessage(error) });
    }
  }

  async function markNotified(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      await todoService.notifyTodo(id, userId);
      return res.status(204).send();
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: getErrorMessage(error) });
    }
  }
  async function remove(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      await todoService.deleteTodo(id, userId);
      await cacheService.invalidate(
        `api:todos:u:${userId}:/api/${VERSION}/todos/${id}`,
      );
      return res.status(204).send();
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, error: getErrorMessage(error) });
    }
  }
  async function getAll(req: Request, res: Response) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated",
        });
      }

      const todo = await todoService.getUserTodos(userId);
      return res.status(200).json(todo);
    } catch (error) {
      return res
        .status(404)
        .json({ success: false, error: getErrorMessage(error) });
    }
  }

  return {
    create,
    getOne,
    getAll,
    update,
    markCompleted,
    markNotified,
    remove,
  };
}

export type TodoController = ReturnType<typeof createTodoController>;
