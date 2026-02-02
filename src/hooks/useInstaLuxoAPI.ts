 import { useState } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 
 const INSTALUXO_BASE_URL = "https://instaluxo.com/api/v2";
 
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
 
   const getApiKey = async (): Promise<string | null> => {
     const { data, error } = await supabase
       .from("pricing_settings")
       .select("instaluxo_api_key")
       .single();
 
     if (error || !data?.instaluxo_api_key) {
       toast.error("Chave API não configurada. Configure em Configurações.");
       return null;
     }
     return data.instaluxo_api_key;
   };
 
   const fetchServices = async (): Promise<InstaLuxoService[]> => {
     setLoading(true);
     try {
       const apiKey = await getApiKey();
       if (!apiKey) return [];
 
       const formData = new URLSearchParams();
       formData.append("key", apiKey);
       formData.append("action", "services");
 
       const response = await fetch(INSTALUXO_BASE_URL, {
         method: "POST",
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
         body: formData.toString(),
       });
 
       if (!response.ok) throw new Error("Erro ao buscar serviços");
       return await response.json();
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
       const apiKey = await getApiKey();
       if (!apiKey) return null;
 
       const formData = new URLSearchParams();
       formData.append("key", apiKey);
       formData.append("action", "balance");
 
       const response = await fetch(INSTALUXO_BASE_URL, {
         method: "POST",
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
         body: formData.toString(),
       });
 
       if (!response.ok) throw new Error("Erro ao buscar saldo");
       return await response.json();
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
       const apiKey = await getApiKey();
       if (!apiKey) return null;
 
       const formData = new URLSearchParams();
       formData.append("key", apiKey);
       formData.append("action", "add");
       formData.append("service", params.service);
       formData.append("link", params.link);
       formData.append("quantity", params.quantity);
 
       const response = await fetch(INSTALUXO_BASE_URL, {
         method: "POST",
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
         body: formData.toString(),
       });
 
       if (!response.ok) throw new Error("Erro ao criar pedido");
       const data = await response.json();
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
       const apiKey = await getApiKey();
       if (!apiKey) return {};
 
       const formData = new URLSearchParams();
       formData.append("key", apiKey);
       formData.append("action", "status");
       formData.append("orders", orderIds.join(","));
 
       const response = await fetch(INSTALUXO_BASE_URL, {
         method: "POST",
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
         body: formData.toString(),
       });
 
       if (!response.ok) throw new Error("Erro ao buscar status");
       return await response.json();
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