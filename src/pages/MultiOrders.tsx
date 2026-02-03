import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useInstaLuxoAPI } from "@/hooks/useInstaLuxoAPI";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CopyPlus } from "lucide-react";

type InstaLuxoService = {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
};

type MarkupRule = {
  id: string;
  is_active: boolean;
  service_id: number | null;
  category_pattern: string | null;
  markup_percent: number;
  fee_fixed_brl: number;
};

type ParsedLine = {
  lineNo: number;
  raw: string;
  serviceId: string;
  link: string;
  quantity: number;
};

type RowResult = {
  lineNo: number;
  serviceId: string;
  link: string;
  quantity: number;
  status: "ok" | "error";
  message: string;
  providerOrderId?: string;
};

const lineSchema = z.object({
  serviceId: z
    .string()
    .trim()
    .regex(/^\d+$/, "ID do serviço inválido")
    .max(20, "ID do serviço muito longo"),
  link: z.string().trim().min(5, "Link obrigatório").max(2048, "Link muito longo"),
  quantity: z
    .number()
    .int("Quantidade inválida")
    .positive("Quantidade deve ser maior que 0")
    .max(5_000_000, "Quantidade muito alta"),
});

function parseLines(input: string): { rows: ParsedLine[]; errors: RowResult[] } {
  const rows: ParsedLine[] = [];
  const errors: RowResult[] = [];

  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  lines.forEach((raw, idx) => {
    const lineNo = idx + 1;
    const parts = raw.split("|").map((p) => p.trim());
    if (parts.length < 3) {
      errors.push({
        lineNo,
        serviceId: "",
        link: "",
        quantity: 0,
        status: "error",
        message: "Formato inválido. Use: ID|link|quantidade",
      });
      return;
    }

    const [serviceId, link, quantityRaw] = parts;
    const quantity = Number(quantityRaw);
    const parsed = lineSchema.safeParse({ serviceId, link, quantity });
    if (!parsed.success) {
      errors.push({
        lineNo,
        serviceId,
        link,
        quantity: Number.isFinite(quantity) ? quantity : 0,
        status: "error",
        message: parsed.error.issues[0]?.message ?? "Linha inválida",
      });
      return;
    }

    rows.push({ lineNo, raw, serviceId: parsed.data.serviceId, link: parsed.data.link, quantity: parsed.data.quantity });
  });

  return { rows, errors };
}

export function MultiOrdersPage() {
  const navigate = useNavigate();
  const { loading, fetchServices, createOrder } = useInstaLuxoAPI();

  const [userId, setUserId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [services, setServices] = useState<InstaLuxoService[]>([]);
  const [markupRules, setMarkupRules] = useState<MarkupRule[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<RowResult[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.error("Faça login para criar pedidos");
        navigate("/login");
        return;
      }
      setUserId(data.user.id);
    })();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      const s = await fetchServices();
      setServices(s as any);
    })();

    (async () => {
      const { data, error } = await supabase
        .from("smm_markup_rules")
        .select("*")
        .eq("is_active", true);
      if (error) {
        console.error(error);
        return;
      }
      setMarkupRules((data ?? []) as any);
    })();
  }, [userId]);

  const preview = useMemo(() => parseLines(text), [text]);

  const getAppliedRule = (service: InstaLuxoService | undefined) => {
    if (!service) return null;
    // 1) Service ID exato
    const byService = markupRules.find((r) => Number(r.service_id) === Number(service.service));
    if (byService) return byService;
    // 2) Categoria contém
    const category = String(service.category ?? "").toLowerCase();
    const byCategory = markupRules.find((r) => {
      const p = String(r.category_pattern ?? "").trim().toLowerCase();
      if (!p) return false;
      return category.includes(p);
    });
    if (byCategory) return byCategory;
    // 3) Global (fallback)
    return markupRules.find((r) => r.service_id == null && !r.category_pattern) ?? null;
  };

  const handleSubmit = async () => {
    if (!userId) return;

    const { rows, errors } = parseLines(text);
    if (rows.length === 0) {
      toast.error("Cole pelo menos 1 linha no formato: ID|link|quantidade");
      setResults(errors);
      return;
    }

    if (errors.length > 0) {
      toast.error("Corrija as linhas inválidas antes de enviar");
      setResults(errors);
      return;
    }

    setSubmitting(true);
    setProgress(0);
    setResults([]);

    const out: RowResult[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      setProgress(Math.round((i / rows.length) * 100));

      const svc = services.find((s) => String(s.service) === String(row.serviceId));
      if (!svc) {
        out.push({
          lineNo: row.lineNo,
          serviceId: row.serviceId,
          link: row.link,
          quantity: row.quantity,
          status: "error",
          message: "Service ID não encontrado na lista de serviços",
        });
        continue;
      }

      try {
        const orderData = await createOrder({
          service: row.serviceId,
          link: row.link,
          quantity: String(row.quantity),
        });

        if (!orderData?.order) {
          out.push({
            lineNo: row.lineNo,
            serviceId: row.serviceId,
            link: row.link,
            quantity: row.quantity,
            status: "error",
            message: "Falha ao criar pedido na API",
          });
          continue;
        }

        const providerRate = Number(svc.rate);
        const providerCost = (providerRate * row.quantity) / 1000;
        const rule = getAppliedRule(svc);
        const markupPercent = Number(rule?.markup_percent ?? 30);
        const feeFixedBRL = Number(rule?.fee_fixed_brl ?? 0);
        const priceBRL = providerCost * (1 + markupPercent / 100) + feeFixedBRL;

        const { error: dbErr } = await supabase.from("smm_orders").insert({
          user_id: userId,
          provider_order_id: orderData.order,
          service_id: Number(svc.service),
          service_name: svc.name,
          link: row.link,
          quantity: row.quantity,
          provider_cost_brl: providerCost,
          price_brl: priceBRL,
          profit_brl: priceBRL - providerCost,
          markup_percent: markupPercent,
          credits_spent: priceBRL,
          status: "pending",
          meta: {
            fee_fixed_brl: feeFixedBRL,
            markup_rule_id: rule?.id ?? null,
            batch: true,
            source_line: row.lineNo,
          },
        });

        if (dbErr) {
          console.error(dbErr);
          out.push({
            lineNo: row.lineNo,
            serviceId: row.serviceId,
            link: row.link,
            quantity: row.quantity,
            status: "error",
            message: "Pedido criado, mas falhou ao salvar no banco",
            providerOrderId: orderData.order,
          });
          continue;
        }

        out.push({
          lineNo: row.lineNo,
          serviceId: row.serviceId,
          link: row.link,
          quantity: row.quantity,
          status: "ok",
          message: "Enviado",
          providerOrderId: orderData.order,
        });
      } catch (e: any) {
        console.error(e);
        out.push({
          lineNo: row.lineNo,
          serviceId: row.serviceId,
          link: row.link,
          quantity: row.quantity,
          status: "error",
          message: e?.message ?? "Erro ao enviar",
        });
      }
    }

    setProgress(100);
    setResults(out);
    setSubmitting(false);

    const ok = out.filter((x) => x.status === "ok").length;
    const err = out.length - ok;
    toast.success(`Concluído: ${ok} ok, ${err} erro(s)`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="panel-glass border-primary/20">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <CopyPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Multi-pedidos</h1>
              <p className="text-sm text-muted-foreground">Um pedido por linha. Formato: <b>ID|link|quantidade</b></p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Pedidos (um por linha)</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Exemplo:\n3704|https://instagram.com/p/abc|1000\n3696|https://instagram.com/p/def|500`}
              className="min-h-56 bg-background/60 border-border/70 font-mono text-xs"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                Linhas válidas: <b>{preview.rows.length}</b> · Linhas com erro: <b>{preview.errors.length}</b>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setText("")}>Limpar</Button>
            </div>
          </div>

          {(submitting || progress > 0) && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Progresso: {progress}%</div>
              <Progress value={progress} />
            </div>
          )}

          <Button variant="success" size="lg" className="w-full" onClick={handleSubmit} disabled={loading || submitting}>
            {submitting ? "ENVIANDO..." : "Enviar"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="panel-glass border-primary/20">
          <CardHeader className="border-b border-border/60 pb-4">
            <h2 className="text-lg font-semibold">Resultado</h2>
          </CardHeader>
          <CardContent className="pt-6 space-y-2">
            {results.map((r) => (
              <div key={`${r.lineNo}-${r.serviceId}-${r.link}`} className="flex flex-col gap-1 rounded-lg border border-border bg-card/50 p-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">Linha {r.lineNo}</Badge>
                    <span className="text-sm font-medium">Service #{r.serviceId}</span>
                    <span className="text-xs text-muted-foreground">qtd {r.quantity}</span>
                    {r.providerOrderId && <Badge className="bg-success text-success-foreground">Pedido {r.providerOrderId}</Badge>}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{r.link}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={r.status === "ok" ? "secondary" : "destructive"}>{r.status === "ok" ? "OK" : "ERRO"}</Badge>
                  <span className="text-sm">{r.message}</span>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => navigate("/pedidos")}>Ver pedidos</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
