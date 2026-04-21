import { defineConfig } from "drizzle-kit";

import { getDrizzleDatabaseUrl } from "./utils/drizzle-env";

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getDrizzleDatabaseUrl(),
    ssl: true,
  },
});
