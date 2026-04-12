import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { databaseConnectionUrl } from "./utils/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseConnectionUrl,
    ssl: true,
  },
});
