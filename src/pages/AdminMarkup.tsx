import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MarkupRule = {
  id: string;
  is_active: boolean;
  service_id: number | null;
  category_pattern: string | null;
  markup_percent: number;
  fee_fixed_brl: number;
  created_at?: string;
  updated_at?: string;
};

type DraftRule = {
  service_id: string;
  category_pattern: string;
  markup_percent: string;
  fee_fixed_brl: string;
  is_active: boolean;
};

const emptyDraft = (): DraftRule => ({
  service_id: "",
  category_pattern: "",
  markup_percent: "30",
  fee_fixed_brl: "0",
  is_active: true,
});

export function AdminMarkupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rules, setRules] = useState<MarkupRule[]>([]);
  const [draft, setDraft] = useState<DraftRule>(() => emptyDraft());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      if (!u) {
        toast.error("Faça login para acessar");
        navigate("/login");
        return;
      }

      const { data: adminData, error: adminErr } = await supabase.rpc("is_admin", { _user_id: u.id });
      const admin = !adminErr && !!adminData;
      if (!alive) return;
      setIsAdmin(admin);

      if (!admin) {
        setLoading(false);
        return;
      }

      const { data: rulesData, error: rulesErr } = await supabase
        .from("smm_markup_rules")
        .select("*")
        .order("created_at", { ascending: false });
      if (rulesErr) {
        toast.error("Erro ao carregar regras");
        console.error(rulesErr);
      }
      if (!alive) return;
      setRules((rulesData as any[]) as MarkupRule[]);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [navigate]);

  const canSave = useMemo(() => {
    const hasMatcher = !!draft.service_id.trim() || !!draft.category_pattern.trim();
    const mp = Number(draft.markup_percent);
    const fee = Number(draft.fee_fixed_brl);
    return hasMatcher && Number.isFinite(mp) && Number.isFinite(fee);
  }, [draft]);

  const reload = async () => {
    const { data, error } = await supabase
      .from("smm_markup_rules")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    setRules((data as any[]) as MarkupRule[]);
  };

  const handleCreate = async () => {
    if (!canSave) {
      toast.error("Preencha Service ID ou Categoria e um markup válido");
      return;
    }
    setSaving(true);
    try {
      await supabase
        .from("smm_markup_rules")
        .insert({
          is_active: draft.is_active,
          service_id: draft.service_id.trim() ? Number(draft.service_id) : null,
          category_pattern: draft.category_pattern.trim() ? draft.category_pattern.trim() : null,
          markup_percent: Number(draft.markup_percent),
          fee_fixed_brl: Number(draft.fee_fixed_brl),
        });
      toast.success("Regra criada");
      setDraft(emptyDraft());
      await reload();
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao criar regra");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (r: MarkupRule) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("smm_markup_rules").update({ is_active: !r.is_active }).eq("id", r.id);
      if (error) throw error;
      setRules((prev) => prev.map((x) => (x.id === r.id ? { ...x, is_active: !r.is_active } : x)));
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao atualizar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="mx-auto w-full max-w-5xl">Carregando…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <Card className="panel-glass border-primary/20">
          <CardHeader>
            <h1 className="text-xl font-bold">Painel Admin — Markup</h1>
            <p className="text-sm text-muted-foreground">Acesso restrito.</p>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <Card className="panel-glass border-primary/20">
        <CardHeader className="border-b border-border/60">
          <h1 className="text-xl font-bold">Painel Admin — Markup (%)</h1>
          <p className="text-sm text-muted-foreground">
            Prioridade: <b>Service ID</b> (exato) → <b>Categoria</b> (contém). Taxa fixa em BRL.
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Service ID (opcional)</Label>
              <Input
                value={draft.service_id}
                onChange={(e) => setDraft((d) => ({ ...d, service_id: e.target.value }))}
                placeholder="Ex.: 1234"
                className="bg-background/60 border-border/70"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria (opcional)</Label>
              <Input
                value={draft.category_pattern}
                onChange={(e) => setDraft((d) => ({ ...d, category_pattern: e.target.value }))}
                placeholder="Ex.: instagram"
                className="bg-background/60 border-border/70"
              />
            </div>
            <div className="space-y-2">
              <Label>Markup (%)</Label>
              <Input
                type="number"
                value={draft.markup_percent}
                onChange={(e) => setDraft((d) => ({ ...d, markup_percent: e.target.value }))}
                placeholder="30"
                className="bg-background/60 border-border/70"
              />
            </div>
            <div className="space-y-2">
              <Label>Taxa fixa (R$)</Label>
              <Input
                type="number"
                value={draft.fee_fixed_brl}
                onChange={(e) => setDraft((d) => ({ ...d, fee_fixed_brl: e.target.value }))}
                placeholder="0"
                className="bg-background/60 border-border/70"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setDraft(emptyDraft())} disabled={saving}>
              Limpar
            </Button>
            <Button onClick={handleCreate} disabled={saving || !canSave}>
              Criar regra
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="panel-glass border-primary/20">
        <CardHeader className="border-b border-border/60">
          <h2 className="text-lg font-semibold">Regras cadastradas</h2>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          {rules.length === 0 ? (
            <div className="text-sm text-muted-foreground">Nenhuma regra ainda.</div>
          ) : (
            <div className="space-y-2">
              {rules.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-card/50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {r.service_id != null ? `Service #${r.service_id}` : "(sem service)"} · {r.category_pattern ?? "(sem categoria)"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Markup: <b>{Number(r.markup_percent).toFixed(2)}%</b> · Taxa: <b>R$ {Number(r.fee_fixed_brl).toFixed(2)}</b>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => toggleActive(r)} disabled={saving}>
                      {r.is_active ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
