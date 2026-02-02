import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock4, Zap } from "lucide-react";

export type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  status: "queued" | "running" | "done";
};

const statusIcon = {
  queued: Clock4,
  running: Zap,
  done: CheckCircle2,
} as const;

export function ActivityFeed({ items, className }: { items: ActivityItem[]; className?: string }) {
  return (
    <Card className={cn("panel-glass border-border/70 shadow-glass", "animate-enter", className)}>
      <CardHeader className="pb-2">
        <h2 className="text-base font-semibold">Atividades recentes</h2>
        <p className="text-sm text-muted-foreground">Fila, execução e entregas</p>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3">
          {items.map((item) => {
            const Icon = statusIcon[item.status];
            return (
              <li
                key={item.id}
                className={cn(
                  "group flex items-start gap-3 rounded-lg border border-border/60",
                  "bg-background/25 p-3 transition-transform duration-200",
                  "hover:translate-y-[-2px] hover:shadow-glow",
                )}
              >
                <div className="mt-0.5 rounded-md border border-border/70 bg-background/30 p-1.5">
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      item.status === "done" ? "text-primary" : item.status === "running" ? "text-accent" : "text-muted-foreground",
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
