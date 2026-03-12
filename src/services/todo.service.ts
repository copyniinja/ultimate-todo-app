import { TodoRepo } from "@/repositories/todo.repository";

export function createTodoService(todoRepo: TodoRepo) {}

export type TodoService = ReturnType<typeof createTodoService>;
