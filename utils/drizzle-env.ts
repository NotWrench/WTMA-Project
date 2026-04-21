import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

/**
 * Database URL for Drizzle CLI and scripts. Do not import `utils/env` here — it
 * uses `server-only` and breaks drizzle-kit when the config is loaded.
 */
export function getDrizzleDatabaseUrl(): string {
  const url =
    process.env.NODE_ENV === "production"
      ? (process.env.DATABASE_POOLER_URL ?? process.env.DATABASE_URL)
      : (process.env.DATABASE_URL ?? process.env.DATABASE_POOLER_URL);

  if (!url) {
    throw new Error(
      "Set DATABASE_URL (or DATABASE_POOLER_URL in production) for Drizzle."
    );
  }

  return url;
}
