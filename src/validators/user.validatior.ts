import z from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.email(),
});
