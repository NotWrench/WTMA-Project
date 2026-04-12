import { ScrollReveal } from "@/components/ui/scroll-reveal";

const features = [
  {
    title: "Intuitive Budgeting",
    description:
      "Allocate funds to the things that matter. Our fluid budgeting interface adapts to your life, not the other way around.",
  },
  {
    title: "Deep Insights",
    description:
      "Go beyond numbers. Understand the emotional and lifestyle patterns behind your spending habits.",
  },
  {
    title: "Gentle Reminders",
    description:
      "Never miss a payment with soft, non-intrusive notifications that keep your mind at ease.",
  },
  {
    title: "Sync Everywhere",
    description:
      "Your archive travels with you. Encrypted, private, and always available on all devices.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative w-full border-border/40 border-t bg-surface-container-low/30 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="font-heading font-medium text-3xl tracking-tight sm:text-4xl">
              Features Crafted for Focus
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We&apos;ve removed the noise from personal finance, leaving only
              the essential tools for a balanced life.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, idx) => (
              <ScrollReveal delay={idx * 0.15} key={feature.title}>
                <div className="group relative flex flex-col items-start pt-6">
                  {/* Subtle Top Border Indicator */}
                  <div className="absolute top-0 left-0 h-[1px] w-12 bg-primary transition-all duration-500 group-hover:w-full" />
                  <dt className="mt-4 font-heading font-medium text-foreground text-xl">
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base text-muted-foreground leading-7">
                    <p className="flex-auto font-light">
                      {feature.description}
                    </p>
                  </dd>
                </div>
              </ScrollReveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
