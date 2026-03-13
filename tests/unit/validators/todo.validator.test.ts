import { createTodoSchema } from "@/validators/todo.validator";
import { Priority } from "@prisma/client";

describe("Todo validator", () => {
  describe("createTodoValidator", () => {
    it("should validate correct todo data with all fields", () => {
      const validTodo = {
        body: {
          title: "Finish the API",
          description: "Complete the Zod and Jest tests",
          priority: Priority.HIGH,
          dueDate: new Date().toISOString(),
        },
      };

      const result = createTodoSchema.parse(validTodo);

      expect(result.body.title).toBe(validTodo.body.title);
      expect(result.body.priority).toBe(Priority.HIGH);
    });

    it("should validate with only required fields and apply defaults", () => {
      const minimalTodo = {
        body: {
          title: "Buy groceries",
        },
      };

      const result = createTodoSchema.parse(minimalTodo);

      // No if-block needed. Linter is happy.
      expect(result.body.priority).toBe(Priority.MEDIUM);
      expect(result.body.completed).toBe(false);
    });

    it("should reject if title is missing", () => {
      const invalidData = {
        body: {
          description: "Missing title",
        },
      };

      const result = createTodoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject if title exceeds 255 characters", () => {
      const invalidData = {
        body: {
          title: "a".repeat(256),
        },
      };

      const result = createTodoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid Priority enums", () => {
      const invalidData = {
        body: {
          title: "Invalid Priority",
          priority: "SUPER_URGENT",
        },
      };

      const result = createTodoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid ISO date formats", () => {
      const invalidData = {
        body: {
          title: "Invalid Date",
          dueDate: "20-05-2024",
        },
      };

      const result = createTodoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
