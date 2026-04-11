import { ArrowRightIcon, LeafIcon, WalletIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideThemedIcon } from "@/components/ui/lucide-icon";
import { Progress } from "@/components/ui/progress";

export default function Page() {
  const monthlyHealthScore = 72;

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl items-center p-6">
      <Card className="w-full">
        <CardHeader className="gap-3">
          <CardTitle className="flex items-center gap-2">
            <LucideThemedIcon icon={LeafIcon} tone="primary" />
            Serene Ledger Theme Applied
          </CardTitle>
          <CardDescription>
            Colors, typography, buttons, progress bars, and Lucide icon styling
            now follow the Stitch design system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 font-medium text-foreground">
                <LucideThemedIcon icon={WalletIcon} tone="secondary" />
                Monthly health
              </span>
              <span className="font-mono text-muted-foreground text-xs">
                {monthlyHealthScore}%
              </span>
            </div>
            <Progress value={monthlyHealthScore} />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button>
              Primary action
              <ArrowRightIcon className="size-4" />
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
