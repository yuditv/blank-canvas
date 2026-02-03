import { useEffect, useRef } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useInstaLuxoAPI } from "@/hooks/useInstaLuxoAPI";
import { useNotifications } from "@/components/notifications/notifications-store";

const STORAGE_KEY = "notified:completed_orders:v1";

function loadNotifiedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.map(String));
    return new Set();
  } catch {
    return new Set();
  }
}

function saveNotifiedSet(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set).slice(-500)));
  } catch {
    // ignore
  }
}

function isCompletedStatus(status: string | null | undefined) {
  const s = String(status ?? "").toLowerCase();
  return s === "completed" || s === "concluido" || s === "concluído";
}

export function useOrderCompletionNotifications(options?: { pollIntervalMs?: number }) {
  const pollIntervalMs = options?.pollIntervalMs ?? 45_000;
  const { fetchOrderStatus } = useInstaLuxoAPI();
  const { addNotification } = useNotifications();
  const runningRef = useRef(false);
  const notifiedRef = useRef<Set<string>>(loadNotifiedSet());

  useEffect(() => {
    let alive = true;

    const tick = async () => {
      if (!alive) return;
      if (runningRef.current) return;
      runningRef.current = true;

      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth.user;
        if (!user) return;

        const { data: rows, error } = await supabase
          .from("smm_orders")
          .select("id, provider_order_id, service_name, provider_status, status")
          .eq("user_id", user.id)
          .not("provider_order_id", "is", null)
          .limit(200);

        if (error || !rows || rows.length === 0) return;

        const candidates = rows.filter((o: any) => !isCompletedStatus(o.provider_status) && !isCompletedStatus(o.status));
        const providerIds = candidates.map((o: any) => String(o.provider_order_id)).filter(Boolean);
        if (providerIds.length === 0) return;

        const statuses = await fetchOrderStatus(providerIds);

        // Atualiza provider_status (não precisa aguardar notificação).
        const updates = candidates
          .map((order: any) => {
            const pid = String(order.provider_order_id);
            const api = statuses?.[pid];
            if (!api) return null;
            const charge = Number(api.charge);
            const startCount = Number(api.start_count);
            const remains = Number(api.remains);
            return supabase
              .from("smm_orders")
              .update({
                provider_status: api.status,
                provider_charge: Number.isFinite(charge) ? charge : null,
                provider_start_count: Number.isFinite(startCount) ? startCount : null,
                provider_remains: Number.isFinite(remains) ? remains : null,
              })
              .eq("id", order.id);
          })
          .filter(Boolean);
        if (updates.length > 0) await Promise.all(updates as any);

        const newlyCompleted = candidates.filter((o: any) => {
          const pid = String(o.provider_order_id);
          const next = statuses?.[pid]?.status;
          return isCompletedStatus(next) && !notifiedRef.current.has(pid);
        });

        for (const o of newlyCompleted) {
          const pid = String(o.provider_order_id);
          notifiedRef.current.add(pid);
          addNotification({
            id: `completed:${pid}`,
            title: "Pedido concluído",
            description: `${o.service_name ?? "Serviço"} • Pedido #${pid}`,
          });
        }
        if (newlyCompleted.length > 0) saveNotifiedSet(notifiedRef.current);
      } finally {
        runningRef.current = false;
      }
    };

    void tick();
    const id = window.setInterval(() => void tick(), pollIntervalMs);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [addNotification, fetchOrderStatus, pollIntervalMs]);
}
