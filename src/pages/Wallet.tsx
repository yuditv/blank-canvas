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
 import { Wallet as WalletIcon, CreditCard, Info } from "lucide-react";
 
 export function WalletPage() {
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
                   placeholder="Valor mínimo: R$1,00"
                   className="bg-background/60 border-border/70"
                 />
               </div>
 
               <Button variant="success" size="lg" className="w-full">
                 <WalletIcon className="mr-2 h-5 w-5" />
                 PAGAR
                 <span className="ml-2">›</span>
               </Button>
             </TabsContent>
 
             <TabsContent value="history">
               <Card className="bg-card/40 border-border/60">
                 <CardContent className="p-8 text-center space-y-4">
                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
                     <WalletIcon className="h-8 w-8 text-primary" />
                   </div>
                   <div>
                     <h3 className="font-semibold">Saldo Gasto</h3>
                     <p className="text-3xl font-bold text-primary mt-2">R$ 1010,00</p>
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
                 Olá <strong>yudiiitv</strong>, o valor mínimo de pagamento para instaluxo.com
                 é R$1,00. Os pagamentos funcionam de forma totalmente automática.
               </p>
             </div>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 }