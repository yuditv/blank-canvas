 import { useEffect, useMemo, useState } from "react";
 import { Outlet } from "react-router-dom";
 import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuItem,
   SidebarMenuButton,
   SidebarProvider,
   SidebarTrigger,
   useSidebar,
 } from "@/components/ui/sidebar";
 import { NavLink } from "@/components/NavLink";
 import {
   ShoppingCart,
   History,
   Wallet,
   HelpCircle,
   Bell,
   Coins,
   User,
  LogOut,
  Store,
  FileText,
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { AuroraBackground } from "@/components/layout/AuroraBackground";
 import { SamyLuxoLogo } from "@/components/brand/SamyLuxoLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 import { cn } from "@/lib/utils";
 import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import { ThemeToggle } from "@/components/theme/ThemeToggle";
 
 type AppShellProps = {
   brandName: string;
   currency: "BRL" | "USD";
 };
 
 const routes = [
   { path: "/", icon: ShoppingCart, label: "Fazer Novo Pedido" },
   { path: "/pedidos", icon: History, label: "Histórico de Pedido" },
   { path: "/saldo", icon: Wallet, label: "Adicionar Saldo" },
  { path: "/painel-revenda", icon: Store, label: "Painel de Revenda" },
  { path: "/termos", icon: FileText, label: "Termos" },
   { path: "/ajuda", icon: HelpCircle, label: "FAQ" },
 ];
 
 function AppSidebarContent() {
   const { state } = useSidebar();
   const collapsed = state === "collapsed";
 
   return (
     <Sidebar
       className={cn(
         "bg-sidebar border-r border-sidebar-border transition-all",
         collapsed ? "w-14" : "w-60"
       )}
       collapsible="icon"
     >
       <SidebarHeader className="border-b border-sidebar-border p-4">
          {!collapsed ? (
            <SamyLuxoLogo />
          ) : (
            <div className="flex items-center justify-center">
              <SamyLuxoLogo compact />
            </div>
          )}
       </SidebarHeader>
 
       <SidebarContent className="px-2">
         <SidebarGroup>
           <SidebarGroupContent>
             <SidebarMenu>
               {routes.map((r) => (
                 <SidebarMenuItem key={r.path}>
                   <SidebarMenuButton asChild>
                     <NavLink
                       to={r.path}
                       end
                       className="flex items-center gap-2 hover:bg-sidebar-accent rounded-md"
                       activeClassName="bg-primary text-primary-foreground font-medium"
                     >
                       <r.icon className="h-4 w-4" />
                       {!collapsed && <span>{r.label}</span>}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
       </SidebarContent>
     </Sidebar>
   );
 }
 
 export function AppShell({ brandName, currency }: AppShellProps) {
   const [balance] = useState(1.42);
  const navigate = useNavigate();
   const [userEmail, setUserEmail] = useState<string>("");
   const [userName, setUserName] = useState<string>("");
   const [avatarUrl, setAvatarUrl] = useState<string>("");

   const initials = useMemo(() => {
     const n = (userName || userEmail || "U").trim();
     return n.slice(0, 1).toUpperCase();
   }, [userName, userEmail]);

   useEffect(() => {
     let alive = true;

     (async () => {
       const { data } = await supabase.auth.getUser();
       if (!alive) return;
       const u = data.user;
       const meta = (u?.user_metadata ?? {}) as { name?: string; avatar_url?: string };
       setUserEmail(u?.email ?? "");
       setUserName(meta.name ?? "");
       setAvatarUrl(meta.avatar_url ?? "");
     })();

     const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
       const u = session?.user;
       const meta = (u?.user_metadata ?? {}) as { name?: string; avatar_url?: string };
       setUserEmail(u?.email ?? "");
       setUserName(meta.name ?? "");
       setAvatarUrl(meta.avatar_url ?? "");
     });

     return () => {
       alive = false;
       sub.subscription.unsubscribe();
     };
   }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    navigate("/login");
  };
 
   return (
     <SidebarProvider defaultOpen={true}>
        <AuroraBackground>
          <div className="flex min-h-screen w-full">
            <AppSidebarContent />

            <div className="flex-1 flex flex-col">
              <header className="h-14 border-b border-border flex items-center justify-between px-4 panel-glass animate-fade-in">
             <div className="flex items-center gap-2">
               <SidebarTrigger />
             </div>
 
              <div className="flex items-center gap-2">
               <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5">
                  <Coins className="h-4 w-4 text-accent" />
                 <span className="text-sm font-medium">
                   {currency === "BRL" ? "R$" : "$"} {balance.toFixed(2)}
                 </span>
               </div>
 
               <Button variant="ghost" size="icon" className="relative">
                 <Bell className="h-4 w-4" />
                 <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                   5
                 </span>
               </Button>

                <ThemeToggle />
 
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl || undefined} alt="Foto do perfil" />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/conta")}>
                      <User className="mr-2 h-4 w-4" />
                      Conta
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/termos")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Termos de Uso
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             </div>
           </header>
 
            <main className="flex-1 overflow-auto p-6 animate-fade-in">
             <Outlet />
           </main>
         </div>
          </div>
        </AuroraBackground>
     </SidebarProvider>
   );
 }