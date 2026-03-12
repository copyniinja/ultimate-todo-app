import { TodoService } from "@/services/todo.service";

export function createTodoController(todoService: TodoService) {}
export type TodoController = ReturnType<typeof createTodoController>;
