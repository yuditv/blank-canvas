 import { useState } from "react";
 import { Card, CardHeader, CardContent } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Filter, Search } from "lucide-react";
 
 type Order = {
   id: string;
   title: string;
   link: string;
   date: string;
   status: "completed" | "pending" | "canceled";
 };
 
 const mockOrders: Order[] = [
   {
     id: "167050",
     title: "Instagram Visualizações em Vídeo | Reels | 20M 🔥",
     link: "https://www.instagram.com/reel/DTJYc6dDagU/",
     date: "2026-02-01 20:11:26",
     status: "completed",
   },
   {
     id: "167049",
     title: "Instagram Visualização em Vídeo | 100K 🔥",
     link: "https://www.instagram.com/p/DTJYc6dDagU/",
     date: "2026-02-01 20:08:13",
     status: "completed",
   },
   {
     id: "167044",
     title: "Tiktok Comentários Mundial [0-1/H]",
     link: "https://www.tiktok.com/@merlin_adrianavideo/7595199775788535047",
     date: "2026-02-01 19:29:39",
     status: "completed",
   },
   {
     id: "167041",
     title: "Tiktok Comentários Mundial [0-1/H]",
     link: "https://www.tiktok.com/@merlin_adrianavideo/7583824395785817351",
     date: "2026-02-01 19:25:19",
     status: "completed",
   },
   {
     id: "167035",
     title: "TikTok Comentários Custom [ Max 100K ] | HQ | R365 🔥 | 50K",
     link: "https://www.tiktok.com/@merlin_adrianavideo/7583820851468930311",
     date: "2026-02-01 18:01:29",
     status: "canceled",
   },
 ];
 
 export function OrdersPage() {
   const [search, setSearch] = useState("");
 
   return (
     <div className="mx-auto max-w-6xl space-y-4">
       <Card className="panel-glass border-primary/20">
         <CardHeader className="border-b border-border/60 pb-4">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <h1 className="text-xl font-bold">Histórico de Pedidos</h1>
             <div className="flex items-center gap-2">
               <Button variant="default" size="sm" className="gap-2">
                 <Filter className="h-4 w-4" />
                 Filtrar Pedidos
               </Button>
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                 <Input
                   placeholder="Procurar"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="bg-background/60 border-border/70 pl-9"
                 />
               </div>
             </div>
           </div>
         </CardHeader>
       </Card>
 
       <div className="space-y-3">
         {mockOrders.map((order) => (
           <Card
             key={order.id}
             className="panel-glass border-border/70 hover:border-primary/30 transition-all"
           >
             <CardContent className="p-4">
               <div className="flex items-start justify-between gap-4">
                 <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-3">
                     <Badge
                       variant="outline"
                       className="border-success/50 bg-success/10 text-success font-mono"
                     >
                       {order.id}
                     </Badge>
                     <h3 className="font-medium">{order.title}</h3>
                   </div>
                   <p className="text-sm text-muted-foreground truncate">{order.link}</p>
                 </div>
 
                 <div className="flex items-center gap-3">
                   <time className="text-sm text-muted-foreground whitespace-nowrap">
                     {order.date}
                   </time>
                   {order.status === "completed" && (
                     <Badge className="bg-success text-success-foreground">CONCLUÍDO</Badge>
                   )}
                   {order.status === "pending" && (
                     <Badge variant="secondary">PENDENTE</Badge>
                   )}
                   {order.status === "canceled" && (
                     <Badge variant="destructive">CANCELADO</Badge>
                   )}
                   <Button variant="default" size="icon">
                     ⋮
                   </Button>
                 </div>
               </div>
             </CardContent>
           </Card>
         ))}
       </div>
     </div>
   );
 }