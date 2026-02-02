 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { Card, CardContent, CardHeader } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { toast } from "sonner";
  import { AuroraBackground } from "@/components/layout/AuroraBackground";
  import { SamyLuxoLogo } from "@/components/brand/SamyLuxoLogo";
 
 export function LoginPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [isSignUp, setIsSignUp] = useState(false);
   const navigate = useNavigate();
 
   const handleAuth = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
 
     try {
       if (isSignUp) {
         const { error } = await supabase.auth.signUp({
           email,
           password,
         });
         if (error) throw error;
         toast.success("Conta criada! Verifique seu email.");
       } else {
         const { error } = await supabase.auth.signInWithPassword({
           email,
           password,
         });
         if (error) throw error;
         toast.success("Login realizado com sucesso!");
         navigate("/");
       }
     } catch (error: any) {
       toast.error(error.message || "Erro ao autenticar");
     } finally {
       setLoading(false);
     }
   };
 
   return (
      <AuroraBackground className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md panel-glass border-primary/20 animate-enter">
          <CardHeader className="text-center border-b border-border/60 pb-6">
            <div className="flex justify-center mb-4">
              <div className="rounded-2xl border border-border/70 bg-card/50 px-4 py-3 shadow-glow">
                <SamyLuxoLogo />
              </div>
            </div>
            <h1 className="text-2xl font-bold animate-fade-in">
             {isSignUp ? "Criar Conta" : "Bem-vindo de volta"}
           </h1>
           <p className="text-sm text-muted-foreground">
             {isSignUp
               ? "Crie sua conta para começar"
               : "Entre com suas credenciais"}
           </p>
         </CardHeader>
 
         <CardContent className="pt-6">
           <form onSubmit={handleAuth} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="seu@email.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 className="bg-background/60"
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="password">Senha</Label>
               <Input
                 id="password"
                 type="password"
                 placeholder="••••••••"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 minLength={6}
                 className="bg-background/60"
               />
             </div>
 
             <Button
               type="submit"
               className="w-full"
               size="lg"
               disabled={loading}
             >
               {loading
                 ? "Aguarde..."
                 : isSignUp
                 ? "Criar Conta"
                 : "Entrar"}
             </Button>
 
             <div className="text-center">
               <button
                 type="button"
                 onClick={() => setIsSignUp(!isSignUp)}
                 className="text-sm text-primary hover:underline"
               >
                 {isSignUp
                   ? "Já tem conta? Faça login"
                   : "Não tem conta? Cadastre-se"}
               </button>
             </div>
           </form>
         </CardContent>
       </Card>
      </AuroraBackground>
   );
 }