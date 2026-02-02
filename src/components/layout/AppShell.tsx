 import { useState } from "react";
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
    Settings,
 } from "lucide-react";
 import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/LogoutButton";
 import { cn } from "@/lib/utils";
 
 type AppShellProps = {
   brandName: string;
   currency: "BRL" | "USD";
 };
 
 const routes = [
   { path: "/", icon: ShoppingCart, label: "Fazer Novo Pedido" },
   { path: "/pedidos", icon: History, label: "Histórico de Pedido" },
   { path: "/saldo", icon: Wallet, label: "Adicionar Saldo" },
    { path: "/configuracoes", icon: Settings, label: "Configurações" },
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
         {!collapsed && (
           <div className="flex items-center gap-2">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
               <span className="text-lg font-bold text-primary-foreground">S</span>
             </div>
             <span className="text-lg font-bold text-gradient">SamyLuxo</span>
           </div>
         )}
         {collapsed && (
           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
             <span className="text-lg font-bold text-primary-foreground">S</span>
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
 
   return (
     <SidebarProvider defaultOpen={true}>
       <div className="flex min-h-screen w-full bg-background">
         <AppSidebarContent />
 
         <div className="flex-1 flex flex-col">
           <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50">
             <div className="flex items-center gap-2">
               <SidebarTrigger />
             </div>
 
             <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5">
                 <Coins className="h-4 w-4 text-yellow-500" />
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
 
               <Button variant="ghost" size="icon">
                 <User className="h-4 w-4" />
               </Button>

               <LogoutButton />
             </div>
           </header>
 
           <main className="flex-1 overflow-auto p-6">
             <Outlet />
           </main>
         </div>
       </div>
     </SidebarProvider>
   );
 }