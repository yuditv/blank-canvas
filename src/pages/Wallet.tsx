 import { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { useInstaLuxoAPI } from "@/hooks/useInstaLuxoAPI";
 import { toast } from "sonner";
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
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet as WalletIcon, CreditCard, Info, Copy, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
 
 export function WalletPage() {
   const [apiBalance, setApiBalance] = useState<string | null>(null);
   const [walletBalance, setWalletBalance] = useState<number>(0);
   const [userName, setUserName] = useState<string>("usuário");
   const { loading, fetchBalance } = useInstaLuxoAPI();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [pixPayment, setPixPayment] = useState<any>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [copied, setCopied] = useState(false);

   useEffect(() => {
     const loadData = async () => {
       const { data: user } = await supabase.auth.getUser();
       if (!user.user) {
         toast.error("Faça login para ver o saldo");
        navigate("/login");
         return;
       }

       // Carregar saldo da API Instaluxo
       const balance = await fetchBalance();
       if (balance) setApiBalance(balance.balance);

       // Carregar saldo do wallet Supabase
       const { data: wallet } = await supabase
         .from("user_wallets")
         .select("credits")
         .eq("user_id", user.user.id)
         .single();

       if (wallet) setWalletBalance(wallet.credits || 0);

       // Carregar nome do usuário
       const { data: profile } = await supabase
         .from("profiles")
         .select("whatsapp")
         .eq("user_id", user.user.id)
         .single();

       if (profile?.whatsapp) setUserName(profile.whatsapp);
     };

     loadData();
   }, []);

  const handleCreatePixPayment = async () => {
    if (!amount || parseFloat(amount) < 1) {
      toast.error("Valor mínimo: R$ 1,00");
      return;
    }

    setLoadingPix(true);
    try {
      const { data, error } = await supabase.functions.invoke("mercado-pago-pix", {
        body: { amount: parseFloat(amount) },
      });

      if (error) throw error;

      setPixPayment(data);
      toast.success("PIX gerado com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao gerar PIX");
    } finally {
      setLoadingPix(false);
    }
  };

  const handleCopyPix = async () => {
    if (pixPayment?.qr_code) {
      await navigator.clipboard.writeText(pixPayment.qr_code);
      setCopied(true);
      toast.success("PIX copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

   return (
     <div className="mx-auto max-w-4xl space-y-6">
       <Card className="panel-glass border-primary/20">
         <CardHeader className="border-b border-border/60 pb-4">
           <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
               <WalletIcon className="h-5 w-5 text-primary" />
             </div>
             <div>
               <h1 className="text-xl font-bold">Adicionar saldo</h1>
             </div>
           </div>
         </CardHeader>
 
         <CardContent className="pt-6">
           <Tabs defaultValue="add" className="space-y-6">
             <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value="add">Adicionar</TabsTrigger>
               <TabsTrigger value="history">Histórico</TabsTrigger>
             </TabsList>
 
             <TabsContent value="add" className="space-y-6">
                {pixPayment ? (
                  <Card className="bg-card/40 border-primary/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-primary">PIX Gerado</h3>
                        <p className="text-sm text-muted-foreground">
                          Escaneie o QR Code ou copie o código PIX
                        </p>
                      </div>

                      {pixPayment.qr_code_base64 && (
                        <div className="flex justify-center">
                          <img
                            src={`data:image/png;base64,${pixPayment.qr_code_base64}`}
                            alt="QR Code PIX"
                            className="max-w-xs rounded-lg border border-border/60"
                          />
                        </div>
                      )}

                      {pixPayment.qr_code && (
                        <div className="space-y-2">
                          <Label className="text-sm">Código PIX (Copia e Cola)</Label>
                          <div className="flex gap-2">
                            <Input
                              value={pixPayment.qr_code}
                              readOnly
                              className="bg-background/60 font-mono text-xs"
                            />
                            <Button variant="outline" size="icon" onClick={handleCopyPix}>
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="text-center space-y-1">
                        <p className="text-2xl font-bold text-primary">
                          R$ {pixPayment.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Pagamento detectado automaticamente após confirmação
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setPixPayment(null);
                          setAmount("");
                        }}
                      >
                        Gerar Novo PIX
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
               <div className="space-y-2">
                 <Label className="text-sm flex items-center gap-2">
                   <span>💳 1º - Escolha um método de pagamento</span>
                 </Label>
                 <Select defaultValue="pix">
                   <SelectTrigger className="bg-background/60 border-border/70">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="pix">
                       Pix - Automático [mín: R$ 1,00] - ONLINE
                     </SelectItem>
                     <SelectItem value="boleto">Boleto Bancário</SelectItem>
                     <SelectItem value="card">Cartão de Crédito</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
 
               <Card className="bg-card/40 border-border/60">
                 <CardContent className="p-6 space-y-4">
                   <div className="flex items-center gap-3">
                     <CreditCard className="h-8 w-8 text-primary" />
                     <div>
                       <p className="font-medium text-yellow-500">
                         Teste nossos serviços com o valor mínimo de R$ 1,00!
                       </p>
                       <p className="text-sm text-muted-foreground">
                         Ao recarregar, você recebe saldo bônus automático!
                       </p>
                     </div>
                   </div>
 
                   <div className="space-y-2">
                     <Button
                       variant="outline"
                       className="w-full justify-between bg-background/60 hover:bg-background/80"
                     >
                       <span>R$ 200,00</span>
                       <span className="text-success font-bold">+2% BÔNUS</span>
                     </Button>
                     <Button
                       variant="outline"
                       className="w-full justify-between bg-background/60 hover:bg-background/80"
                     >
                       <span>R$ 300,00</span>
                       <span className="text-success font-bold">+3% BÔNUS</span>
                     </Button>
                     <Button
                       variant="outline"
                       className="w-full justify-between bg-background/60 hover:bg-background/80"
                     >
                       <span>R$ 500,00</span>
                       <span className="text-success font-bold">+5% BÔNUS</span>
                     </Button>
                   </div>
                 </CardContent>
               </Card>
 
               <div className="space-y-2">
                 <Label htmlFor="amount" className="text-sm flex items-center gap-2">
                   <span>💳 2º - Insira o Valor</span>
                   <span>🪙</span>
                 </Label>
                 <Input
                   id="amount"
                   type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                   placeholder="Valor mínimo: R$1,00"
                   className="bg-background/60 border-border/70"
                 />
               </div>
 
                <Button
                  variant="success"
                  size="lg"
                  className="w-full"
                  onClick={handleCreatePixPayment}
                  disabled={loadingPix}
                >
                 <WalletIcon className="mr-2 h-5 w-5" />
                  {loadingPix ? "GERANDO PIX..." : "PAGAR"}
                 <span className="ml-2">›</span>
               </Button>
                  </>
                )}
             </TabsContent>
 
             <TabsContent value="history">
               <Card className="bg-card/40 border-border/60">
                 <CardContent className="p-8 text-center space-y-4">
                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
                     <WalletIcon className="h-8 w-8 text-primary" />
                   </div>
                   <div>
                      <h3 className="font-semibold">Saldo API Instaluxo</h3>
                      <p className="text-3xl font-bold text-primary mt-2">
                        {loading ? "..." : apiBalance ? `$${parseFloat(apiBalance).toFixed(2)}` : "N/A"}
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-sm">Saldo Wallet (Supabase)</h3>
                      <p className="text-xl font-bold text-muted-foreground mt-1">
                        R$ {walletBalance.toFixed(2)}
                      </p>
                   </div>
                 </CardContent>
               </Card>
             </TabsContent>
           </Tabs>
         </CardContent>
       </Card>
 
       <Card className="panel-glass border-primary/20">
         <CardContent className="p-6">
           <div className="flex items-start gap-3">
             <Info className="h-5 w-5 text-primary mt-0.5" />
             <div className="space-y-1">
               <p className="font-medium text-primary">Informação</p>
               <p className="text-sm text-muted-foreground">
                  Olá <strong>{userName}</strong>, o valor mínimo de pagamento para instaluxo.com
                 é R$1,00. Os pagamentos funcionam de forma totalmente automática.
               </p>
             </div>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 }