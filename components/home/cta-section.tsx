"use client";

import { motion } from "motion/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-border/40 border-t py-32 sm:py-40">
      <div className="absolute inset-0 -z-10 translate-y-[20%]">
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-[100%] bg-primary/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading font-medium text-4xl tracking-tight sm:text-5xl">
            Start Your Mindful <br />
            <span className="text-primary/80 italic">Journey</span> Today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-light text-lg text-muted-foreground leading-relaxed">
            Join Serene Expense and transform the way you interact with your
            finances.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <motion.button
              className="rounded-full bg-primary px-8 py-3.5 font-medium text-primary-foreground text-sm tracking-wide shadow-lg transition-colors hover:bg-primary-dim focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter the Archive
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
