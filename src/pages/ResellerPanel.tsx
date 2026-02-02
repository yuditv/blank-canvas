import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
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
import { Store, Lock } from "lucide-react";

export function ResellerPanelPage() {
  const [domain, setDomain] = useState("");
  const [currency, setCurrency] = useState("BRL");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState("150.00");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast.error("Faça login para acessar");
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!domain || !adminUsername || !adminPassword || !monthlyPrice) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (adminPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("reseller_requests").insert({
        user_id: user.user.id,
        domain,
        currency,
        admin_username: adminUsername,
        admin_password: adminPassword,
        monthly_price: parseFloat(monthlyPrice),
      });

      if (error) throw error;

      toast.success("Solicitação enviada! Aguarde aprovação.");
      setDomain("");
      setAdminUsername("");
      setAdminPassword("");
      setConfirmPassword("");
      setMonthlyPrice("150.00");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao enviar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="panel-glass border-primary/20">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Child panels</h1>
              <p className="text-sm text-muted-foreground">
                Por aqui você pode encomendar o seu painel com as mesmas funções do nosso, para revender os nossos serviços.
              </p>
            </div>
          </div>

          <Card className="bg-card/60 border-primary/30">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-primary flex items-center gap-2">
                <Store className="h-4 w-4" />
                Encomende Seu Painel SMM
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domínio</Label>
                  <Input
                    id="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="seudominio.com"
                    className="bg-background/60 border-border/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-background/60 border-border/70">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Brazilian Real (BRL)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-user">Usuário do administrador</Label>
                  <Input
                    id="admin-user"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="yudiiftv"
                    className="bg-background/60 border-border/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-pass">Senha do administrador</Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-background/60 border-border/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-pass">Confirme a senha</Label>
                  <Input
                    id="confirm-pass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-background/60 border-border/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly-price">Preço por mês</Label>
                  <Input
                    id="monthly-price"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    placeholder="R$ 150,00"
                    className="bg-background/60 border-border/70"
                  />
                </div>

                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "ENVIANDO..." : "Enviar pedido"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-border/60">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 shrink-0">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">Vantagens de ter o painel</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Você pode vender serviços de <strong>instaluxo.com</strong> aos seus clientes configurando
                    seu próprio painel. Você pode obter renda com esta venda. Se você quer
                    começar seu próprio negócio com custos acessíveis, não perca essa
                    oportunidade e preencha o formulário ao lado!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    A frase <strong>instaluxo.com</strong> nunca será usada no site que pertence a você, você
                    terá um painel inteiramente de sua marca.
                  </p>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4">
                <h4 className="font-medium mb-2 text-sm">Altere o nome do servidor para:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary/60" />
                    ns1.perfectdns.com
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary/60" />
                    ns2.perfectdns.com
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}