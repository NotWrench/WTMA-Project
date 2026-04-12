"use client";

import { Sparkles, Wallet } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      className="relative mx-auto grid min-h-[90vh] max-w-7xl items-center gap-16 px-8 py-20 lg:grid-cols-2 lg:py-32"
      ref={containerRef}
    >
      <motion.div
        className="relative z-10 space-y-8"
        style={{ y: y1, opacity }}
      >
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 font-semibold text-on-secondary-container text-sm tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Sparkles className="h-4 w-4" />
          Mindful Finance for Modern Life
        </motion.div>

        <ScrollReveal duration={1.2} yOffset={60}>
          <h1 className="font-extrabold text-5xl text-primary leading-[1.1] tracking-tight lg:text-7xl">
            The Art of <br />
            <span className="text-secondary italic">Trackami.</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2} duration={1} yOffset={40}>
          <p className="max-w-lg font-light text-muted-foreground text-xl leading-relaxed">
            Experience a meditative approach to personal finance. Trackami turns
            expense tracking into a serene ritual of self-awareness and
            intentional living.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.4} duration={1} yOffset={30}>
          <div className="flex justify-center pt-4 lg:justify-start">
            <Link
              className="rounded-xl bg-primary px-8 py-4 font-bold text-lg text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
              href="/auth"
            >
              Get Started
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.6} duration={1} yOffset={20}>
          <div className="flex items-center gap-6 pt-8">
            <div className="flex -space-x-3">
              {[
                "1534528741775-53994a69daeb",
                "1539571696357-5a69c17a67c6",
                "1507003211169-0a1dd7228f2d",
              ].map((id, i) => (
                <div
                  className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background"
                  key={id}
                >
                  <Image
                    alt={`User ${i + 1}`}
                    className="object-cover"
                    fill
                    src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=100`}
                  />
                </div>
              ))}
            </div>
            <p className="font-medium text-muted-foreground text-sm">
              Joined by <span className="font-bold text-primary">2,000+</span>{" "}
              mindful savers
            </p>
          </div>
        </ScrollReveal>
      </motion.div>

      <motion.div
        className="relative w-full max-w-lg lg:ml-auto lg:max-w-none"
        style={{ y: y2, scale }}
      >
        <div className="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-secondary/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-primary/30 blur-[100px]" />

        <motion.div
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/50 p-4 shadow-2xl backdrop-blur-2xl"
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          style={{ transformPerspective: 1000 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Main Mockup Image placeholder */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-inner">
            <Image
              alt="Product UI Preview"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              fill
              src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=800"
            />
          </div>

          {/* Floating UI Elements */}
          <motion.div
            animate={{ opacity: 1, x: 0, y: 0 }}
            className="absolute top-12 right-2 flex items-center gap-4 rounded-xl border border-border/50 bg-background/90 p-4 shadow-lg backdrop-blur-xl sm:right-8"
            initial={{ opacity: 0, x: 20, y: -20 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Monthly Budget
              </p>
              <p className="mt-1 font-bold font-mono text-primary text-xl">
                $4,250.00
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
