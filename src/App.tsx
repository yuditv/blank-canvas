import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { NewOrderPage } from "@/pages/NewOrder";
import { OrdersPage } from "@/pages/Orders";
import { WalletPage } from "@/pages/Wallet";
import { FaqPage } from "@/pages/Faq";
import { LoginPage } from "@/pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppShell brandName="SamyLuxo" currency="BRL" />}>
            <Route path="/" element={<NewOrderPage />} />
            <Route path="/pedidos" element={<OrdersPage />} />
            <Route path="/saldo" element={<WalletPage />} />
            <Route path="/ajuda" element={<FaqPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
