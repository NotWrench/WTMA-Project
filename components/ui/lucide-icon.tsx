import type { LucideIcon, LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

const iconToneClassMap = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  destructive: "text-destructive",
} as const;

function LucideThemedIcon({
  icon: Icon,
  className,
  tone = "default",
  strokeWidth,
  ...props
}: LucideProps & {
  icon: LucideIcon;
  tone?: keyof typeof iconToneClassMap;
}) {
  return (
    <Icon
      className={cn("size-4", iconToneClassMap[tone], className)}
      strokeWidth={strokeWidth ?? 1.85}
      {...props}
    />
  );
}

export { LucideThemedIcon };
