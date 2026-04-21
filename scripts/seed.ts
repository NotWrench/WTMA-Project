import "./load-env";

import { eq, inArray, or } from "drizzle-orm";

import { db } from "../lib/db/index";
import { budgetCategory, expense } from "../lib/db/schema";

const SEED_USER_ID = "EXdX3Dql76wDuTqwaU91YHIBrmNec1B6";

/** Stable PKs — delete by id so re-seed works if `user_id` changed between runs. */
const SEED_BUDGET_IDS = [
  "bcat_seed_housing",
  "bcat_seed_food",
  "bcat_seed_mobility",
  "bcat_seed_subs",
] as const;

const SEED_EXPENSE_IDS = [
  "exp_seed_expenses_1",
  "exp_seed_expenses_2",
  "exp_seed_expenses_3",
  "exp_seed_expenses_4",
  "exp_seed_expenses_5",
  "exp_seed_dash_1",
  "exp_seed_dash_2",
  "exp_seed_dash_3",
  "exp_seed_dash_4",
  "exp_seed_dash_5",
  "exp_seed_dash_6",
] as const;

/** INR whole rupees → paise (minor units). */
function inrPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

async function main() {
  await db
    .delete(expense)
    .where(
      or(
        eq(expense.userId, SEED_USER_ID),
        inArray(expense.id, [...SEED_EXPENSE_IDS])
      )
    );
  await db
    .delete(budgetCategory)
    .where(
      or(
        eq(budgetCategory.userId, SEED_USER_ID),
        inArray(budgetCategory.id, [...SEED_BUDGET_IDS])
      )
    );

  const april2026 = "2026-04-01";

  await db.insert(budgetCategory).values([
    {
      id: "bcat_seed_housing",
      userId: SEED_USER_ID,
      month: april2026,
      label: "Housing",
      allocatedPaise: inrPaise(42_000),
    },
    {
      id: "bcat_seed_food",
      userId: SEED_USER_ID,
      month: april2026,
      label: "Food & Dining",
      allocatedPaise: inrPaise(18_000),
    },
    {
      id: "bcat_seed_mobility",
      userId: SEED_USER_ID,
      month: april2026,
      label: "Mobility",
      allocatedPaise: inrPaise(11_000),
    },
    {
      id: "bcat_seed_subs",
      userId: SEED_USER_ID,
      month: april2026,
      label: "Subscriptions",
      allocatedPaise: inrPaise(4500),
    },
  ]);

  await db.insert(expense).values([
    {
      id: "exp_seed_expenses_1",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(450),
      occurredAt: new Date("2026-04-13T10:42:00+05:30"),
      merchant: "Starbucks",
      notes: "Morning brew - Indiranagar",
      category: "Dining",
      status: "completed",
      paymentMethod: "UPI",
    },
    {
      id: "exp_seed_expenses_2",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(2840),
      occurredAt: new Date("2026-04-12T14:15:00+05:30"),
      merchant: "Amazon India",
      notes: "Office stationery & supplies",
      category: "Work",
      status: "pending",
      paymentMethod: "Card",
    },
    {
      id: "exp_seed_expenses_3",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(4200),
      occurredAt: new Date("2026-04-11T20:00:00+05:30"),
      merchant: "Shell",
      notes: "Sedan refuel",
      category: "Transport",
      status: "completed",
      paymentMethod: "UPI",
    },
    {
      id: "exp_seed_expenses_4",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(1179),
      occurredAt: new Date("2026-04-10T11:30:00+05:30"),
      merchant: "Airtel Broadband",
      notes: "Monthly internet subscription",
      category: "Utilities",
      status: "completed",
      paymentMethod: "Net Banking",
    },
    {
      id: "exp_seed_expenses_5",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(850),
      occurredAt: new Date("2026-04-09T18:45:00+05:30"),
      merchant: "Apollo Pharmacy",
      notes: "Prescription medicines",
      category: "Health",
      status: "completed",
      paymentMethod: "UPI",
    },
    {
      id: "exp_seed_dash_1",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(2450),
      occurredAt: new Date("2026-04-13T12:00:00+05:30"),
      merchant: "Amazon India",
      notes: "Electronic Accessories",
      category: "Electronics",
      status: "completed",
      paymentMethod: "Card",
    },
    {
      id: "exp_seed_dash_2",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(850),
      occurredAt: new Date("2026-04-12T12:00:00+05:30"),
      merchant: "Blue Tokai Coffee",
      notes: "Cafe & Beverages",
      category: "Lifestyle",
      status: "completed",
      paymentMethod: "UPI",
    },
    {
      id: "exp_seed_dash_3",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(35_000),
      occurredAt: new Date("2026-04-10T12:00:00+05:30"),
      merchant: "Property Rent",
      notes: "Housing Monthly",
      category: "Essential",
      status: "scheduled",
      paymentMethod: "Net Banking",
    },
    {
      id: "exp_seed_dash_4",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(4200),
      occurredAt: new Date("2026-04-08T12:00:00+05:30"),
      merchant: "Urban Ladder",
      notes: "Home Upgrade",
      category: "Lifestyle",
      status: "completed",
      paymentMethod: "Card",
    },
    {
      id: "exp_seed_dash_5",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(3260),
      occurredAt: new Date("2026-04-06T12:00:00+05:30"),
      merchant: "Reliance Fresh",
      notes: "Groceries",
      category: "Essential",
      status: "completed",
      paymentMethod: "UPI",
    },
    {
      id: "exp_seed_dash_6",
      userId: SEED_USER_ID,
      amountPaise: inrPaise(11_990),
      occurredAt: new Date("2026-04-04T12:00:00+05:30"),
      merchant: "Croma",
      notes: "Smart Home Device",
      category: "Electronics",
      status: "completed",
      paymentMethod: "Card",
    },
  ]);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
