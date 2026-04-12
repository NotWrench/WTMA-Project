import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  BETTER_AUTH_URL: z.url("BETTER_AUTH_URL must be a valid URL"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET cannot be empty"),
  DATABASE_POOLER_URL: z.url("DATABASE_POOLER_URL must be a valid URL"),
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID cannot be empty"),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, "GOOGLE_CLIENT_SECRET cannot be empty"),
});

const parsedEnv = serverEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid environment variables: ${details}`);
}

export const env = parsedEnv.data;

export const databaseConnectionUrl =
  env.NODE_ENV === "production" ? env.DATABASE_POOLER_URL : env.DATABASE_URL;

export type ServerEnv = z.infer<typeof serverEnvSchema>;
