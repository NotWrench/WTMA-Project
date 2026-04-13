"use client";

import { AlertTriangle, PiggyBank, Sparkles, Target } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { BentoGrid } from "@/components/ui/bento-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CategoryBudget {
  allocated: number;
  label: string;
  spent: number;
  toneClassName: string;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const budgetCategories: CategoryBudget[] = [
  {
    label: "Housing",
    allocated: 42_000,
    spent: 38_500,
    toneClassName: "bg-primary",
  },
  {
    label: "Food & Dining",
    allocated: 18_000,
    spent: 14_200,
    toneClassName: "bg-secondary",
  },
  {
    label: "Mobility",
    allocated: 11_000,
    spent: 9450,
    toneClassName: "bg-tertiary",
  },
  {
    label: "Subscriptions",
    allocated: 4500,
    spent: 4850,
    toneClassName: "bg-destructive",
  },
];

const monthlyPulse = [
  { month: "Jul", utilization: 72 },
  { month: "Aug", utilization: 78 },
  { month: "Sep", utilization: 81 },
  { month: "Oct", utilization: 74 },
  { month: "Nov", utilization: 69 },
  { month: "Dec", utilization: 77 },
] as const;

const totalAllocated = budgetCategories.reduce(
  (sum, category) => sum + category.allocated,
  0
);
const totalSpent = budgetCategories.reduce(
  (sum, category) => sum + category.spent,
  0
);
const totalRemaining = totalAllocated - totalSpent;
const utilizationPercentage = Math.min(
  100,
  Math.round((totalSpent / totalAllocated) * 100)
);
const atRiskBudgets = budgetCategories.filter(
  (category) => category.spent > category.allocated
);

export function BudgetBentoView() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <Badge
          className="font-semibold uppercase tracking-widest"
          variant="primary-light"
        >
          Serene Ledger Budgeting
        </Badge>
        <h1 className="font-extrabold font-heading text-3xl text-foreground tracking-tight sm:text-4xl">
          Budget Planner
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Keep each category intentional with soft, focused guardrails.
          Top-right quick icons are intentionally omitted as requested.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="border border-primary/20 bg-primary/6 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Target className="size-5" />
              </div>
              <Badge variant="primary-light">Monthly Cap</Badge>
            </div>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Planned Budget
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-3xl text-primary">
              {currencyFormatter.format(totalAllocated)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-border/30 bg-surface-container-lowest shadow-none">
          <CardHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-secondary-container/70 text-secondary">
              <PiggyBank className="size-5" />
            </div>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Actual Spend
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-3xl text-foreground">
              {currencyFormatter.format(totalSpent)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={utilizationPercentage} />
          </CardContent>
        </Card>

        <Card className="border border-tertiary/25 bg-tertiary-container/35 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex size-10 items-center justify-center rounded-xl bg-tertiary/15 text-tertiary">
                <Sparkles className="size-5" />
              </div>
              <Badge
                variant={
                  totalRemaining >= 0 ? "success-light" : "destructive-light"
                }
              >
                {totalRemaining >= 0 ? "On Track" : "Overshoot"}
              </Badge>
            </div>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Remaining Envelope
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-3xl text-foreground">
              {currencyFormatter.format(totalRemaining)}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <BentoGrid className="max-w-none gap-5 md:auto-rows-[minmax(16rem,auto)] md:grid-cols-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/30 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(79,100,91,0.06)] md:col-span-7"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold font-heading text-foreground text-xl">
                Category Allocation
              </h2>
              <p className="text-muted-foreground text-sm">
                Real-time checks against your planned envelopes.
              </p>
            </div>
            <Badge variant="outline">{utilizationPercentage}% utilized</Badge>
          </div>

          <div className="space-y-4">
            {budgetCategories.map((category) => {
              const percentage = Math.min(
                100,
                Math.round((category.spent / category.allocated) * 100)
              );
              const remaining = category.allocated - category.spent;
              const isOverLimit = remaining < 0;

              return (
                <div
                  className="rounded-2xl bg-surface-container-low p-3"
                  key={category.label}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-foreground text-sm">
                      {category.label}
                    </p>
                    <Badge
                      variant={
                        remaining >= 0 ? "primary-light" : "destructive-light"
                      }
                    >
                      {remaining >= 0 ? "Healthy" : "Over limit"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-muted-foreground text-xs">
                      {currencyFormatter.format(category.spent)} spent
                    </span>
                    <span className="font-semibold text-foreground text-xs">
                      {currencyFormatter.format(category.allocated)} budget
                    </span>
                  </div>

                  {isOverLimit ? null : (
                    <Progress className="mt-2" value={percentage} />
                  )}

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      {isOverLimit ? "Over by" : "Remaining"}
                    </span>
                    <span className="font-semibold text-foreground text-xs">
                      {currencyFormatter.format(Math.abs(remaining))}
                    </span>
                  </div>

                  <div
                    className={`mt-2 h-1.5 w-16 rounded-full ${category.toneClassName}`}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/30 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(79,100,91,0.06)] md:col-span-5"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.04, duration: 0.25, ease: "easeOut" }}
        >
          <h2 className="font-bold font-heading text-foreground text-xl">
            Utilization Pulse
          </h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Last 6 months budget usage against your plan.
          </p>

          <div className="space-y-3">
            {monthlyPulse.map((point) => (
              <div className="space-y-1.5" key={point.month}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm">
                    {point.month}
                  </span>
                  <span className="font-semibold text-muted-foreground text-xs">
                    {point.utilization}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-tertiary transition-all duration-500"
                    style={{ width: `${point.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/30 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(79,100,91,0.06)] md:col-span-12"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.08, duration: 0.25, ease: "easeOut" }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold font-heading text-foreground text-xl">
                Budget Watchlist
              </h2>
              <p className="text-muted-foreground text-sm">
                Categories requiring intervention this cycle.
              </p>
            </div>
            <Badge
              variant={
                atRiskBudgets.length > 0 ? "destructive-light" : "success-light"
              }
            >
              {atRiskBudgets.length > 0
                ? `${atRiskBudgets.length} at risk`
                : "All categories healthy"}
            </Badge>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/20">
            <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] bg-surface-container-low px-4 py-2 font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-widest">
              <span>Category</span>
              <span>Budget</span>
              <span>Spent</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-border/20">
              {budgetCategories.map((category) => {
                const delta = category.allocated - category.spent;
                const statusLabel = delta >= 0 ? "In range" : "Over budget";

                return (
                  <div
                    className="grid grid-cols-[1.3fr_1fr_1fr_1fr] items-center px-4 py-3 text-sm"
                    key={category.label}
                  >
                    <span className="font-semibold text-foreground">
                      {category.label}
                    </span>
                    <span className="text-muted-foreground">
                      {currencyFormatter.format(category.allocated)}
                    </span>
                    <span className="text-muted-foreground">
                      {currencyFormatter.format(category.spent)}
                    </span>
                    <Badge
                      className="justify-self-start"
                      variant={
                        delta >= 0 ? "primary-light" : "destructive-light"
                      }
                    >
                      {statusLabel}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {atRiskBudgets.length > 0 ? (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-destructive/25 bg-destructive/7 px-3 py-2 text-destructive-foreground text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p>
                {atRiskBudgets.map((budget) => budget.label).join(", ")} crossed
                the planned limit. Consider rebalancing next cycle.
              </p>
            </div>
          ) : null}
        </motion.div>
      </BentoGrid>
    </section>
  );
}
