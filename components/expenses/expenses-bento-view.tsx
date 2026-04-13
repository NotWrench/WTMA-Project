"use client";

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

interface ExpenseRow {
  amount: number;
  category: "Dining" | "Health" | "Transport" | "Utilities" | "Work";
  date: string;
  merchant: string;
  note: string;
  status: "Completed" | "Pending";
}

const expenses: ExpenseRow[] = [
  {
    date: "Sep 24, 2023 • 10:42 AM",
    merchant: "Starbucks",
    note: "Morning brew - Indiranagar",
    category: "Dining",
    amount: 450,
    status: "Completed",
  },
  {
    date: "Sep 23, 2023 • 02:15 PM",
    merchant: "Amazon India",
    note: "Office stationery & supplies",
    category: "Work",
    amount: 2840,
    status: "Pending",
  },
  {
    date: "Sep 22, 2023 • 08:00 PM",
    merchant: "Shell",
    note: "Sedan refuel",
    category: "Transport",
    amount: 4200,
    status: "Completed",
  },
  {
    date: "Sep 21, 2023 • 11:30 AM",
    merchant: "Airtel Broadband",
    note: "Monthly internet subscription",
    category: "Utilities",
    amount: 1179,
    status: "Completed",
  },
  {
    date: "Sep 20, 2023 • 06:45 PM",
    merchant: "Apollo Pharmacy",
    note: "Prescription medicines",
    category: "Health",
    amount: 850,
    status: "Completed",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

export function ExpensesBentoView() {
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
              ₹42,850.00
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
              14
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
              ₹12,400
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
              ₹18,500
            </CardTitle>
            <p className="text-muted-foreground text-xs">Due in 4 days</p>
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
            <Button
              className="justify-start"
              size="sm"
              type="button"
              variant="outline"
            >
              <CalendarDays className="size-4" />
              Sept 2023
            </Button>
            <Select defaultValue="all-categories">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="work">Work</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-methods">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-methods">Payment Method</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="mb-3 text-muted-foreground text-sm">
            Showing 42 transactions
          </p>

          <div className="overflow-hidden rounded-2xl border border-border/25">
            <div className="grid grid-cols-[1.4fr_0.9fr_0.7fr_0.7fr] bg-surface-container-low px-4 py-2 font-semibold text-[0.68rem] text-muted-foreground uppercase tracking-widest">
              <span>Transaction</span>
              <span>Category</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-border/20">
              {expenses.map((expense) => (
                <div
                  className="grid grid-cols-[1.4fr_0.9fr_0.7fr_0.7fr] items-center gap-2 px-4 py-3"
                  key={`${expense.date}-${expense.merchant}`}
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
                  <span className="font-semibold text-foreground text-sm">
                    {currencyFormatter.format(expense.amount)}
                  </span>
                  <Badge
                    className="justify-self-start"
                    variant={
                      expense.status === "Completed"
                        ? "success-light"
                        : "warning-light"
                    }
                  >
                    {expense.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-muted-foreground text-xs">Page 1 of 5</p>
            <div className="flex gap-2">
              <Button size="sm" type="button" variant="outline">
                Previous
              </Button>
              <Button size="sm" type="button" variant="outline">
                Next
              </Button>
            </div>
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
                Your spending in Dining has decreased by 15% this week. Keep
                maintaining this trend to hit your savings goal of ₹15,000.
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
              <div className="flex items-start gap-2 rounded-xl bg-surface-container-low p-3">
                <CircleAlert className="mt-0.5 size-4 text-destructive" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Workspace Rent
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Due in 4 days • ₹18,500
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-surface-container-low p-3">
                <CircleCheck className="mt-0.5 size-4 text-primary" />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Savings Goal
                  </p>
                  <p className="text-muted-foreground text-xs">
                    ₹12,400 saved this month. Keep this trajectory.
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
