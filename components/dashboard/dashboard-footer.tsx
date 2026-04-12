import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="border-border/30 border-t bg-surface-container-low/60 px-4 py-6 backdrop-blur-sm sm:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="font-heading font-semibold text-primary">
            Trackami
          </span>
          <span className="text-muted-foreground">|</span>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Trackami. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-muted-foreground text-sm">
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
  );
}
