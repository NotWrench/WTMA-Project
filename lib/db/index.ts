import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { getDrizzleDatabaseUrl } from "../../utils/drizzle-env";
import {
  account,
  accountRelations,
  budgetCategory,
  budgetCategoryRelations,
  expense,
  expenseRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from "./schema";

const schema = {
  user,
  session,
  account,
  verification,
  expense,
  budgetCategory,
  userRelations,
  sessionRelations,
  accountRelations,
  expenseRelations,
  budgetCategoryRelations,
};

const client = neon(getDrizzleDatabaseUrl());

export const db = drizzle({ client, schema });
