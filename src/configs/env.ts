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
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_TTL_SECONDS: z.string().default("900").transform(Number),
  JWT_REFRESH_TTL_SECONDS: z.string().default("604800").transform(Number),
  MAILER_GMAIL_USER: z.string(),
  MAILER_APP_PASSWORD: z.string(),
  MAILER_EMAIL_PROVIDER: z.string(),
  POSTMARK_SERVER_TOKEN: z.string(),
  RESEND_API_KEY: z.string(),
  MAILGUN_API_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),
  SENDGRID_API_KEY: z.string(),
  EMAIL_FROM_NAME: z.string(),
  EMAIL_FROM_EMAIL: z.string(),
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
