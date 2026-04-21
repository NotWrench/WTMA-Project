"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  DashboardSpendingTrendChart,
  type SpendingTrendRange,
} from "@/components/dashboard/spending-trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrendPoint } from "@/lib/data/finance-types";

const rangeOptions = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
] as const satisfies Array<{ label: string; value: SpendingTrendRange }>;

interface SpendingTrendPanelProps {
  monthlyTrend: TrendPoint[];
  weeklyTrend: TrendPoint[];
}

export function SpendingTrendPanel({
  monthlyTrend,
  weeklyTrend,
}: SpendingTrendPanelProps) {
  const [range, setRange] = useState<SpendingTrendRange>("monthly");

  return (
    <Card className="border border-border/40 bg-surface shadow-none lg:col-span-8">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="font-heading text-xl">Spending Trend</CardTitle>
          <div className="inline-flex rounded-full bg-surface-container p-1">
            {rangeOptions.map((option) => {
              const active = option.value === range;

              return (
                <button
                  className="relative min-w-20 rounded-full px-3 py-1.5 font-semibold text-xs transition-colors"
                  key={option.value}
                  onClick={() => setRange(option.value)}
                  type="button"
                >
                  {active ? (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-primary"
                      layoutId="spending-trend-range-pill"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  ) : null}
                  <span
                    className={
                      active
                        ? "relative text-primary-foreground"
                        : "relative text-muted-foreground"
                    }
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DashboardSpendingTrendChart
          monthlyData={monthlyTrend}
          range={range}
          weeklyData={weeklyTrend}
        />
      </CardContent>
    </Card>
  );
}
