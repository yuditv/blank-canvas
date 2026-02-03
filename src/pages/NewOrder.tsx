 import { useState, useEffect } from "react";
import { memo } from "react";
 import { useNavigate } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { useInstaLuxoAPI } from "@/hooks/useInstaLuxoAPI";
 import { useNotifications } from "@/components/notifications/notifications-store";
 import { toast } from "sonner";
 import { Card, CardContent, CardHeader } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
    SelectGroup,
   SelectItem,
    SelectLabel,
    SelectSeparator,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Checkbox } from "@/components/ui/checkbox";
import { Instagram, Music2, Youtube, Facebook, Send, Twitch, MonitorPlay, ShoppingCart, Package, Wallet as WalletIcon, Lightbulb } from "lucide-react";
 
 const socialPlatforms = [
   { id: "instagram", icon: Instagram, label: "Instagram", color: "text-pink-500" },
   { id: "tiktok", icon: Music2, label: "TikTok", color: "text-cyan-400" },
   { id: "youtube", icon: Youtube, label: "Youtube", color: "text-red-500" },
   { id: "facebook", icon: Facebook, label: "Facebook", color: "text-blue-500" },
   { id: "telegram", icon: Send, label: "Telegram", color: "text-blue-400" },
   { id: "twitch", icon: Twitch, label: "Twitch", color: "text-purple-500" },
   { id: "discord", icon: MonitorPlay, label: "Discord", color: "text-indigo-500" },
 ];
 
const StatsCards = memo(({ totalOrders, onNavigate }: { totalOrders: number; onNavigate: () => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card className="panel-glass border-primary/30 bg-gradient-to-br from-card/80 to-card/40">
      <CardContent className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Package className="h-4 w-4" />
              TOTAL DE PEDIDOS
            </div>
            <div className="text-4xl font-bold text-primary">
              {totalOrders.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              ✓ Pedidos Enviados ✓
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Package className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="panel-glass border-primary/30 bg-gradient-to-br from-card/80 to-card/40">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-sm font-medium leading-relaxed">
          ⭐ Você pode testar nossos serviços com apenas R$ 1,00 ⭐
        </p>
        <Button
          variant="default"
          className="w-full bg-success hover:bg-success/90 text-white font-semibold"
          onClick={onNavigate}
        >
          <WalletIcon className="mr-2 h-4 w-4" />
          ADICIONAR SALDO
          <span className="ml-2">›</span>
        </Button>
      </CardContent>
    </Card>
  </div>
));

StatsCards.displayName = "StatsCards";

export function NewOrderPage() {
   const [selectedPlatform, setSelectedPlatform] = useState("");
   const [serviceSearch, setServiceSearch] = useState("");
   const [selectedService, setSelectedService] = useState("");
   const [link, setLink] = useState("");
   const [quantity, setQuantity] = useState("");
   const [dripFeed, setDripFeed] = useState(false);
 
  const navigate = useNavigate();
  const { loading, fetchServices, createOrder } = useInstaLuxoAPI();
  const { addNotification } = useNotifications();
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [groupedServices, setGroupedServices] = useState<Record<string, Record<string, any[]>>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [markupRules, setMarkupRules] = useState<any[]>([]);

  const detectPlatformId = (service: any): string => {
    const hay = `${service?.category ?? ""} ${service?.name ?? ""}`.toLowerCase();
    if (hay.includes("instagram")) return "instagram";
    if (hay.includes("tiktok")) return "tiktok";
    if (hay.includes("youtube")) return "youtube";
    if (hay.includes("facebook")) return "facebook";
    if (hay.includes("telegram")) return "telegram";
    if (hay.includes("twitch")) return "twitch";
    if (hay.includes("discord")) return "discord";
    return "outros";
  };

  const getPlatformLabel = (platformId: string) =>
    socialPlatforms.find((p) => p.id === platformId)?.label ?? "Outros";

  const groupServices = (list: any[]) => {
    const grouped: Record<string, Record<string, any[]>> = {};
    for (const s of list) {
      const platformId = detectPlatformId(s);
      const category = String(s?.category ?? "Sem categoria").trim() || "Sem categoria";
      grouped[platformId] ||= {};
      grouped[platformId][category] ||= [];
      grouped[platformId][category].push(s);
    }

    const platformOrder = [...socialPlatforms.map((p) => p.id), "outros"];
    const ordered: Record<string, Record<string, any[]>> = {};
    for (const pid of platformOrder) {
      if (!grouped[pid]) continue;
      const categories = Object.keys(grouped[pid]).sort((a, b) => a.localeCompare(b, "pt-BR"));
      ordered[pid] = {};
      for (const c of categories) {
        ordered[pid][c] = grouped[pid][c]
          .slice()
          .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
      }
    }
    return ordered;
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.error("Faça login para criar pedidos");
        navigate("/login");
        return;
      }
      setUserId(data.user.id);
    };
    loadUser();
  }, [navigate]);

  useEffect(() => {
    const loadOrdersCount = async () => {
      if (!userId) return;
      const { count } = await supabase
        .from("smm_orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      setTotalOrders(count || 0);
    };
    loadOrdersCount();
  }, [userId]);

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchServices();
      setServices(data);
      setFilteredServices(data);
    };
    if (userId) loadServices();
  }, [userId]);

  useEffect(() => {
    const loadMarkupRules = async () => {
      const { data, error } = await supabase
        .from("smm_markup_rules")
        .select("*")
        .eq("is_active", true);
      if (error) {
        console.error(error);
        return;
      }
      setMarkupRules(data ?? []);
    };
    if (userId) void loadMarkupRules();
  }, [userId]);

  const getAppliedRule = (service: any) => {
    if (!service) return null;

    // Priority 1: exact service_id match
    const byService = markupRules.find((r) => Number(r.service_id) === Number(service.service));
    if (byService) return byService;

    // Priority 2: category pattern match (contains)
    const category = String(service.category ?? "").toLowerCase();
    const byCategory = markupRules.find((r) => {
      const p = String(r.category_pattern ?? "").trim().toLowerCase();
      if (!p) return false;
      return category.includes(p);
    });
    return byCategory ?? null;
  };

  useEffect(() => {
    let filtered = services;
    if (selectedPlatform) {
      filtered = filtered.filter((s) => detectPlatformId(s) === selectedPlatform);
    }
    if (serviceSearch) {
      const q = serviceSearch.toLowerCase();
      filtered = filtered.filter((s) => `${s.name ?? ""} ${s.category ?? ""}`.toLowerCase().includes(q));
    }
    setFilteredServices(filtered);
    setGroupedServices(groupServices(filtered));
  }, [selectedPlatform, serviceSearch, services]);

  const handleSubmit = async () => {
    if (!selectedService || !link || !quantity || !userId) {
      toast.error("Preencha todos os campos");
      return;
    }

    // API retorna `service` como number (ex.: 3704) e o Select mantém como string.
    // Normalizamos para evitar falhas em comparações e manter o preço atualizando corretamente.
    const service = services.find((s) => String(s.service) === String(selectedService));
    if (!service) return;

    const orderData = await createOrder({
      service: selectedService,
      link,
      quantity,
    });

    if (!orderData) return;

    // Salvar no Supabase
    const providerRate = parseFloat(service.rate);
    const qty = parseInt(quantity);
    const providerCost = (providerRate * qty) / 1000;

    const appliedRule = getAppliedRule(service);
    const markupPercent = Number(appliedRule?.markup_percent ?? 30);
    const feeFixedBRL = Number(appliedRule?.fee_fixed_brl ?? 0);
    const priceBRL = providerCost * (1 + markupPercent / 100) + feeFixedBRL;

    const { error } = await supabase.from("smm_orders").insert({
      user_id: userId,
      provider_order_id: orderData.order,
      service_id: parseInt(service.service),
      service_name: service.name,
      link,
      quantity: qty,
      provider_cost_brl: providerCost,
      price_brl: priceBRL,
      profit_brl: priceBRL - providerCost,
      markup_percent: markupPercent,
      credits_spent: priceBRL,
      status: "pending",
      meta: {
        fee_fixed_brl: feeFixedBRL,
        markup_rule_id: appliedRule?.id ?? null,
      },
    });

    if (error) {
      toast.error("Erro ao salvar pedido no banco");
      console.error(error);
      return;
    }

    toast.success("Pedido criado com sucesso!");
    addNotification({
      id: `created:${orderData.order}`,
      title: "Pedido criado",
      description: `${service.name} • Pedido #${orderData.order}`,
    });
    navigate("/pedidos");
  };
 
   return (
     <div className="mx-auto max-w-5xl space-y-6">
      <StatsCards totalOrders={totalOrders} onNavigate={() => navigate("/saldo")} />

       <Card className="panel-glass border-primary/20">
         <CardHeader className="border-b border-border/60 pb-4">
           <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
               <ShoppingCart className="h-5 w-5 text-primary" />
             </div>
             <div>
               <h1 className="text-xl font-bold">Fazer Novo Pedido</h1>
               <p className="text-sm text-muted-foreground">
                 Selecione a rede social e o serviço desejado
               </p>
             </div>
           </div>
         </CardHeader>
 
         <CardContent className="space-y-6 pt-6">
           <div className="space-y-3">
             <Label className="text-sm font-medium flex items-center gap-2">
               <span className="text-yellow-500">👇</span>
               ESCOLHA UMA REDE SOCIAL
               <span className="text-yellow-500">👇</span>
             </Label>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                <button
                  onClick={() => setSelectedPlatform("")}
                  className={`
                      flex flex-col items-center gap-2 rounded-lg border p-3 transition-all
                      ${
                        selectedPlatform === ""
                          ? "border-primary bg-primary/10"
                          : "border-border/70 bg-card/60 hover:bg-card/80"
                      }
                    `}
                >
                  <span className="text-xs font-medium">Todas</span>
                </button>
               {socialPlatforms.map((p) => (
                 <button
                   key={p.id}
                   onClick={() => setSelectedPlatform(p.id)}
                   className={`
                     flex flex-col items-center gap-2 rounded-lg border p-3 transition-all
                     ${
                       selectedPlatform === p.id
                         ? "border-primary bg-primary/10"
                         : "border-border/70 bg-card/60 hover:bg-card/80"
                     }
                   `}
                 >
                   <p.icon className={`h-5 w-5 ${p.color}`} />
                   <span className="text-xs font-medium">{p.label}</span>
                 </button>
               ))}
             </div>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="service-search" className="text-sm">
               Pesquise o nome do serviço:
             </Label>
             <Input
               id="service-search"
               placeholder="Exemplo: Instagram Curtidas"
               value={serviceSearch}
               onChange={(e) => setServiceSearch(e.target.value)}
               className="bg-background/60 border-border/70"
             />
           </div>
 
           <div className="space-y-3">
             <Label className="text-sm font-medium flex items-center gap-2">
               <span className="text-yellow-500">👇</span>
               ESCOLHA UM SERVIÇO
               <span className="text-yellow-500">👇</span>
             </Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
               <SelectTrigger className="bg-background/60 border-border/70">
                 <SelectValue placeholder="EXCLUSIVO - PROMOCIONAL" />
               </SelectTrigger>
                 <SelectContent className="max-h-[300px]">
                   {loading && (
                     <SelectItem value="__loading__" disabled>
                       Carregando...
                     </SelectItem>
                   )}

                   {!loading && filteredServices.length === 0 && (
                     <SelectItem value="__empty__" disabled>
                       Nenhum serviço encontrado
                     </SelectItem>
                   )}

                   {Object.entries(groupedServices).map(([platformId, categories], platformIdx) => (
                     <div key={platformId}>
                       {!selectedPlatform && (
                         <>
                            <SelectItem value={`__platform_${platformId}`} disabled>
                              <span className="text-xs text-muted-foreground">
                                {getPlatformLabel(platformId)}
                              </span>
                            </SelectItem>
                           <SelectSeparator />
                         </>
                       )}

                       {Object.entries(categories).map(([category, items]) => (
                         <SelectGroup key={`${platformId}:${category}`}>
                           <SelectLabel className="text-xs">{category}</SelectLabel>
                           {items.map((s) => (
                             <SelectItem key={s.service} value={String(s.service)}>
                               {s.name} — R$ {Number(s.rate).toFixed(2)} / 1000
                             </SelectItem>
                           ))}
                         </SelectGroup>
                       ))}

                       {platformIdx < Object.keys(groupedServices).length - 1 && <SelectSeparator />}
                     </div>
                   ))}
                 </SelectContent>
              </Select>
            </div>

            {(() => {
              const selectedServiceData = services.find((s) => String(s.service) === String(selectedService));
              const providerCost = selectedServiceData
                ? (parseFloat(selectedServiceData.rate) * (parseFloat(quantity) || 0)) / 1000
                : 0;
              const rule = selectedServiceData ? getAppliedRule(selectedServiceData) : null;
              const markupPercent = Number(rule?.markup_percent ?? 30);
              const feeFixedBRL = Number(rule?.fee_fixed_brl ?? 0);
              const markupValue = providerCost * (markupPercent / 100);
              const calculatedPrice = providerCost + markupValue + feeFixedBRL;

              return selectedService && (
             <>
               <div className="space-y-2">
                 <Label htmlFor="link" className="text-sm flex items-center gap-2">
                   <span>🔗 Link:</span>
                 </Label>
                 <Input
                   id="link"
                   placeholder="Cole o link do post/perfil aqui"
                   value={link}
                   onChange={(e) => setLink(e.target.value)}
                   className="bg-background/60 border-border/70"
                 />
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="quantity" className="text-sm">
                   Quantidade
                 </Label>
                 <Input
                   id="quantity"
                   type="number"
                   placeholder="Mínimo: 10 - Máximo: 500 000"
                   value={quantity}
                   onChange={(e) => setQuantity(e.target.value)}
                   className="bg-background/60 border-border/70"
                 />
                 <p className="text-xs text-muted-foreground">
                   Mínimo: 10 - Máximo: 500 000
                 </p>
               </div>
 
               <div className="flex items-center gap-2">
                 <Checkbox
                   id="drip-feed"
                   checked={dripFeed}
                   onCheckedChange={(c) => setDripFeed(!!c)}
                 />
                 <Label htmlFor="drip-feed" className="text-sm cursor-pointer">
                   Drip-feed
                 </Label>
               </div>
 
               <div className="space-y-2">
                 <Label className="text-sm flex items-center gap-2">
                   <span>💳 Preço:</span>
                 </Label>
                 <div className="rounded-lg border border-primary/30 bg-card/60 p-4">
                    <p className="text-2xl font-bold text-primary">R$ {calculatedPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Serviço: {selectedServiceData?.name}
                    </p>

                     <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
                       <div className="flex items-center justify-between">
                         <span>Custo (provedor)</span>
                         <span>R$ {providerCost.toFixed(2)}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span>Markup ({markupPercent.toFixed(2)}%)</span>
                         <span>R$ {markupValue.toFixed(2)}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span>Taxa fixa</span>
                         <span>R$ {feeFixedBRL.toFixed(2)}</span>
                       </div>
                       <div className="mt-1 h-px bg-border" />
                       <div className="flex items-center justify-between font-medium text-foreground">
                         <span>Lucro estimado</span>
                         <span>R$ {(calculatedPrice - providerCost).toFixed(2)}</span>
                       </div>
                     </div>
                 </div>
               </div>
 
                <Button
                  variant="success"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "ENVIANDO..." : "ENVIAR PEDIDO ›"}
               </Button>
             </>
            );
            })()}
         </CardContent>
       </Card>
     </div>
   );
 }