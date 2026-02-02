import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("pricing_settings")
        .select("instaluxo_api_key")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data?.instaluxo_api_key) setApiKey(data.instaluxo_api_key);
    };

    load();
  }, []);

  const handleSave = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      toast.error("Informe a chave da API");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("pricing_settings")
        .upsert({ id: 1, instaluxo_api_key: trimmed }, { onConflict: "id" });

      if (error) {
        toast.error("Não foi possível salvar a chave");
        console.error(error);
        return;
      }

      toast.success("Chave salva com sucesso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="panel-glass border-primary/20">
        <CardHeader className="border-b border-border/60 pb-4">
          <div>
            <h1 className="text-xl font-bold">Configurações</h1>
            <p className="text-sm text-muted-foreground">
              Configure a chave da API da Instaluxo para liberar serviços, saldo e pedidos.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="instaluxo-api-key">Chave da API (Instaluxo)</Label>
            <Input
              id="instaluxo-api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Cole sua chave aqui"
              type="password"
              className="bg-background/60 border-border/70"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Dica: após salvar, recarregue a página de “Novo Pedido” / “Saldo”.
            </p>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? "SALVANDO..." : "SALVAR"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
