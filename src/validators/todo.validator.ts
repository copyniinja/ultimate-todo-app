import { Priority } from "@prisma/client";
import { z } from "zod";

// Todo body
const todoBody = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional().nullable(),
  priority: z.enum(Priority).default(Priority.MEDIUM),
  dueDate: z.iso.datetime().optional().nullable(),
  completed: z.boolean().optional().default(false),
});

// For POST /todos
export const createTodoSchema = z.object({
  body: todoBody,
});

// For PUT /todos/:id
export const updateTodoSchema = z.object({
  params: z.object({
    id: z.cuid("Invalid ID format"),
  }),
  body: todoBody.partial(),
});

// For GET/DELETE /todos/:id
export const todoIdSchema = z.object({
  params: z.object({
    id: z.cuid("Invalid ID format"),
  }),
});
