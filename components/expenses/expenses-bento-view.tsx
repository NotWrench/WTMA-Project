"use client";

import { format, isSameMonth, parseISO } from "date-fns";
import {
  CalendarDays,
  CircleAlert,
  CircleCheck,
  FileUp,
  Landmark,
  PiggyBank,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { ExpenseMonthPicker } from "@/components/expenses/expense-month-picker";
import { Badge } from "@/components/ui/badge";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExpenseRowDTO, ExpensesPageData } from "@/lib/data/finance-types";
import { expenseStatusLabel } from "@/lib/expense-display";
import { formatInrPaise, formatInrPaiseWhole } from "@/lib/format-inr";

interface ExpenseRow {
  amount: number;
  category: string;
  date: string;
  id: string;
  merchant: string;
  note: string;
  occurredAt: Date;
  paymentMethod: string | null;
  status: "Completed" | "Pending" | "Scheduled";
}

function mapExpense(e: ExpenseRowDTO): ExpenseRow {
  const d = parseISO(e.occurredAtIso);
  return {
    id: e.id,
    amount: e.amountPaise / 100,
    category: e.category,
    occurredAt: d,
    date: format(d, "MMM dd, yyyy • hh:mm a"),
    merchant: e.merchant,
    note: e.notes,
    paymentMethod: e.paymentMethod,
    status: expenseStatusLabel(e.status),
  };
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

function expenseStatusBadgeVariant(
  status: ExpenseRow["status"]
): "success-light" | "warning-light" | "outline" {
  if (status === "Completed") {
    return "success-light";
  }
  if (status === "Pending") {
    return "warning-light";
  }
  return "outline";
}

interface ExpensesBentoViewProps {
  data: ExpensesPageData;
}

export function ExpensesBentoView({ data }: ExpensesBentoViewProps) {
  const rows = useMemo(() => data.expenses.map(mapExpense), [data.expenses]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => new Date());
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("Payment Method");

  const monthFilteredExpenses = useMemo(() => {
    return rows.filter((expense) => {
      if (!isSameMonth(expense.occurredAt, selectedMonth)) {
        return false;
      }
      if (
        selectedCategory !== "All Categories" &&
        expense.category !== selectedCategory
      ) {
        return false;
      }
      if (
        selectedPaymentMethod !== "Payment Method" &&
        expense.paymentMethod !== selectedPaymentMethod
      ) {
        return false;
      }
      return true;
    });
  }, [rows, selectedCategory, selectedMonth, selectedPaymentMethod]);

  let insightText =
    "Add expenses to unlock personalized insights for this month.";
  if (data.insightTopCategory && data.monthlySavingsPaise > 0) {
    insightText = `Your top spend category is ${data.insightTopCategory}. You have ${formatInrPaiseWhole(data.monthlySavingsPaise)} in planned savings headroom this month.`;
  } else if (data.insightTopCategory) {
    insightText = `Your top spend category is ${data.insightTopCategory}. Review envelopes to stay on track.`;
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-extrabold font-heading text-3xl text-foreground tracking-tight sm:text-4xl">
          Expenses
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Track every transaction with soft precision and keep monthly flows
          aligned with your financial goals.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <Card className="border border-primary/15 bg-primary/6 shadow-none">
          <CardHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Wallet className="size-5" />
            </div>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Total Spent This Month
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-3xl text-primary">
              <span data-sensitive-balance="true">
                {formatInrPaise(data.totalSpentMonthPaise)}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-border/30 bg-surface-container-lowest shadow-none">
          <CardHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-secondary-container/60 text-secondary">
              <Landmark className="size-5" />
            </div>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Pending Approvals
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-3xl text-foreground">
              {data.pendingCount}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-border/30 bg-surface-container-lowest shadow-none">
          <CardHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-tertiary-container/60 text-tertiary">
              <PiggyBank className="size-5" />
            </div>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Monthly Savings
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-3xl text-foreground">
              <span data-sensitive-balance="true">
                {formatInrPaiseWhole(data.monthlySavingsPaise)}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-border/30 bg-surface-container-lowest shadow-none">
          <CardHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <CalendarDays className="size-5" />
            </div>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Upcoming Bill
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-3xl text-foreground">
              {data.upcomingBill ? (
                <span data-sensitive-balance="true">
                  {formatInrPaise(data.upcomingBill.amountPaise)}
                </span>
              ) : (
                <span className="text-lg text-muted-foreground">—</span>
              )}
            </CardTitle>
            <p className="text-muted-foreground text-xs">
              {data.upcomingBill?.dueLabel ?? "No scheduled bills"}
            </p>
          </CardHeader>
        </Card>
      </section>

      <BentoGrid className="max-w-none gap-5 md:auto-rows-[minmax(16rem,auto)] md:grid-cols-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/30 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(79,100,91,0.06)] md:col-span-8"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-full bg-surface-container p-1">
              {["Transactions", "Categories", "Recurring"].map((tab) => (
                <button
                  className="rounded-full px-3 py-1.5 font-semibold text-muted-foreground text-xs transition-colors hover:text-foreground"
                  key={tab}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <Button size="sm" type="button" variant="outline">
              <FileUp className="size-4" />
              Import CSV
            </Button>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ExpenseMonthPicker
              onChange={setSelectedMonth}
              value={selectedMonth}
            />
            <Select
              onValueChange={(value) => {
                if (value) {
                  setSelectedCategory(value);
                }
              }}
              value={selectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Dining">Dining</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Essential">Essential</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                if (value) {
                  setSelectedPaymentMethod(value);
                }
              }}
              value={selectedPaymentMethod}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Payment Method">Payment Method</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Net Banking">Net Banking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="mb-3 text-muted-foreground text-sm">
            Showing {monthFilteredExpenses.length} transactions in{" "}
            {format(selectedMonth, "MMMM yyyy")}
          </p>

          <div className="overflow-hidden rounded-2xl border border-border/25">
            <div className="grid grid-cols-[1.4fr_0.9fr_0.7fr_0.7fr] bg-surface-container-low px-4 py-2 font-semibold text-[0.68rem] text-muted-foreground uppercase tracking-widest">
              <span>Transaction</span>
              <span>Category</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-border/20">
              {monthFilteredExpenses.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  No transactions found in {format(selectedMonth, "MMMM yyyy")}.
                </div>
              ) : (
                monthFilteredExpenses.map((expense) => (
                  <div
                    className="grid grid-cols-[1.4fr_0.9fr_0.7fr_0.7fr] items-center gap-2 px-4 py-3"
                    key={expense.id}
                  >
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {expense.merchant}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {expense.note}
                      </p>
                      <p className="mt-1 text-muted-foreground text-xs">
                        {expense.date}
                      </p>
                    </div>
                    <Badge className="justify-self-start" variant="outline">
                      {expense.category}
                    </Badge>
                    <span
                      className="font-semibold text-foreground text-sm"
                      data-sensitive-balance="true"
                    >
                      {currencyFormatter.format(expense.amount)}
                    </span>
                    <Badge
                      className="justify-self-start"
                      variant={expenseStatusBadgeVariant(expense.status)}
                    >
                      {expense.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              {monthFilteredExpenses.length} transaction
              {monthFilteredExpenses.length === 1 ? "" : "s"} shown
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 md:col-span-4"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.04, duration: 0.24, ease: "easeOut" }}
        >
          <Card className="border border-border/30 bg-surface-container-lowest shadow-none">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Financial Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {insightText}
              </p>
              <Button className="mt-4 w-full" type="button" variant="outline">
                View Detailed Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/30 bg-surface-container-lowest shadow-none">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Upcoming Bill
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.upcomingBill ? (
                <div className="flex items-start gap-2 rounded-xl bg-surface-container-low p-3">
                  <CircleAlert className="mt-0.5 size-4 text-destructive" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {data.upcomingBill.merchant}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {data.upcomingBill.dueLabel} •{" "}
                      <span data-sensitive-balance="true">
                        {formatInrPaise(data.upcomingBill.amountPaise)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No scheduled payments on file.
                </p>
              )}
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-surface-container-low p-3">
                <CircleCheck className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Savings Goal
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <span data-sensitive-balance="true">
                      {formatInrPaiseWhole(data.monthlySavingsPaise)}
                    </span>{" "}
                    headroom vs planned budget this month.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </BentoGrid>
    </section>
  );
}
