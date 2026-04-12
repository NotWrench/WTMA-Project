"use client";

import { Quote } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const testimonials = [
  {
    body: "I never thought tracking expenses could be so therapeutic. The design alone keeps me coming back every day.",
    author: "Sarah Jenkins",
    role: "Interior Designer",
    image: "1438761681033-6461ffad8d80",
  },
  {
    body: "Serene Expense helped me clear my credit card debt without the usual stress. It's truly a tactile experience.",
    author: "Marcus Thorne",
    role: "Product Manager",
    image: "1472099645785-5658abf4ff4e",
  },
];

export function TestimonialsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      className="mx-auto max-w-7xl overflow-hidden px-6 py-24 lg:px-8"
      ref={containerRef}
    >
      <div className="flex flex-col items-start gap-16 md:flex-row">
        {/* Left Side: Title & Nav */}
        <div className="relative z-10 md:w-1/3">
          <ScrollReveal>
            <h2 className="mb-6 font-bold font-heading text-4xl text-primary tracking-tight sm:text-5xl">
              Voices of Serenity
            </h2>
            <p className="font-light text-lg text-muted-foreground leading-relaxed">
              Join thousands who have discovered that financial health is the
              cornerstone of mental clarity.
            </p>
          </ScrollReveal>
        </div>

        {/* Right Side: Cards */}
        <div className="relative z-0 grid grid-cols-1 gap-8 sm:grid-cols-2 md:w-2/3">
          {testimonials.map((testimonial, idx) => {
            const yTransform = idx === 0 ? y1 : y2;

            return (
              <motion.div
                className={`relative rounded-3xl border border-border/50 bg-surface-container-high/50 p-8 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md dark:bg-card/40 ${idx === 1 ? "mt-0 sm:mt-12" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                key={testimonial.author}
                style={{ y: yTransform }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                whileInView={{ opacity: 1 }}
              >
                <Quote className="absolute -top-4 -left-4 h-12 w-12 rotate-180 text-secondary/20" />
                <p className="relative z-10 mb-8 font-light text-foreground text-lg italic leading-relaxed">
                  &quot;{testimonial.body}&quot;
                </p>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border/50">
                    <Image
                      alt={testimonial.author}
                      className="object-cover"
                      fill
                      src={`https://images.unsplash.com/photo-${testimonial.image}?auto=format&fit=crop&q=80&w=100`}
                    />
                  </div>
                  <div>
                    <p className="font-bold font-heading text-primary">
                      {testimonial.author}
                    </p>
                    <p className="mt-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
