import { headers } from "next/headers";
import Link from "next/link";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardUser } from "@/components/dashboard/get-dashboard-user";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { TactileNoise } from "@/components/ui/tactile-noise";
import { auth } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/data/finance";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    const snapshot = await getDashboardSnapshot(session.user.id);

    return (
      <DashboardShell user={getDashboardUser(session)}>
        <DashboardOverview snapshot={snapshot} />
      </DashboardShell>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-foreground">
      <TactileNoise />

      <main className="relative z-10 flex w-full flex-col">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <footer className="relative z-10 w-full border-border/20 border-t bg-background/80 py-12 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 md:flex-row lg:px-8">
          <p className="font-heading font-medium text-foreground/80 text-sm">
            © 2026 Trackami. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 text-muted-foreground text-sm md:mt-0">
            <Link className="transition-colors hover:text-foreground" href="/">
              Privacy Policy
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/">
              Terms of Service
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
