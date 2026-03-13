import { Todo, TodoRecord, TodoRepo } from "@/repositories/todo.repository";

export function createTodoService(todoRepo: TodoRepo) {
  async function createTodo(userId: string, data: Todo): Promise<TodoRecord> {
    // TODO:check user limit
    return await todoRepo.create(userId, data);
  }

  async function getTodo(todoId: string, userId: string): Promise<TodoRecord> {
    const todo = await todoRepo.getById(todoId);

    if (!todo) {
      throw new Error(`Todo with ID ${todoId} not found`);
    }
    if (todo.userId !== userId) {
      throw new Error("Unauthorized: You do not own this todo");
    }

    return todo;
  }

  async function updateTodo(
    todoId: string,
    userId: string,
    data: Partial<Todo>,
  ): Promise<TodoRecord> {
    // Check existence and ownership first
    await getTodo(todoId, userId);

    return await todoRepo.update(todoId, data);
  }

  async function completeTodo(todoId: string, userId: string): Promise<void> {
    const todo = await getTodo(todoId, userId);

    if (todo.completed) {
      return; // Idempotency: don't do anything if already completed
    }

    await todoRepo.markAsCompleted(todoId);
  }

  async function deleteTodo(todoId: string, userId: string): Promise<void> {
    await getTodo(todoId, userId); // Ensure it exists and user owns it
    await todoRepo.remove(todoId);
  }

  return {
    createTodo,
    getTodo,
    updateTodo,
    completeTodo,
    deleteTodo,
    getUserTodos: todoRepo.getAll,
  };
}

export type TodoService = ReturnType<typeof createTodoService>;
