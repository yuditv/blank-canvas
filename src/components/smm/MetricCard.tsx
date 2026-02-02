import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  delta?: string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
};

export function MetricCard({ title, value, delta, hint, icon: Icon, className }: MetricCardProps) {
  return (
    <Card className={cn("panel-glass border-border/70 shadow-glass", "animate-enter", className)}>
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div
          className={cn(
            "rounded-lg border border-border/70",
            "bg-background/30",
            "p-2 shadow-glow",
          )}
        >
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm">
          {delta ? <span className="text-primary">{delta}</span> : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}
