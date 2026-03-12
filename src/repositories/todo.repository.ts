import { PrismaClient } from "@prisma/client";

// Types
export interface Todo {
  title: string;
  description?: string;
  completed: boolean;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  userId?: string;
  dueDate?: Date;
}
export interface TodoRecord {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  userId: string;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastNotifiedAt: Date | null;
}
export interface TodoRepo {
  create(userId: string, todo: Todo): Promise<TodoRecord>;
  getById(todoId: string): Promise<TodoRecord | null>;
  getAll(userId: string): Promise<TodoRecord[]>;
  update(todoId: string, todo: Partial<Todo>): Promise<TodoRecord>;
  remove(todoId: string): Promise<void>;
  markAsCompleted(todoId: string): Promise<void>;
  markAsNotified(todoId: string): Promise<void>;
}

// Todo repository
export function createTodoRepository(prisma: PrismaClient): TodoRepo {
  // create a todo
  async function create(userId: string, todo: Todo) {
    return prisma.todo.create({
      data: { ...todo, userId },
    });
  }
  // get a todo by id
  async function getById(todoId: string) {
    return prisma.todo.findUnique({
      where: { id: todoId },
    });
  }

  // get all todos of the user
  async function getAll(userId: string) {
    return prisma.todo.findMany({
      where: {
        userId,
      },
    });
  }
  // update a todo
  async function update(todoId: string, todo: Todo) {
    return prisma.todo.update({
      where: {
        id: todoId,
      },
      data: todo,
    });
  }
  // remove a todo
  async function remove(todoId: string) {
    await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });
  }
  async function markAsCompleted(todoId: string) {
    await prisma.todo.update({
      where: { id: todoId },
      data: { completed: true, completedAt: new Date() },
    });
  }
  async function markAsNotified(todoId: string) {
    await prisma.todo.update({
      where: { id: todoId },
      data: { lastNotifiedAt: new Date() },
    });
  }

  return {
    create,
    getById,
    getAll,
    update,
    remove,
    markAsCompleted,
    markAsNotified,
  };
}
