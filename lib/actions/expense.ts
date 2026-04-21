"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { expense } from "@/lib/db/schema";

const createExpenseSchema = z.object({
  amountRupees: z.number().positive(),
  category: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  merchant: z.string().min(1),
  notes: z.string(),
  paymentMethod: z.string().min(1),
});

export type CreateExpenseResult = { ok: true } | { ok: false; error: string };

export async function createExpense(
  input: z.infer<typeof createExpenseSchema>
): Promise<CreateExpenseResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { ok: false, error: "Not signed in." };
  }

  const parsed = createExpenseSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Invalid expense data." };
  }

  const { amountRupees, category, date, merchant, notes, paymentMethod } =
    parsed.data;
  const amountPaise = Math.round(amountRupees * 100);

  const occurredAt = new Date(`${date}T12:00:00`);

  await db.insert(expense).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    amountPaise,
    occurredAt,
    merchant,
    notes: notes.trim(),
    category,
    status: "completed",
    paymentMethod,
  });

  revalidatePath("/");
  revalidatePath("/expenses");
  revalidatePath("/budgets");
  revalidatePath("/reports");
  revalidatePath("/settings");

  return { ok: true };
}
