 import { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { useInstaLuxoAPI } from "@/hooks/useInstaLuxoAPI";
 import { toast } from "sonner";
 import { Card, CardContent, CardHeader } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
   SelectItem,
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
 
 export function NewOrderPage() {
   const [selectedPlatform, setSelectedPlatform] = useState("");
   const [serviceSearch, setServiceSearch] = useState("");
   const [selectedService, setSelectedService] = useState("");
   const [link, setLink] = useState("");
   const [quantity, setQuantity] = useState("");
   const [dripFeed, setDripFeed] = useState(false);
 
  const navigate = useNavigate();
  const { loading, fetchServices, createOrder } = useInstaLuxoAPI();
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState<number>(0);

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
    if (userId) loadOrdersCount();
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
    let filtered = services;
    if (selectedPlatform) {
      filtered = filtered.filter((s) =>
        s.category.toLowerCase().includes(selectedPlatform)
      );
    }
    if (serviceSearch) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(serviceSearch.toLowerCase())
      );
    }
    setFilteredServices(filtered);
  }, [selectedPlatform, serviceSearch, services]);

  const handleSubmit = async () => {
    if (!selectedService || !link || !quantity || !userId) {
      toast.error("Preencha todos os campos");
      return;
    }

    const service = services.find((s) => s.service === selectedService);
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
    const markupPercent = 30; // 30% markup
    const priceBRL = providerCost * (1 + markupPercent / 100);

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
      meta: {},
    });

    if (error) {
      toast.error("Erro ao salvar pedido no banco");
      console.error(error);
      return;
    }

    toast.success("Pedido criado com sucesso!");
    navigate("/pedidos");
  };
 
   return (
     <div className="mx-auto max-w-5xl space-y-6">
      {/* Stats Cards */}
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
              onClick={() => navigate("/saldo")}
            >
              <WalletIcon className="mr-2 h-4 w-4" />
              ADICIONAR SALDO
              <span className="ml-2">›</span>
            </Button>
          </CardContent>
        </Card>
      </div>

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
                  {filteredServices.map((s) => (
                    <SelectItem key={s.service} value={s.service}>
                      {s.name} - R$ {(parseFloat(s.rate) * 1).toFixed(2)} / 1000
                    </SelectItem>
                 ))}
               </SelectContent>
              </Select>
            </div>

            {(() => {
              const selectedServiceData = services.find((s) => s.service === selectedService);
              const calculatedPrice = selectedServiceData
                ? (parseFloat(selectedServiceData.rate) * (parseFloat(quantity) || 0)) / 1000
                : 0;

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