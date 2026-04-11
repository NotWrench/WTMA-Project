import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { env } from "./utils/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
    ssl: true
  },
});
