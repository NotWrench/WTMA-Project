import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardUser } from "@/components/dashboard/get-dashboard-user";
import { auth } from "@/lib/auth";

export default async function ExpensesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return (
    <DashboardShell user={getDashboardUser(session)}>{children}</DashboardShell>
  );
}
