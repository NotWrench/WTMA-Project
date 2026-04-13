"use client";

import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUp,
  CalendarDays,
  Car,
  FileText,
  Filter,
  Home,
  Landmark,
  Pizza,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const spendingData = [
  { month: "Jan", spending: 69, budget: 70 },
  { month: "Feb", spending: 73, budget: 74 },
  { month: "Mar", spending: 78, budget: 76 },
  { month: "Apr", spending: 82, budget: 79 },
] as const;

const chartConfig = {
  spending: {
    label: "Spending",
    color: "var(--color-primary)",
  },
  budget: {
    label: "Budget",
    color: "var(--color-secondary)",
  },
} satisfies ChartConfig;

const categoryShare = [
  { label: "Housing & Rent", percent: 45, amount: "₹32,000" },
  { label: "Food & Dining", percent: 25, amount: "₹18,450" },
  { label: "Transport", percent: 15, amount: "₹12,200" },
  { label: "Others", percent: 15, amount: "₹19,500" },
] as const;

const topSpendingCategories = [
  {
    title: "Housing & Utilities",
    subtitle: "Rent, electricity, water & maintenance",
    amount: "₹32,000",
    delta: "+2% vs budget",
    deltaVariant: "warning-light" as const,
    icon: Home,
  },
  {
    title: "Groceries & Dining",
    subtitle: "Swiggy, grocery runs, restaurants",
    amount: "₹18,450",
    delta: "-5% vs budget",
    deltaVariant: "success-light" as const,
    icon: Pizza,
  },
  {
    title: "Travel & Transport",
    subtitle: "Uber, fuel, car EMI",
    amount: "₹12,200",
    delta: "On budget",
    deltaVariant: "primary-light" as const,
    icon: Car,
  },
  {
    title: "Lifestyle & Health",
    subtitle: "Gym, clothing, subscriptions",
    amount: "₹9,500",
    delta: "+15% vs budget",
    deltaVariant: "destructive-light" as const,
    icon: ShoppingBag,
  },
] as const;

export function ReportsBentoView() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-extrabold font-heading text-3xl text-foreground tracking-tight sm:text-4xl">
          Reports Overview
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Analyze performance against budget, discover outflow patterns, and
          export decision-ready summaries.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          className="justify-start"
          size="sm"
          type="button"
          variant="outline"
        >
          <CalendarDays className="size-4" />
          Apr 1, 2026 - Apr 13, 2026
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" type="button" variant="outline">
            <FileText className="size-4" />
            PDF
          </Button>
          <Button size="sm" type="button" variant="outline">
            <ArrowDownToLine className="size-4" />
            CSV
          </Button>
          <Button size="sm" type="button" variant="outline">
            <Filter className="size-4" />
            Download
          </Button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="border border-primary/20 bg-primary/6 shadow-none">
          <CardHeader>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Net Savings
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-4xl text-primary">
              ₹42,850
            </CardTitle>
            <Badge className="justify-start" variant="primary-light">
              <ArrowUp className="size-3.5" />
              +12.5% from last month
            </Badge>
          </CardHeader>
        </Card>

        <Card className="border border-border/30 bg-surface-container-lowest shadow-none">
          <CardHeader>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Total Income
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-4xl text-foreground">
              ₹1,25,000
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-border/30 bg-surface-container-lowest shadow-none">
          <CardHeader>
            <CardDescription className="font-semibold text-[0.7rem] uppercase tracking-widest">
              Total Expenses
            </CardDescription>
            <CardTitle className="font-extrabold font-heading text-4xl text-foreground">
              ₹82,150
            </CardTitle>
            <Badge className="justify-start" variant="warning-light">
              <ArrowDown className="size-3.5" />
              Performance against budget
            </Badge>
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
          <h2 className="font-bold font-heading text-foreground text-xl">
            Monthly Spending Analysis
          </h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Spending vs budget trajectory from Jan to Apr.
          </p>

          <ChartContainer className="h-[280px] w-full" config={chartConfig}>
            <BarChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis axisLine={false} dataKey="month" tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="spending" fill="var(--color-spending)" radius={8} />
              <Bar dataKey="budget" fill="var(--color-budget)" radius={8} />
            </BarChart>
          </ChartContainer>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/30 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(79,100,91,0.06)] md:col-span-4"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.04, duration: 0.24, ease: "easeOut" }}
        >
          <h2 className="font-bold font-heading text-foreground text-xl">
            Expense Categories
          </h2>
          <p className="mb-4 text-muted-foreground text-sm">
            ₹82k total tracked
          </p>

          <div className="space-y-3">
            {categoryShare.map((category) => (
              <div className="space-y-1.5" key={category.label}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm">
                    {category.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {category.percent}% • {category.amount}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${category.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/30 bg-surface-container-lowest p-6 shadow-[0_10px_30px_rgba(79,100,91,0.06)] md:col-span-8"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.08, duration: 0.24, ease: "easeOut" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold font-heading text-foreground text-xl">
                Top Spending Categories
              </h2>
              <p className="text-muted-foreground text-sm">
                Deep dive into your major outflow channels.
              </p>
            </div>
            <Button size="sm" type="button" variant="outline">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {topSpendingCategories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  className="rounded-2xl bg-surface-container-low p-4"
                  key={category.title}
                >
                  <div className="mb-2 inline-flex size-9 items-center justify-center rounded-xl bg-surface-container-high text-foreground">
                    <Icon className="size-4" />
                  </div>
                  <p className="font-semibold text-foreground text-sm">
                    {category.title}
                  </p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    {category.subtitle}
                  </p>
                  <p className="mt-3 font-bold font-heading text-foreground text-xl">
                    {category.amount}
                  </p>
                  <Badge className="mt-2" variant={category.deltaVariant}>
                    {category.delta}
                  </Badge>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-tertiary/30 bg-tertiary-container/30 p-6 shadow-[0_10px_30px_rgba(79,100,91,0.06)] md:col-span-4"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.12, duration: 0.24, ease: "easeOut" }}
        >
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-tertiary/15 text-tertiary">
            <Sparkles className="size-5" />
          </div>
          <h3 className="mt-3 font-bold font-heading text-foreground text-xl">
            Automate Your Tax Filings
          </h3>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
            AI now categorizes your business expenses automatically for the next
            fiscal year so your reporting stays audit-ready.
          </p>
          <Button className="mt-4 w-full" type="button">
            <Landmark className="size-4" />
            Learn More
          </Button>
        </motion.div>
      </BentoGrid>
    </section>
  );
}
