import * as React from "react";
import { Bell, Check, ExternalLink } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  href?: string;
  createdAt?: string;
  unread?: boolean;
};

type NotificationsDialogProps = {
  count?: number;
  items?: NotificationItem[];
  onMarkAllRead?: () => void;
  className?: string;
};

export function NotificationsDialog({
  count = 0,
  items = [],
  onMarkAllRead,
  className,
}: NotificationsDialogProps) {
  const [open, setOpen] = React.useState(false);

  const unreadCount = React.useMemo(() => {
    if (count) return count;
    return items.filter((x) => x.unread).length;
  }, [count, items]);

  const handleItemClick = (item: NotificationItem) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    toast.message(item.title, { description: item.description ?? "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)} aria-label="Notificações">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-lg"
        onPointerDownOutside={(e) => {
          // Evita fechar o modal ao clicar em elementos que disparam ações internas.
          if (
            (e.target as HTMLElement)?.closest?.("[data-notification-action]") ||
            (e.target as HTMLElement)?.closest?.("[data-notification-item]")
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Notificações</DialogTitle>
          <DialogDescription>Você tem {unreadCount} notificações pendentes.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">Recentes</div>
            <Button
              variant="secondary"
              size="sm"
              data-notification-action
              onClick={(e) => {
                e.stopPropagation();
                onMarkAllRead?.();
                toast.success("Notificações marcadas como lidas");
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Marcar todas como lidas
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-border bg-card/50 p-4 text-sm text-muted-foreground">
              Nenhuma notificação por enquanto.
            </div>
          ) : (
            <ul className="max-h-[55vh] space-y-2 overflow-auto pr-1">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    data-notification-item
                    className={cn(
                      "w-full rounded-lg border border-border bg-card/50 p-3 text-left transition",
                      "hover:bg-card/70 focus:outline-none focus:ring-2 focus:ring-ring",
                    )}
                    onClick={(e) => {
                      // CRÍTICO: evita o clique propagar e fechar o Dialog sem executar ação.
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {item.unread && <span className="h-2 w-2 rounded-full bg-primary" aria-label="Não lida" />}
                          <p className="truncate text-sm font-medium">{item.title}</p>
                        </div>
                        {item.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      {item.href && <ExternalLink className="mt-0.5 h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
