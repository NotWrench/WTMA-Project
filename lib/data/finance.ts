import "server-only";

import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import type {
  BudgetCategoryRowDTO,
  BudgetPageData,
  CategoryBreakdownItem,
  DashboardSnapshot,
  ExpenseRowDTO,
  ExpensesPageData,
  ReportsPageData,
  SettingsExportRow,
  TransactionRowDTO,
  TrendPoint,
} from "@/lib/data/finance-types";
import { db } from "@/lib/db";
import { budgetCategory, expense } from "@/lib/db/schema";
import {
  type DbExpenseStatus,
  expenseStatusLabel,
} from "@/lib/expense-display";

export type {
  BudgetCategoryRowDTO,
  BudgetPageData,
  CategoryBreakdownItem,
  DashboardSnapshot,
  ExpenseRowDTO,
  ExpensesPageData,
  ReportsPageData,
  SettingsExportRow,
  TransactionRowDTO,
  TrendPoint,
} from "@/lib/data/finance-types";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const TONE_CLASSES = [
  "bg-primary",
  "bg-secondary",
  "bg-tertiary",
  "bg-destructive",
] as const;

const BUDGET_LABEL_TO_EXPENSE_CATEGORIES: Record<string, string[]> = {
  Housing: ["Housing", "Essential"],
  "Food & Dining": ["Food & Dining", "Dining"],
  Mobility: ["Mobility", "Transport"],
  Subscriptions: ["Subscriptions", "Utilities", "Work"],
};

function budgetExpenseCategories(label: string): string[] {
  return BUDGET_LABEL_TO_EXPENSE_CATEGORIES[label] ?? [label];
}

function firstDayOfMonthString(d: Date): string {
  return format(startOfMonth(d), "yyyy-MM-dd");
}

export async function sumExpensesInRange(
  userId: string,
  from: Date,
  to: Date
): Promise<number> {
  const [row] = await db
    .select({
      total: sql<number>`coalesce(sum(${expense.amountPaise}), 0)::int`,
    })
    .from(expense)
    .where(
      and(
        eq(expense.userId, userId),
        gte(expense.occurredAt, from),
        lte(expense.occurredAt, to)
      )
    );

  return row?.total ?? 0;
}

export async function listExpensesForUser(
  userId: string,
  limit = 500
): Promise<ExpenseRowDTO[]> {
  const rows = await db
    .select()
    .from(expense)
    .where(eq(expense.userId, userId))
    .orderBy(desc(expense.occurredAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    amountPaise: r.amountPaise,
    occurredAtIso: r.occurredAt.toISOString(),
    merchant: r.merchant,
    notes: r.notes,
    category: r.category,
    status: r.status as ExpenseRowDTO["status"],
    paymentMethod: r.paymentMethod,
  }));
}

function toTransactionRowDTO(
  r: (typeof expense.$inferSelect)[]
): TransactionRowDTO[] {
  return r.map((row) => ({
    id: row.id,
    merchant: row.merchant,
    description: row.notes || "—",
    category: row.category,
    dateDisplay: format(row.occurredAt, "MMM dd, yyyy"),
    amountPaise: row.amountPaise,
    status: row.status as TransactionRowDTO["status"],
  }));
}

export async function getRecentTransactions(
  userId: string,
  limit = 20
): Promise<TransactionRowDTO[]> {
  const rows = await db
    .select()
    .from(expense)
    .where(eq(expense.userId, userId))
    .orderBy(desc(expense.occurredAt))
    .limit(limit);

  return toTransactionRowDTO(rows);
}

async function sumBudgetAllocatedForMonth(
  userId: string,
  monthStart: Date
): Promise<number> {
  const key = firstDayOfMonthString(monthStart);
  const [row] = await db
    .select({
      total: sql<number>`coalesce(sum(${budgetCategory.allocatedPaise}), 0)::int`,
    })
    .from(budgetCategory)
    .where(
      and(eq(budgetCategory.userId, userId), eq(budgetCategory.month, key))
    );

  return row?.total ?? 0;
}

async function sumSpentForBudgetLabel(
  userId: string,
  monthStart: Date,
  monthEnd: Date,
  label: string
): Promise<number> {
  const cats = budgetExpenseCategories(label);
  if (cats.length === 0) {
    return 0;
  }

  const [row] = await db
    .select({
      total: sql<number>`coalesce(sum(${expense.amountPaise}), 0)::int`,
    })
    .from(expense)
    .where(
      and(
        eq(expense.userId, userId),
        gte(expense.occurredAt, monthStart),
        lte(expense.occurredAt, monthEnd),
        inArray(expense.category, cats)
      )
    );

  return row?.total ?? 0;
}

function categoryTotalsFromRows(
  rows: { category: string; amountPaise: number }[]
): { category: string; amountPaise: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.category, (map.get(row.category) ?? 0) + row.amountPaise);
  }
  return [...map.entries()]
    .map(([category, amountPaise]) => ({ category, amountPaise }))
    .sort((a, b) => b.amountPaise - a.amountPaise);
}

export async function getDashboardSnapshot(
  userId: string,
  now = new Date()
): Promise<DashboardSnapshot> {
  const currentStart = startOfMonth(now);
  const currentEnd = endOfMonth(now);
  const prevStart = startOfMonth(subMonths(now, 1));
  const prevEnd = endOfMonth(subMonths(now, 1));

  const [
    totalSpendingPaiseCurrentMonth,
    previousMonthSpendingPaise,
    allocatedPaise,
    monthExpenseRows,
  ] = await Promise.all([
    sumExpensesInRange(userId, currentStart, currentEnd),
    sumExpensesInRange(userId, prevStart, prevEnd),
    sumBudgetAllocatedForMonth(userId, currentStart),
    db
      .select({
        category: expense.category,
        amountPaise: expense.amountPaise,
      })
      .from(expense)
      .where(
        and(
          eq(expense.userId, userId),
          gte(expense.occurredAt, currentStart),
          lte(expense.occurredAt, currentEnd)
        )
      ),
  ]);

  const remainingBudgetPaise = Math.max(
    0,
    allocatedPaise - totalSpendingPaiseCurrentMonth
  );
  const budgetProgressPercent =
    allocatedPaise > 0
      ? Math.min(
          100,
          Math.round((totalSpendingPaiseCurrentMonth / allocatedPaise) * 100)
        )
      : 0;

  const byCategory = categoryTotalsFromRows(monthExpenseRows);
  const top = byCategory[0];
  let topCategory: DashboardSnapshot["topCategory"] = null;
  if (top && totalSpendingPaiseCurrentMonth > 0) {
    topCategory = {
      name: top.category,
      sharePercent: Math.round(
        (top.amountPaise / totalSpendingPaiseCurrentMonth) * 100
      ),
    };
  }

  const breakdownColors: CategoryBreakdownItem[] = byCategory
    .slice(0, 3)
    .map((c, i) => ({
      label: c.category,
      amountPaise: c.amountPaise,
      colorClassName: TONE_CLASSES[i % TONE_CLASSES.length] ?? "bg-primary",
    }));

  const monthlyTrend: TrendPoint[] = [];
  for (let i = 3; i >= 0; i--) {
    const m = subMonths(startOfMonth(now), i);
    const ms = startOfMonth(m);
    const me = endOfMonth(m);
    const total = await sumExpensesInRange(userId, ms, me);
    monthlyTrend.push({
      label: MONTH_LABELS[ms.getMonth()] ?? format(ms, "MMM"),
      spendingPaise: total,
    });
  }

  const weeklyTrend: TrendPoint[] = [];
  const weekEnd = now;
  const weekStart = subDays(weekEnd, 6);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  for (const day of days) {
    const d0 = new Date(day);
    d0.setHours(0, 0, 0, 0);
    const d1 = new Date(day);
    d1.setHours(23, 59, 59, 999);
    const total = await sumExpensesInRange(userId, d0, d1);
    weeklyTrend.push({
      label: format(day, "EEE"),
      spendingPaise: total,
    });
  }

  const recentRows = await db
    .select()
    .from(expense)
    .where(eq(expense.userId, userId))
    .orderBy(desc(expense.occurredAt))
    .limit(20);

  return {
    totalSpendingPaiseCurrentMonth,
    previousMonthSpendingPaise,
    remainingBudgetPaise,
    budgetProgressPercent,
    topCategory,
    categoryBreakdown: breakdownColors,
    monthlyTrend,
    weeklyTrend,
    recentTransactions: toTransactionRowDTO(recentRows),
  };
}

export async function getBudgetPageData(
  userId: string,
  referenceMonth = new Date()
): Promise<BudgetPageData> {
  const monthStart = startOfMonth(referenceMonth);
  const monthEnd = endOfMonth(referenceMonth);
  const monthStr = firstDayOfMonthString(monthStart);

  const rows = await db
    .select()
    .from(budgetCategory)
    .where(
      and(eq(budgetCategory.userId, userId), eq(budgetCategory.month, monthStr))
    );

  const categories: BudgetCategoryRowDTO[] = [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const spentPaise = await sumSpentForBudgetLabel(
      userId,
      monthStart,
      monthEnd,
      r.label
    );
    categories.push({
      id: r.id,
      label: r.label,
      allocatedPaise: r.allocatedPaise,
      spentPaise,
      toneClassName: TONE_CLASSES[i % TONE_CLASSES.length] ?? "bg-primary",
    });
  }

  const totalAllocatedPaise = categories.reduce(
    (s, c) => s + c.allocatedPaise,
    0
  );
  const totalSpentPaise = categories.reduce((s, c) => s + c.spentPaise, 0);

  const monthlyPulse: { month: string; utilization: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const m = subMonths(startOfMonth(referenceMonth), i);
    const ms = startOfMonth(m);
    const spent = await sumExpensesInRange(userId, ms, endOfMonth(ms));
    const allocated = await sumBudgetAllocatedForMonth(userId, ms);
    const utilization =
      allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100)) : 0;
    monthlyPulse.push({
      month: MONTH_LABELS[ms.getMonth()] ?? format(ms, "MMM"),
      utilization,
    });
  }

  return {
    categories,
    monthlyPulse,
    totalAllocatedPaise,
    totalSpentPaise,
  };
}

export async function getReportsPageData(
  userId: string,
  now = new Date()
): Promise<ReportsPageData> {
  const currentStart = startOfMonth(now);
  const currentEnd = endOfMonth(now);
  const prevStart = startOfMonth(subMonths(now, 1));
  const prevEnd = endOfMonth(subMonths(now, 1));

  const [totalExpensesPaise, prevExpensesPaise, allocatedPaise, monthRows] =
    await Promise.all([
      sumExpensesInRange(userId, currentStart, currentEnd),
      sumExpensesInRange(userId, prevStart, prevEnd),
      sumBudgetAllocatedForMonth(userId, currentStart),
      db
        .select()
        .from(expense)
        .where(
          and(
            eq(expense.userId, userId),
            gte(expense.occurredAt, currentStart),
            lte(expense.occurredAt, currentEnd)
          )
        ),
    ]);

  const netSavingsPaise = allocatedPaise - totalExpensesPaise;
  let netSavingsDeltaPercent: number | null = null;
  const prevNet =
    (await sumBudgetAllocatedForMonth(userId, prevStart)) - prevExpensesPaise;
  if (prevNet !== 0) {
    netSavingsDeltaPercent = Math.round(
      ((netSavingsPaise - prevNet) / Math.abs(prevNet)) * 100
    );
  }

  const spendingVsBudget: ReportsPageData["spendingVsBudget"] = [];
  for (let i = 3; i >= 0; i--) {
    const m = subMonths(startOfMonth(now), i);
    const ms = startOfMonth(m);
    const me = endOfMonth(m);
    const spent = await sumExpensesInRange(userId, ms, me);
    const budget = await sumBudgetAllocatedForMonth(userId, ms);
    const cap = Math.max(spent, budget, 1);
    spendingVsBudget.push({
      month: MONTH_LABELS[ms.getMonth()] ?? format(ms, "MMM"),
      spending: Math.round((spent / cap) * 100),
      budget: Math.round((budget / cap) * 100),
    });
  }

  const totals = categoryTotalsFromRows(
    monthRows.map((r) => ({ category: r.category, amountPaise: r.amountPaise }))
  );
  const total = totalExpensesPaise || 1;
  const categoryShare = totals.slice(0, 4).map((c) => ({
    label: c.category,
    percent: Math.round((c.amountPaise / total) * 100),
    amountPaise: c.amountPaise,
  }));

  const othersPaise = totals.slice(4).reduce((s, x) => s + x.amountPaise, 0);
  if (othersPaise > 0) {
    categoryShare.push({
      label: "Others",
      percent: Math.round((othersPaise / total) * 100),
      amountPaise: othersPaise,
    });
  }

  const iconHints = [
    "Largest category this period.",
    "Second by spend.",
    "Third by spend.",
    "Other spending.",
  ];
  const topSpendingCategories: ReportsPageData["topSpendingCategories"] = totals
    .slice(0, 4)
    .map((c, i) => {
      const budgetRow =
        allocatedPaise > 0
          ? Math.round((c.amountPaise / allocatedPaise) * 100)
          : 0;
      let delta: string;
      let deltaVariant: ReportsPageData["topSpendingCategories"][number]["deltaVariant"];
      if (budgetRow > 50) {
        delta = `~${budgetRow}% of monthly budget`;
        deltaVariant = "warning-light";
      } else if (budgetRow < 25) {
        delta = "Below typical budget share";
        deltaVariant = "success-light";
      } else {
        delta = "Relative to budget";
        deltaVariant = "primary-light";
      }
      return {
        title: c.category,
        subtitle: iconHints[i] ?? "Spending group",
        amountPaise: c.amountPaise,
        delta,
        deltaVariant,
      };
    });

  const rangeLabel = `${format(currentStart, "MMM d, yyyy")} - ${format(now, "MMM d, yyyy")}`;

  return {
    netSavingsPaise,
    netSavingsDeltaPercent,
    totalIncomeDisplay: "not_tracked",
    totalExpensesPaise,
    spendingVsBudget,
    categoryShare,
    topSpendingCategories,
    rangeLabel,
  };
}

export async function getExpensesPageData(
  userId: string,
  now = new Date()
): Promise<ExpensesPageData> {
  const expenses = await listExpensesForUser(userId, 2000);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const allocatedPaise = await sumBudgetAllocatedForMonth(userId, monthStart);

  let totalSpentMonthPaise = 0;
  let pendingCount = 0;
  for (const e of expenses) {
    const t = new Date(e.occurredAtIso);
    if (t >= monthStart && t <= monthEnd) {
      totalSpentMonthPaise += e.amountPaise;
      if (e.status === "pending") {
        pendingCount += 1;
      }
    }
  }

  const monthlySavingsPaise = Math.max(
    0,
    allocatedPaise - totalSpentMonthPaise
  );

  const monthTotals = categoryTotalsFromRows(
    expenses
      .filter((e) => {
        const t = new Date(e.occurredAtIso);
        return t >= monthStart && t <= monthEnd;
      })
      .map((e) => ({ category: e.category, amountPaise: e.amountPaise }))
  );
  const insightTopCategory = monthTotals[0]?.category ?? null;

  const scheduled = expenses
    .filter((e) => e.status === "scheduled")
    .map((e) => ({ ...e, at: new Date(e.occurredAtIso) }))
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  let upcomingBill: ExpensesPageData["upcomingBill"] = null;
  const nextFuture = scheduled.find((e) => isAfter(e.at, now));
  const candidate = nextFuture ?? scheduled[0];
  if (candidate) {
    const days = isAfter(candidate.at, now)
      ? differenceInCalendarDays(candidate.at, now)
      : 0;
    upcomingBill = {
      merchant: candidate.merchant,
      amountPaise: candidate.amountPaise,
      dueLabel:
        days > 0 ? `Due in ${days} day${days === 1 ? "" : "s"}` : "Due soon",
    };
  }

  return {
    expenses,
    totalSpentMonthPaise,
    pendingCount,
    monthlySavingsPaise,
    upcomingBill,
    insightTopCategory,
  };
}

export async function getSettingsExportRows(
  userId: string,
  limit = 50
): Promise<SettingsExportRow[]> {
  const rows = await db
    .select()
    .from(expense)
    .where(eq(expense.userId, userId))
    .orderBy(desc(expense.occurredAt))
    .limit(limit);

  return rows.map((r) => ({
    date: format(r.occurredAt, "yyyy-MM-dd"),
    merchant: r.merchant,
    category: r.category,
    amountRupees: r.amountPaise / 100,
    status: expenseStatusLabel(r.status as DbExpenseStatus),
  }));
}
