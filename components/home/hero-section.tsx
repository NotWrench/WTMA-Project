"use client";

import { motion } from "motion/react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 opacity-70 blur-[100px] dark:bg-primary/5" />

      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-1.5 font-medium text-foreground/80 text-sm tracking-wide shadow-sm backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        Joined by 2,000+ mindful savers
      </motion.div>

      <ScrollReveal duration={1.2} yOffset={60}>
        <h1 className="mx-auto max-w-4xl text-balance font-heading font-medium text-6xl tracking-tight sm:text-7xl lg:text-8xl">
          The Art of <span className="text-primary/90 italic">Tactile</span>{" "}
          Archiving.
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={0.2} duration={1} yOffset={40}>
        <p className="mx-auto mt-8 max-w-2xl text-balance font-light text-lg text-muted-foreground leading-relaxed sm:text-xl">
          Experience a meditative approach to personal finance. Tactile Archive
          turns expense tracking into a serene ritual of self-awareness and
          intentional living.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.4} duration={1} yOffset={30}>
        <div className="mt-16 flex flex-col items-center justify-center gap-4">
          <p className="font-medium text-muted-foreground text-sm uppercase tracking-widest">
            Monthly Budget
          </p>
          <div className="flex items-baseline gap-1 font-light font-mono text-5xl text-foreground tracking-tighter sm:text-6xl">
            <span className="text-3xl text-muted-foreground/50">$</span>
            <motion.span
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            >
              4,250.00
            </motion.span>
          </div>
        </div>
      </ScrollReveal>

      {/* Decorative Line */}
      <motion.div
        animate={{ scaleX: 1 }}
        className="mt-24 h-px w-full max-w-sm bg-gradient-to-r from-transparent via-border to-transparent"
        initial={{ scaleX: 0 }}
        transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
      />
    </section>
  );
}
