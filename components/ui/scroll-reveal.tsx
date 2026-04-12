"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  yOffset = 40,
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      viewport={{ once, margin: "-10%" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
