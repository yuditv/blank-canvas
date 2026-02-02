 import { useState, useEffect } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { useInstaLuxoAPI } from "@/hooks/useInstaLuxoAPI";
 import { toast } from "sonner";
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
 
  type DBOrder = {
    id: string;
    provider_order_id: string | null;
    service_name: string | null;
    link: string;
    created_at: string;
    status: string;
    provider_start_count?: number | null;
    provider_remains?: number | null;
  };
 
 export function OrdersPage() {
   const [search, setSearch] = useState("");
   const [orders, setOrders] = useState<DBOrder[]>([]);
   const { loading, fetchOrderStatus } = useInstaLuxoAPI();

   useEffect(() => {
     const loadOrders = async () => {
       const { data: user } = await supabase.auth.getUser();
       if (!user.user) {
         toast.error("Faça login para ver pedidos");
         return;
       }

       const { data, error } = await supabase
         .from("smm_orders")
         .select("*")
         .eq("user_id", user.user.id)
         .order("created_at", { ascending: false });

       if (error) {
         toast.error("Erro ao carregar pedidos");
         console.error(error);
         return;
       }

       setOrders(data || []);

       // Buscar status real da API
       const externalIds = data?.map((o) => o.provider_order_id).filter(Boolean) || [];
       if (externalIds.length > 0) {
         const statuses = await fetchOrderStatus(externalIds);
         // Atualizar status no DB
         for (const order of data || []) {
           const apiStatus = statuses[order.provider_order_id!];
           if (apiStatus) {
             await supabase
               .from("smm_orders")
               .update({
                 provider_status: apiStatus.status,
                 provider_start_count: parseInt(apiStatus.start_count),
                 provider_remains: parseInt(apiStatus.remains),
               })
               .eq("id", order.id);
           }
         }
       }
     };

     loadOrders();
   }, []);

   const filteredOrders = orders.filter((o) => {
     const serviceName = o.service_name || "";
     return (
       serviceName.toLowerCase().includes(search.toLowerCase()) ||
       o.link.toLowerCase().includes(search.toLowerCase())
     );
   });

   const getStatusBadge = (status: string) => {
     switch (status) {
       case "Completed":
       case "completed":
         return <Badge className="bg-success text-success-foreground">CONCLUÍDO</Badge>;
       case "Pending":
       case "pending":
       case "In progress":
         return <Badge variant="secondary">PENDENTE</Badge>;
       case "Canceled":
       case "canceled":
         return <Badge variant="destructive">CANCELADO</Badge>;
       default:
         return <Badge variant="outline">{status}</Badge>;
     }
   };
 
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
 
        {loading && <p className="text-center text-muted-foreground">Carregando...</p>}
        <div className="space-y-3">
          {filteredOrders.map((order) => (
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
                        {order.provider_order_id || order.id.slice(0, 8)}
                     </Badge>
                      <h3 className="font-medium">{order.service_name || "Serviço"}</h3>
                   </div>
                   <p className="text-sm text-muted-foreground truncate">{order.link}</p>
                 </div>
 
                 <div className="flex items-center gap-3">
                    <time className="text-sm text-muted-foreground whitespace-nowrap hidden md:block">
                      {new Date(order.created_at).toLocaleString("pt-BR")}
                    </time>
                    {getStatusBadge(order.status)}
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