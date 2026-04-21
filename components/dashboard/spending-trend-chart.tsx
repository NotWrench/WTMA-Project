"use client";

import { AnimatePresence, motion } from "motion/react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import { STITCH_COLORS } from "@/components/dashboard/stitch-colors";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TrendPoint } from "@/lib/data/finance-types";

interface TrendDataPoint {
  label: string;
  spending: number;
}

export type SpendingTrendRange = "weekly" | "monthly";

const chartConfig = {
  spending: {
    label: "Spending",
    color: STITCH_COLORS.primary,
  },
} satisfies ChartConfig;

const formatCurrency = (value: number): string =>
  `₹ ${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function toChartPoints(points: TrendPoint[]): TrendDataPoint[] {
  return points.map((p) => ({
    label: p.label,
    spending: Math.round(p.spendingPaise / 100),
  }));
}

export function DashboardSpendingTrendChart({
  monthlyData,
  range,
  weeklyData,
}: {
  monthlyData: TrendPoint[];
  range: SpendingTrendRange;
  weeklyData: TrendPoint[];
}) {
  const trendData: TrendDataPoint[] =
    range === "weekly" ? toChartPoints(weeklyData) : toChartPoints(monthlyData);
  const latestLabel = trendData.at(-1)?.label;

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        initial={{ opacity: 0, y: 6 }}
        key={range}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <ChartContainer className="h-72 w-full" config={chartConfig}>
          <BarChart data={trendData} margin={{ left: 8, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickLine={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideIndicator />}
              cursor={{ fill: "rgba(79, 100, 91, 0.08)" }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Bar
              animationDuration={400}
              dataKey="spending"
              radius={[10, 10, 0, 0]}
            >
              {trendData.map((entry) => {
                const isLatest = entry.label === latestLabel;

                return (
                  <Cell
                    fill={
                      isLatest
                        ? STITCH_COLORS.primary
                        : STITCH_COLORS.primaryFixedDim
                    }
                    key={entry.label}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </motion.div>
    </AnimatePresence>
  );
}
