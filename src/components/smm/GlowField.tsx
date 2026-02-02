import * as React from "react";

import { cn } from "@/lib/utils";

type GlowFieldProps = {
  className?: string;
  strength?: number; // 0..1
};

/**
 * Signature moment: um campo de glow que segue o ponteiro.
 * Respeita prefers-reduced-motion (fica estático).
 */
export function GlowField({ className, strength = 0.85 }: GlowFieldProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduced = React.useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    [],
  );

  React.useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--gx", `${x.toFixed(2)}%`);
      el.style.setProperty("--gy", `${y.toFixed(2)}%`);
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "[--gx:50%] [--gy:40%]",
        className,
      )}
      style={{
        opacity: strength,
      }}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute -inset-24",
          "bg-hero",
          "animate-glow-pulse",
          "[background-position:var(--gx)_var(--gy)]",
        )}
      />
      <div className="absolute inset-0 bg-grid opacity-70" />
    </div>
  );
}
