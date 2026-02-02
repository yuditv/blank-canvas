 import { useState } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 
 type InstaLuxoService = {
   service: string;
   name: string;
   type: string;
   category: string;
   rate: string;
   min: string;
   max: string;
 };
 
 type InstaLuxoBalance = {
   balance: string;
   currency: string;
 };
 
 type InstaLuxoOrderStatus = {
   charge: string;
   start_count: string;
   status: string;
   remains: string;
   currency: string;
 };
 
 export function useInstaLuxoAPI() {
   const [loading, setLoading] = useState(false);

  const callProxy = async <T,>(body: Record<string, unknown>): Promise<T> => {
    const { data, error } = await supabase.functions.invoke<T>("instaluxo-proxy", {
      body,
    });

    if (error) throw error;
    return data as T;
  };
 
   const fetchServices = async (): Promise<InstaLuxoService[]> => {
     setLoading(true);
     try {
      return await callProxy<InstaLuxoService[]>({ action: "services" });
     } catch (error) {
       toast.error("Erro ao carregar serviços da API");
       console.error(error);
       return [];
     } finally {
       setLoading(false);
     }
   };
 
   const fetchBalance = async (): Promise<InstaLuxoBalance | null> => {
     setLoading(true);
     try {
      return await callProxy<InstaLuxoBalance>({ action: "balance" });
     } catch (error) {
       toast.error("Erro ao carregar saldo da API");
       console.error(error);
       return null;
     } finally {
       setLoading(false);
     }
   };
 
   const createOrder = async (params: {
     service: string;
     link: string;
     quantity: string;
   }): Promise<{ order: string } | null> => {
     setLoading(true);
     try {
      const data = await callProxy<{ order: string }>({
        action: "add",
        service: params.service,
        link: params.link,
        quantity: params.quantity,
      });
       toast.success(`Pedido criado: ${data.order}`);
       return data;
     } catch (error) {
       toast.error("Erro ao criar pedido na API");
       console.error(error);
       return null;
     } finally {
       setLoading(false);
     }
   };
 
   const fetchOrderStatus = async (
     orderIds: string[]
   ): Promise<Record<string, InstaLuxoOrderStatus>> => {
     setLoading(true);
     try {
      return await callProxy<Record<string, InstaLuxoOrderStatus>>({
        action: "status",
        orders: orderIds.join(","),
      });
     } catch (error) {
       toast.error("Erro ao buscar status dos pedidos");
       console.error(error);
       return {};
     } finally {
       setLoading(false);
     }
   };
 
   return {
     loading,
     fetchServices,
     fetchBalance,
     createOrder,
     fetchOrderStatus,
   };
 }