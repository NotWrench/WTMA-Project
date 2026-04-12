import type { ReactNode } from "react";
import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import type { DashboardUser } from "@/components/dashboard/types";

interface DashboardShellProps {
  children: ReactNode;
  user: DashboardUser;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardSidebar user={user} />

      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
