import * as React from "react";

import type { NotificationItem } from "@/components/notifications/NotificationsDialog";

type NotificationsContextValue = {
  items: NotificationItem[];
  addNotification: (n: Omit<NotificationItem, "id" | "unread" | "createdAt"> & { id?: string }) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
};

const NotificationsContext = React.createContext<NotificationsContextValue | null>(null);

function uid() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `n_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<NotificationItem[]>([]);

  const addNotification: NotificationsContextValue["addNotification"] = React.useCallback((n) => {
    const item: NotificationItem = {
      id: n.id ?? uid(),
      title: n.title,
      description: n.description,
      href: n.href,
      createdAt: new Date().toISOString(),
      unread: true,
    };
    setItems((prev) => [item, ...prev].slice(0, 100));
  }, []);

  const markAllRead = React.useCallback(() => {
    setItems((prev) => prev.map((x) => ({ ...x, unread: false })));
  }, []);

  const markRead = React.useCallback((id: string) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, unread: false } : x)));
  }, []);

  const clearAll = React.useCallback(() => setItems([]), []);

  const value = React.useMemo<NotificationsContextValue>(
    () => ({ items, addNotification, markAllRead, markRead, clearAll }),
    [items, addNotification, markAllRead, markRead, clearAll],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
