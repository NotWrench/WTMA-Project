"use client";

import {
  BarChart3,
  LayoutDashboard,
  Settings,
  Wallet,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { DashboardUser } from "./types";

const navigation = [
  {
    href: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
    matches: (pathname: string) => pathname === "/",
  },
  {
    href: "/expenses",
    icon: Wallet,
    label: "Expenses",
    matches: (pathname: string) => pathname.startsWith("/expenses"),
  },
  {
    href: "/budgets",
    icon: WalletCards,
    label: "Budgets",
    matches: (pathname: string) => pathname.startsWith("/budgets"),
  },
  {
    href: "/reports",
    icon: BarChart3,
    label: "Reports",
    matches: (pathname: string) => pathname.startsWith("/reports"),
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    matches: (pathname: string) => pathname.startsWith("/settings"),
  },
] as const;

const WHITESPACE_PATTERN = /\s+/u;

const getInitials = (name: string): string => {
  const words = name.trim().split(WHITESPACE_PATTERN).filter(Boolean);

  if (words.length === 0) {
    return "TM";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export function DashboardSidebar({ user }: { user: DashboardUser }) {
  const pathname = usePathname();

  return (
    <>
      <div className="sticky top-0 z-40 border-border/30 border-b bg-surface-container-low/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <span className="font-heading font-semibold text-primary text-xl">
            Trackami
          </span>
          <Avatar size="sm">
            {user.image ? (
              <AvatarImage alt={user.name} src={user.image} />
            ) : null}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.matches(pathname);

            return (
              <Link
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-xs transition-colors",
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "bg-surface-container text-muted-foreground hover:text-foreground"
                )}
                href={item.href}
                key={item.label}
              >
                <Icon className="size-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-border/30 border-r bg-surface-container-low px-4 py-5 lg:flex">
        <div className="px-2">
          <span className="font-heading font-semibold text-2xl text-primary">
            Trackami
          </span>
        </div>

        <nav className="mt-8 flex-1 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.matches(pathname);

            return (
              <Link
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-sm transition-colors",
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-surface-container-high hover:text-foreground"
                )}
                href={item.href}
                key={item.label}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 flex items-center gap-3 border-border/30 border-t px-2 pt-5">
          <Avatar>
            {user.image ? (
              <AvatarImage alt={user.name} src={user.image} />
            ) : null}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground text-sm">
              {user.name}
            </p>
            <p className="truncate text-muted-foreground text-xs">
              {user.plan}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
