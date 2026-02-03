import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useInstaLuxoAPI } from "@/hooks/useInstaLuxoAPI";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

type InstaLuxoService = {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
};

type PlatformId =
  | "all"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "telegram"
  | "twitch"
  | "discord"
  | "outros";

const platformTabs: { id: PlatformId; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "facebook", label: "Facebook" },
  { id: "telegram", label: "Telegram" },
  { id: "twitch", label: "Twitch" },
  { id: "discord", label: "Discord" },
  { id: "outros", label: "Outros" },
];

function detectPlatformId(service: InstaLuxoService): PlatformId {
  const hay = `${service?.category ?? ""} ${service?.name ?? ""}`.toLowerCase();
  if (hay.includes("instagram")) return "instagram";
  if (hay.includes("tiktok")) return "tiktok";
  if (hay.includes("youtube")) return "youtube";
  if (hay.includes("facebook")) return "facebook";
  if (hay.includes("telegram")) return "telegram";
  if (hay.includes("twitch")) return "twitch";
  if (hay.includes("discord")) return "discord";
  return "outros";
}

export function ServicesPage() {
  const navigate = useNavigate();
  const { loading, fetchServices } = useInstaLuxoAPI();

  const [services, setServices] = useState<InstaLuxoService[]>([]);
  const [tab, setTab] = useState<PlatformId>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.error("Faça login para ver os serviços");
        navigate("/login");
        return;
      }
      const dataServices = await fetchServices();
      setServices((dataServices as any) ?? []);
    })();
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter((s) => {
      if (tab !== "all" && detectPlatformId(s) !== tab) return false;
      if (!q) return true;
      return `${s.service} ${s.name ?? ""} ${s.category ?? ""}`.toLowerCase().includes(q);
    });
  }, [services, tab, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card className="panel-glass border-primary/20">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold">Lista de Serviços</h1>
              <p className="text-sm text-muted-foreground">Todos os serviços disponíveis, com filtro por rede.</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="gap-2" aria-label="Filtrar">
                <SlidersHorizontal className="h-4 w-4" />
                Filtrar
              </Button>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar serviços"
                  className="bg-background/60 border-border/70 pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as PlatformId)} className="space-y-4">
            <TabsList className="w-full flex flex-wrap justify-start gap-2">
              {platformTabs.map((t) => (
                <TabsTrigger key={t.id} value={t.id}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={tab} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  Total: <b className="text-foreground">{filtered.length}</b>
                </div>
                <div className="hidden md:block">
                  <Label className="text-xs text-muted-foreground">Dica: clique em “Fazer Novo Pedido” para comprar.</Label>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card/40">
                <ScrollArea className="h-[60vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[90px]">ID</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead className="w-[160px]">Preço / 1000</TableHead>
                        <TableHead className="w-[180px]">Mín - Máx</TableHead>
                        <TableHead className="w-[220px]">Categoria</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-sm text-muted-foreground">
                            Carregando...
                          </TableCell>
                        </TableRow>
                      )}

                      {!loading && filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-sm text-muted-foreground">
                            Nenhum serviço encontrado.
                          </TableCell>
                        </TableRow>
                      )}

                      {!loading &&
                        filtered.map((s) => (
                          <TableRow key={s.service}>
                            <TableCell className="font-mono text-sm">{s.service}</TableCell>
                            <TableCell>
                              <div className="min-w-0">
                                <div className="truncate font-medium">{s.name}</div>
                                <div className="truncate text-xs text-muted-foreground">{s.type}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              R$ {Number(s.rate).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {s.min} - {s.max}
                            </TableCell>
                            <TableCell className="truncate text-sm text-muted-foreground">{s.category}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
