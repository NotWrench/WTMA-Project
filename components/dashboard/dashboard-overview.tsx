import { Landmark, PiggyBank, ShoppingBag } from "lucide-react";
import { AddExpenseDialog } from "@/components/dashboard/add-expense-dialog";
import { CategoryBreakdownRadialChart } from "@/components/dashboard/category-breakdown-radial-chart";
import { SpendingTrendPanel } from "@/components/dashboard/spending-trend-panel";
import { DashboardTransactionsTable } from "@/components/dashboard/transactions-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardSnapshot } from "@/lib/data/finance-types";
import { formatInrPaise } from "@/lib/format-inr";

interface DashboardOverviewProps {
  snapshot: DashboardSnapshot;
}

export function DashboardOverview({ snapshot }: DashboardOverviewProps) {
  const {
    totalSpendingPaiseCurrentMonth,
    previousMonthSpendingPaise,
    remainingBudgetPaise,
    budgetProgressPercent,
    topCategory,
    categoryBreakdown,
    monthlyTrend,
    weeklyTrend,
    recentTransactions,
  } = snapshot;

  const spendingChangePercent =
    previousMonthSpendingPaise > 0
      ? Math.round(
          ((totalSpendingPaiseCurrentMonth - previousMonthSpendingPaise) /
            previousMonthSpendingPaise) *
            100
        )
      : null;

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-extrabold font-heading text-3xl text-primary tracking-tight sm:text-4xl">
            Trackami Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Your at-a-glance view of spending, budgets, and money habits.
          </p>
        </div>

        <AddExpenseDialog />
      </header>

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border border-primary/10 bg-primary-container/80 shadow-none">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex size-10 items-center justify-center rounded-lg bg-on-primary-container/10 text-on-primary-container">
                <Landmark className="size-5" />
              </div>
              {spendingChangePercent === null ? (
                <Badge className="font-semibold" variant="primary-light">
                  This month
                </Badge>
              ) : (
                <Badge className="font-semibold" variant="primary-light">
                  {spendingChangePercent >= 0 ? "+" : ""}
                  {spendingChangePercent}% vs last month
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1 font-semibold text-[0.7rem] text-on-primary-container/70 uppercase tracking-widest">
              Total Spending
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-4xl text-on-primary-container">
              <span data-sensitive-balance="true">
                {formatInrPaise(totalSpendingPaiseCurrentMonth)}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-border/40 bg-surface-container-high/70 shadow-none">
          <CardHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-lg bg-secondary-container/70 text-secondary">
              <PiggyBank className="size-5" />
            </div>
            <CardDescription className="mt-1 font-semibold text-[0.7rem] uppercase tracking-widest">
              Remaining Budget
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-4xl text-secondary">
              <span data-sensitive-balance="true">
                {formatInrPaise(remainingBudgetPaise)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress className="gap-0" value={budgetProgressPercent} />
          </CardContent>
        </Card>

        <Card className="border border-tertiary/15 bg-tertiary-container/35 shadow-none">
          <CardHeader>
            <div className="inline-flex size-10 items-center justify-center rounded-lg bg-tertiary-container/80 text-tertiary">
              <ShoppingBag className="size-5" />
            </div>
            <CardDescription className="mt-1 font-semibold text-[0.7rem] text-on-tertiary-container uppercase tracking-widest">
              Top Category
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-4xl text-on-tertiary-container">
              {topCategory?.name ?? "—"}
            </CardTitle>
            <p className="text-on-tertiary-container/70 text-xs">
              {topCategory
                ? `${topCategory.sharePercent}% of total expenditures`
                : "No spending this month yet"}
            </p>
          </CardHeader>
        </Card>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <SpendingTrendPanel
          monthlyTrend={monthlyTrend}
          weeklyTrend={weeklyTrend}
        />

        <Card className="border border-border/40 bg-surface shadow-none lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownRadialChart
              sharePercent={topCategory?.sharePercent ?? 0}
              topLabel={topCategory?.name ?? "—"}
            />

            <div className="space-y-3">
              {categoryBreakdown.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No category data for this month yet.
                </p>
              ) : (
                categoryBreakdown.map((item) => (
                  <div
                    className="flex items-center justify-between gap-3"
                    key={item.label}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2.5 rounded-full ${item.colorClassName}`}
                      />
                      <span className="font-medium text-foreground text-sm">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className="font-semibold text-foreground text-sm"
                      data-sensitive-balance="true"
                    >
                      {formatInrPaise(item.amountPaise)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border border-border/40 bg-surface shadow-none">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardTransactionsTable rows={recentTransactions} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
