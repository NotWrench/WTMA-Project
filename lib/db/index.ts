import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../../utils/env";
import {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from "./schema";

const globalForDb = globalThis as typeof globalThis & {
  wtmaPool?: Pool;
};

const pool =
  globalForDb.wtmaPool ??
  new Pool({
    connectionString: env.DATABASE_URL,
  });

const schema = {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
};

if (env.NODE_ENV !== "production") {
  globalForDb.wtmaPool = pool;
}

export const db = drizzle(pool, { schema });
export { pool };
