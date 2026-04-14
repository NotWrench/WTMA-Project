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

const categoryBreakdown = [
  {
    label: "Rent & Utilities",
    amount: "₹ 42,000",
    colorClassName: "bg-primary",
  },
  {
    label: "Food & Dining",
    amount: "₹ 18,500",
    colorClassName: "bg-secondary",
  },
  {
    label: "Travel",
    amount: "₹ 9,200",
    colorClassName: "bg-tertiary",
  },
] as const;

export function DashboardOverview() {
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
              <Badge className="font-semibold" variant="primary-light">
                +12% vs last month
              </Badge>
            </div>
            <CardDescription className="mt-1 font-semibold text-[0.7rem] text-on-primary-container/70 uppercase tracking-widest">
              Total Spending
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-4xl text-on-primary-container">
              ₹ 84,250
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
              ₹ 35,750
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress className="gap-0" value={70} />
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
              Essentials
            </CardTitle>
            <p className="text-on-tertiary-container/70 text-xs">
              42% of total expenditures
            </p>
          </CardHeader>
        </Card>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <SpendingTrendPanel />

        <Card className="border border-border/40 bg-surface shadow-none lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownRadialChart />

            <div className="space-y-3">
              {categoryBreakdown.map((item) => (
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
                  <span className="font-semibold text-foreground text-sm">
                    {item.amount}
                  </span>
                </div>
              ))}
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
            <DashboardTransactionsTable />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
