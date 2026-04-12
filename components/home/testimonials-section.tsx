import { ScrollReveal } from "@/components/ui/scroll-reveal";

const testimonials = [
  {
    body: "I never thought tracking expenses could be so therapeutic. The design alone keeps me coming back every day.",
    author: "Sarah Jenkins",
    role: "Interior Designer",
  },
  {
    body: "Serene Expense helped me clear my credit card debt without the usual stress. It's truly a tactile experience.",
    author: "Marcus Thorne",
    role: "Product Manager",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--color-primary-dim)_0%,_transparent_70%)] opacity-5 dark:opacity-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading font-medium text-3xl tracking-tight sm:text-4xl">
              Voices of Serenity
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands who have discovered that financial health is the
              cornerstone of mental clarity.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-16 max-w-2xl lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, idx) => (
              <ScrollReveal delay={idx * 0.2} key={testimonial.author}>
                <div className="justifies-between flex h-full flex-col rounded-xl border border-border/30 bg-card/40 p-10 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-card/60">
                  <blockquote className="flex-auto font-heading font-light text-foreground/90 text-xl leading-relaxed">
                    &ldquo;{testimonial.body}&rdquo;
                  </blockquote>
                  <div className="mt-8 border-border/20 border-t pt-6">
                    <div className="font-medium text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="font-light text-muted-foreground text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
