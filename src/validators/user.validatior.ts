import z from "zod";

// Register user
export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(30),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "USER"]).default("USER"),
  }),
});
