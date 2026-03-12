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
export interface TodoRecord extends Todo {
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  lastNotified?: Date;
}
export interface TodoRepo {
  create(todo: Todo): Promise<TodoRecord>;
  get(todoId: string): Promise<TodoRecord | null>;
  getAll(userId: string): Promise<TodoRecord[]>;
  update(todoId: string, todo: Partial<Todo>): Promise<TodoRecord>;
  delete(todoId: string): Promise<void>;
  markAsCompleted(todoId: string): Promise<void>;
  markAsNotified(todoId: string): Promise<void>;
}

// Todo repository
export function createTodoRepository(prisma: PrismaClient): TodoRepo | any {}
