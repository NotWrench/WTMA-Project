"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function CtaSection() {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="relative overflow-hidden rounded-[3rem] bg-primary p-12 text-center text-primary-foreground shadow-2xl md:p-20"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
        >
          {/* Subtle Paper Texture Overlay */}
          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("https://www.transparenttextures.com/patterns/natural-paper.png")',
            }}
          />

          <ScrollReveal delay={0.2}>
            <h2 className="relative z-10 mx-auto mb-8 text-balance font-bold font-heading text-4xl tracking-tight sm:text-5xl md:text-6xl">
              Start Your Mindful <br />{" "}
              <span className="font-light italic">Journey</span> Today.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="relative z-10 mx-auto mb-12 max-w-2xl text-balance font-light text-lg text-primary-foreground/80 leading-relaxed sm:text-xl">
              Join Tactile Archive and transform the way you interact with your
              finances. Enter a world of clarity and intention.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className="group flex items-center justify-center gap-2 rounded-full bg-background px-10 py-4 font-bold text-lg text-primary shadow-lg transition-colors hover:bg-background/90"
                  href="/auth"
                >
                  Create Free Account
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </ScrollReveal>
        </motion.div>
      </div>
    </section>
  );
}
