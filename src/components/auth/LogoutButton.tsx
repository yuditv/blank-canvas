 import { Button } from "@/components/ui/button";
 import { supabase } from "@/integrations/supabase/client";
 import { useNavigate } from "react-router-dom";
 import { toast } from "sonner";
 import { LogOut } from "lucide-react";
 
 export function LogoutButton() {
   const navigate = useNavigate();
 
   const handleLogout = async () => {
     const { error } = await supabase.auth.signOut();
     if (error) {
       toast.error("Erro ao sair");
     } else {
       toast.success("Logout realizado");
       navigate("/login");
     }
   };
 
   return (
     <Button
       variant="ghost"
       size="sm"
       onClick={handleLogout}
       className="gap-2"
     >
       <LogOut className="h-4 w-4" />
       Sair
     </Button>
   );
 }