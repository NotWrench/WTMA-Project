import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthContainer } from "@/components/auth/auth-container";
import { TactileNoise } from "@/components/ui/tactile-noise";
import { auth } from "@/lib/auth";

export default async function AuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background antialiased selection:bg-primary/20 selection:text-foreground lg:flex-row">
      <TactileNoise />

      {/* Left Abstract / Branding Side */}
      <div className="relative hidden w-full flex-col items-start justify-center overflow-hidden border-border/20 border-r bg-surface-container-low/20 p-12 lg:flex lg:w-1/2 xl:p-24">
        {/* Soft decorative glow */}
        <div className="absolute top-0 left-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_left_center,var(--color-primary-dim)_0%,transparent_60%)] opacity-10 dark:opacity-20" />

        <Link
          className="absolute top-12 left-12 font-heading font-medium text-foreground text-xl transition-opacity hover:opacity-80 xl:top-24 xl:left-24"
          href="/"
        >
          Track<span className="text-primary/80 italic">ami</span>.
        </Link>

        <div className="z-10 mt-20 max-w-lg">
          <h1 className="text-balance font-heading font-medium text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
            Preserve the <span className="text-primary/80 italic">texture</span>{" "}
            of your thoughts.
          </h1>
          <p className="mt-8 text-balance font-light text-lg text-muted-foreground leading-relaxed">
            A serene space for curators, designers, and dreamers to archive
            their physical and digital inspirations in one balanced ecosystem.
          </p>

          <blockquote className="mt-16 border-primary/40 border-l-2 pl-6">
            <p className="font-heading font-light text-foreground/90 text-xl italic leading-relaxed">
              &ldquo;The most organized I&apos;ve felt in years. Trackami is a
              breath of fresh air for my creative process.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right Auth Side */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center p-6 sm:p-12 lg:w-1/2">
        {/* Mobile Header purely for visual balance if viewed on tiny screens */}
        <Link
          className="mb-12 font-heading font-medium text-2xl text-foreground lg:hidden"
          href="/"
        >
          Track<span className="text-primary/80 italic">ami</span>.
        </Link>

        <AuthContainer />
      </div>
    </div>
  );
}
