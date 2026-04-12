import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-surface-container-high",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
