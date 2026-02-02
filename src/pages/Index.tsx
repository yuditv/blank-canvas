import { ActivityFeed, type ActivityItem } from "@/components/smm/ActivityFeed";
import { EngagementLineChart } from "@/components/smm/EngagementLineChart";
import { GlowField } from "@/components/smm/GlowField";
import { MetricCard } from "@/components/smm/MetricCard";
import { TopBar } from "@/components/smm/TopBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, HeartHandshake, Sparkles, Shield } from "lucide-react";

const chartData = [
  { day: "Seg", followers: 120, interactions: 210 },
  { day: "Ter", followers: 168, interactions: 260 },
  { day: "Qua", followers: 142, interactions: 310 },
  { day: "Qui", followers: 210, interactions: 390 },
  { day: "Sex", followers: 260, interactions: 470 },
  { day: "Sáb", followers: 240, interactions: 520 },
  { day: "Dom", followers: 310, interactions: 610 },
];

const activity: ActivityItem[] = [
  {
    id: "1",
    title: "Pedido: 1.000 curtidas • Instagram Reels",
    meta: "Status: em execução • ETA ~18min",
    status: "running",
  },
  {
    id: "2",
    title: "Pedido: 500 views • TikTok",
    meta: "Status: na fila • posição #3",
    status: "queued",
  },
  {
    id: "3",
    title: "Pedido: 200 seguidores • Instagram",
    meta: "Concluído • há 2h",
    status: "done",
  },
];

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <GlowField />

      <header className="relative mx-auto w-full max-w-6xl px-4 pt-10">
        <TopBar onRefresh={() => {}} />
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-6">
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Seguidores (hoje)"
            value="+310"
            delta="+12%"
            hint="vs ontem"
            icon={Users}
          />
          <MetricCard
            title="Interações (hoje)"
            value="1.980"
            delta="+18%"
            hint="curtidas/comentários"
            icon={HeartHandshake}
          />
          <MetricCard
            title="Score de saúde"
            value="A-"
            delta="Estável"
            hint="detecção de picos"
            icon={Sparkles}
          />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <EngagementLineChart className="lg:col-span-2" data={chartData} />
          <ActivityFeed items={activity} />
        </section>

        <section className="mt-4">
          <Card className="panel-glass border-border/70 shadow-glass animate-enter">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold">Conectar sua API (próximo passo)</h2>
                  <p className="text-sm text-muted-foreground">
                    Para não expor a sua chave no navegador, a integração deve ser feita via Lovable Cloud.
                  </p>
                </div>
                <div className="hidden rounded-lg border border-border/70 bg-background/25 p-2 md:block">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                  Quando você quiser, eu preparo um proxy seguro (edge function) que chama <span className="text-foreground">instaluxo.com/api/v2</span> e
                  retorna apenas os dados necessários para o dashboard.
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary">Definir endpoints</Button>
                  <Button>Conectar Cloud</Button>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                * Sua chave não foi salva no código.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;
