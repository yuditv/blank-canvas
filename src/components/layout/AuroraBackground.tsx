import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type AuroraBackgroundProps = PropsWithChildren<{
  className?: string;
}>;

/** Lightweight, CSS-only animated background (safe for performance). */
export function AuroraBackground({ className, children }: AuroraBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 bg-grid opacity-80" />

        {/* Ambient orbs */}
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-glow-pulse" />
        <div className="absolute right-[-140px] top-24 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-3xl animate-float" />
        <div className="absolute left-1/2 top-[60%] h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl animate-glow-pulse" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
