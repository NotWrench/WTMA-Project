"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { STITCH_COLORS } from "@/components/dashboard/stitch-colors";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  essential: {
    label: "Essential",
    color: STITCH_COLORS.primary,
  },
  share: {
    label: "Share",
  },
} satisfies ChartConfig;

export function CategoryBreakdownRadialChart({
  sharePercent,
  topLabel,
}: {
  sharePercent: number;
  topLabel: string;
}) {
  const clamped = Math.min(100, Math.max(0, sharePercent));
  const chartData = [
    {
      category: "essential",
      share: clamped,
      fill: "var(--color-essential)",
    },
  ] as const;

  return (
    <ChartContainer
      className="mx-auto aspect-square max-h-[230px]"
      config={chartConfig}
    >
      <RadialBarChart
        data={chartData}
        endAngle={250}
        innerRadius={72}
        outerRadius={92}
        startAngle={0}
      >
        <PolarGrid
          className="first:fill-surface-container-highest last:fill-surface"
          gridType="circle"
          polarRadius={[92, 72]}
          radialLines={false}
          stroke="none"
        />
        <RadialBar background cornerRadius={10} dataKey="share" />
        <PolarRadiusAxis axisLine={false} tick={false} tickLine={false}>
          <Label
            content={({ viewBox }) => {
              if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) {
                return null;
              }

              return (
                <text
                  dominantBaseline="middle"
                  textAnchor="middle"
                  x={viewBox.cx}
                  y={viewBox.cy}
                >
                  <tspan
                    className="fill-foreground font-extrabold font-heading text-3xl"
                    x={viewBox.cx}
                    y={viewBox.cy}
                  >
                    {`${clamped}%`}
                  </tspan>
                  <tspan
                    className="fill-muted-foreground font-medium"
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) + 22}
                  >
                    {topLabel}
                  </tspan>
                </text>
              );
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
