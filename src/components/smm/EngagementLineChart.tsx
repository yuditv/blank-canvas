import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Point = { day: string; followers: number; interactions: number };

type EngagementLineChartProps = {
  title?: string;
  subtitle?: string;
  data: Point[];
  className?: string;
};

export function EngagementLineChart({
  title = "Engajamento (7 dias)",
  subtitle = "Seguidores e interações estimadas",
  data,
  className,
}: EngagementLineChartProps) {
  return (
    <Card className={cn("panel-glass border-border/70 shadow-glass", "animate-enter", className)}>
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> Seguidores
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent" /> Interações
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 14, bottom: 0, left: -6 }}>
              <CartesianGrid stroke="hsl(var(--border) / 0.5)" strokeDasharray="6 6" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover) / 0.92)",
                  border: "1px solid hsl(var(--border) / 0.8)",
                  borderRadius: 12,
                  boxShadow: "0 18px 60px -34px hsl(var(--foreground) / 0.4)",
                  backdropFilter: "blur(12px)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="interactions"
                stroke="hsl(var(--accent))"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          * Valores demonstrativos (UI primeiro). Quando conectarmos a API, estes dados virão do seu endpoint.
        </p>
      </CardContent>
    </Card>
  );
}
