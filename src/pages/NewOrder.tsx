 import { useState } from "react";
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
import { Instagram, Music2, Youtube, Facebook, Send, Twitch, MonitorPlay, ShoppingCart } from "lucide-react";
 
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
 
   const mockServices = [
     "Instagram Curtidas Mundial [Máx. 500 mil] [Dia 300 mil] - R$ 1,36 por 1000",
     "Instagram Visualizações em Vídeo | Reels | 20M - R$ 0,85 por 1000",
     "TikTok Comentários Mundial [0-1/H] - R$ 12,50 por 1000",
   ];
 
   return (
     <div className="mx-auto max-w-5xl space-y-6">
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
               <SelectContent>
                 {mockServices.map((s, i) => (
                   <SelectItem key={i} value={s}>
                     {s}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
 
           {selectedService && (
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
                   <p className="text-2xl font-bold text-primary">
                     R$ {((parseFloat(quantity) || 0) * 0.00136).toFixed(2)}
                   </p>
                 </div>
               </div>
 
               <Button variant="success" size="lg" className="w-full">
                 ENVIAR PEDIDO
                 <span className="ml-2">›</span>
               </Button>
             </>
           )}
         </CardContent>
       </Card>
     </div>
   );
 }