import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { NotificationsDialog } from "@/components/notifications/NotificationsDialog";

type TopBarProps = {
  className?: string;
  onRefresh?: () => void;
};

export function TopBar({ className, onRefresh }: TopBarProps) {
  const [spinning, setSpinning] = React.useState(false);

  const handleRefresh = () => {
    setSpinning(true);
    onRefresh?.();
    window.setTimeout(() => setSpinning(false), 650);
  };

  return (
    <Card
      className={cn(
        "panel-glass border-border/70",
        "flex items-center justify-between gap-4",
        "px-4 py-3",
        "animate-enter",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Painel SMM</p>
        <h1 className="truncate text-xl font-semibold tracking-tight">
          <span className="text-gradient">Engajamento</span> • Instagram + TikTok
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsDialog count={5} items={[]} className="bg-background/20" />
        <Button onClick={handleRefresh} className="gap-2">
          <RefreshCw className={cn("h-4 w-4", spinning && "animate-spin")} />
          Atualizar
        </Button>
      </div>
    </Card>
  );
}
