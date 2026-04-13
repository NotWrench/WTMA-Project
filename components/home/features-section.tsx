"use client";

import { BellRing, LineChart, Smartphone, Wallet } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function FeaturesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      className="relative w-full overflow-hidden border-border/40 border-t bg-surface-container-low/30 py-24"
      ref={containerRef}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-heading font-medium text-4xl text-primary tracking-tight sm:text-5xl">
              Features Crafted for Focus
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-light text-lg text-muted-foreground">
              We&apos;ve removed the noise from personal finance, leaving only
              the essential tools for a balanced life.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          style={{ y: y1 }}
        >
          {/* Intuitive Budgeting */}
          <motion.div
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-background p-8 shadow-sm transition-shadow hover:shadow-md md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="relative z-10 max-w-sm">
              <Wallet className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-3 font-bold font-heading text-2xl text-foreground">
                Intuitive Budgeting
              </h3>
              <p className="font-light text-muted-foreground leading-relaxed">
                Allocate funds to the things that matter. Our fluid budgeting
                interface adapts to your life, not the other way around.
              </p>
            </div>

            <div className="relative z-10 mt-12 flex h-48 items-end rounded-2xl bg-surface-container p-6">
              <ChartContainer
                className="h-full w-full"
                config={{
                  budget: { label: "Budget", color: "var(--chart-1)" },
                }}
              >
                <ResponsiveContainer height="100%" width="100%">
                  <BarChart
                    data={[
                      { name: "Jan", budget: 75 },
                      { name: "Feb", budget: 100 },
                      { name: "Mar", budget: 60 },
                      { name: "Apr", budget: 30 },
                    ]}
                  >
                    <Bar
                      dataKey="budget"
                      fill="var(--color-budget)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </motion.div>

          {/* Deep Insights */}
          <motion.div
            className="flex flex-col rounded-3xl border border-border/50 bg-secondary-container p-8 shadow-sm transition-shadow hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <LineChart className="mb-4 h-10 w-10 text-secondary" />
            <h3 className="mb-3 font-bold font-heading text-2xl text-on-secondary-container">
              Deep Insights
            </h3>
            <p className="flex-1 font-light text-on-secondary-container/80 leading-relaxed">
              Go beyond numbers. Understand the emotional and lifestyle patterns
              behind your spending habits.
            </p>

            <div className="mt-8 flex justify-center pb-4">
              <div className="relative flex h-32 w-full items-center justify-center">
                <ChartContainer
                  className="h-full w-full max-w-[200px]"
                  config={{
                    savings: { label: "Savings", color: "var(--chart-2)" },
                  }}
                >
                  <ResponsiveContainer height="100%" width="100%">
                    <RechartsLineChart
                      data={[
                        { month: "Jan", savings: 20 },
                        { month: "Feb", savings: 40 },
                        { month: "Mar", savings: 35 },
                        { month: "Apr", savings: 80 },
                      ]}
                    >
                      <Line
                        dataKey="savings"
                        dot={false}
                        stroke="var(--color-savings)"
                        strokeWidth={4}
                        type="monotone"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </motion.div>

          {/* Gentle Reminders */}
          <motion.div
            className="rounded-3xl border border-border/50 bg-tertiary-container p-8 shadow-sm transition-shadow hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <BellRing className="mb-4 h-10 w-10 text-tertiary" />
            <h3 className="mb-3 font-bold font-heading text-2xl text-on-tertiary-container">
              Gentle Reminders
            </h3>
            <p className="font-light text-on-tertiary-container/80 leading-relaxed">
              Never miss a payment with soft, non-intrusive notifications that
              keep your mind at ease.
            </p>
          </motion.div>

          {/* Sync Everywhere */}
          <motion.div
            className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-border/50 bg-background shadow-sm transition-shadow hover:shadow-md md:col-span-2 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col justify-center p-8">
              <Smartphone className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-3 font-bold font-heading text-2xl text-primary">
                Sync Everywhere
              </h3>
              <p className="font-light text-muted-foreground leading-relaxed">
                Your archive travels with you. Encrypted, private, and always
                available on all devices, beautifully tailored for each screen.
              </p>
            </div>
            <div className="relative h-64 overflow-hidden md:h-auto">
              <motion.div
                className="absolute inset-0 h-full w-full"
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  alt="Mobile View"
                  className="object-cover"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
