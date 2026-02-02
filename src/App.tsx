import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages for better performance
const NewOrderPage = lazy(() => import("@/pages/NewOrder").then(m => ({ default: m.NewOrderPage })));
const OrdersPage = lazy(() => import("@/pages/Orders").then(m => ({ default: m.OrdersPage })));
const WalletPage = lazy(() => import("@/pages/Wallet").then(m => ({ default: m.WalletPage })));
const FaqPage = lazy(() => import("@/pages/Faq").then(m => ({ default: m.FaqPage })));
const ResellerPanelPage = lazy(() => import("@/pages/ResellerPanel").then(m => ({ default: m.ResellerPanelPage })));
const TermsPage = lazy(() => import("@/pages/Terms").then(m => ({ default: m.TermsPage })));
const LoginPage = lazy(() => import("@/pages/Login").then(m => ({ default: m.LoginPage })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="space-y-4 w-full max-w-md px-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AppShell brandName="SamyLuxo" currency="BRL" />}>
              <Route path="/" element={<NewOrderPage />} />
              <Route path="/pedidos" element={<OrdersPage />} />
              <Route path="/saldo" element={<WalletPage />} />
              <Route path="/painel-revenda" element={<ResellerPanelPage />} />
              <Route path="/termos" element={<TermsPage />} />
              <Route path="/ajuda" element={<FaqPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
