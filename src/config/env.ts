// Config
import dotenv from "dotenv";
import { z } from "zod";

// Load config
dotenv.config();

// Zod schema
const envSchema = z.object({
  PORT: z.string().default("8080").transform(Number),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.url(),
});

// Type
export type Env = z.infer<typeof envSchema>;

// Load Env
export function loadEnv(): Env {
  // Schema validation
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:");
    const formatted = z.treeifyError(parsed.error);
    console.dir(formatted, { depth: null });
    // force exit
    process.exit(1);
  }
  return parsed.data;
}
