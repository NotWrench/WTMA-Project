"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useTheme } from "@/components/theme-provider";
import { LucideThemedIcon } from "@/components/ui/lucide-icon";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <LucideThemedIcon icon={CircleCheckIcon} tone="primary" />,
        info: <LucideThemedIcon icon={InfoIcon} tone="secondary" />,
        warning: <LucideThemedIcon icon={TriangleAlertIcon} tone="tertiary" />,
        error: <LucideThemedIcon icon={OctagonXIcon} tone="destructive" />,
        loading: (
          <LucideThemedIcon
            className="animate-spin"
            icon={Loader2Icon}
            tone="primary"
          />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--surface-container-low)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      theme={theme}
      toastOptions={{
        classNames: {
          toast:
            "cn-toast border border-border/70 bg-surface-container-low shadow-sm",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
