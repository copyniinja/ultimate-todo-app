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
      const result = createTodoSchema.safeParse(validTodo);
      expect(result.success).toBe(true);
    });

    it("should validate with only required fields", () => {
      const minimalTodo = {
        body: {
          title: "Buy groceries",
        },
      };
      const result = createTodoSchema.safeParse(minimalTodo);
      expect(result.success).toBe(true);
      // Check if default values are applied
      if (result.success) {
        expect(result.data.body.priority).toBe(Priority.MEDIUM);
      }
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
          priority: "SUPER_URGENT", // Not in enum
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
