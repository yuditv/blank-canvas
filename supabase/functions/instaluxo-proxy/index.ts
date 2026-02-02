/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const INSTALUXO_BASE_URL = "https://instaluxo.com/api/v2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("INSTALUXO_SMM_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "INSTALUXO_SMM_API_KEY não configurado" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json().catch(() => ({} as Record<string, unknown>));
    const action = typeof payload.action === "string" ? payload.action : "";
    if (!action) {
      return new Response(JSON.stringify({ error: "action é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formData = new URLSearchParams();
    formData.set("key", apiKey);
    formData.set("action", action);

    // optional fields depending on action
    for (const k of ["service", "link", "quantity", "orders"]) {
      const v = payload[k as keyof typeof payload];
      if (typeof v === "string" && v.length) formData.set(k, v);
    }

    const res = await fetch(INSTALUXO_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Erro interno", details: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
