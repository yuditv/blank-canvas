import { cn } from "@/lib/utils";

type SamyLuxoLogoProps = {
  className?: string;
  compact?: boolean;
};

export function SamyLuxoLogo({ className, compact }: SamyLuxoLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={compact ? 28 : 32}
        height={compact ? 28 : 32}
        viewBox="0 0 64 64"
        className="shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="slx" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--primary))" />
            <stop offset="1" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        <path
          d="M32 4l7.2 16.9L56 26l-12 12.1L47 56 32 46.8 17 56l3-17.9L8 26l16.8-5.1L32 4z"
          fill="url(#slx)"
          opacity="0.95"
        />
        <path
          d="M32 10.5l5.1 12 12.6 3.9-9 9.1 2.2 12.9L32 41.9 21.1 48.4l2.2-12.9-9-9.1 12.6-3.9L32 10.5z"
          fill="hsl(var(--background))"
          opacity="0.55"
        />
      </svg>

      {!compact && (
        <div className="leading-none">
          <div className="text-sm font-semibold tracking-wide text-gradient">SamyLuxo</div>
          <div className="text-[10px] text-muted-foreground">plataforma</div>
        </div>
      )}
    </div>
  );
}
