import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "@/src/i18n/config";
import { Sidebar, Header } from "@/shared";
import { Dashboard } from "@/features/dashboard/pages/Dashboard";
import { ReportsPage } from "@/features/reports/pages/Reports";
import { PurchasesPage } from "@/features/purchases/pages/Purchases";
import { SalesPage } from "@/features/sales/pages/Sales";
import { SalesDashboard } from "@/features/sales/pages/SalesDashboard";
import { TransactionsPage } from "@/features/transactions/pages/Transactions";
import { EstimatesPage } from "@/features/estimates/pages/Estimates";
import { InvoicesPage } from "@/features/invoices/pages/Invoices";
import { ProductsServicesPage } from "@/features/products/pages/ProductsServices";
import { CustomersPage } from "@/features/customers/pages/CustomersRefactored";
import { SettingsPage } from "@/features/settings/pages/Settings";
import { LoginPage, SignUpPage } from "@/features/auth/pages/Auth";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useUIStore } from "@/shared/store/uiStore";
import { cn } from "./lib/utils";

const queryClient = new QueryClient();

export default function App() {
  const { sidebarOpen, theme } = useUIStore();
  const { isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
  const [page, setPage] = React.useState<
    "dashboard" | "settings" | "sales" | "sales-dashboard" | "purchases" | "banking" | "reports" | "receipts" | "accounting" | "payroll" | "advisors" | "transactions" |
    "estimates" | "invoices" | "payments-setup" | "recurring-invoices" | "checkouts" | "customer-statements" | "customers" | "products-services"
  >("dashboard");
  const [authView, setAuthView] = React.useState<"login" | "signup">("login");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const toggleAuth = () => {
    setAuthView((prev) => (prev === "login" ? "signup" : "login"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="font-sans antialiased">
          {authView === "login" ? (
            <LoginPage onToggle={toggleAuth} />
          ) : (
            <SignUpPage onToggle={toggleAuth} />
          )}
          <Toaster position="top-right" richColors />
        </div>
      </QueryClientProvider>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard onNavigate={setPage} />;
      case "reports":
        return <ReportsPage />;
      case "purchases":
        return <PurchasesPage />;
      case "sales":
        return <SalesPage />;
      case "sales-dashboard":
        return <SalesDashboard />;
      case "estimates":
        return <EstimatesPage />;
      case "invoices":
        return <InvoicesPage />;
      case "products-services":
        return <ProductsServicesPage />;
      case "customers":
        return <CustomersPage />;
      case "transactions":
        return <TransactionsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 capitalize">{page}</h2>
            <div className="p-12 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
              <p className="text-lg">Module: {page.toUpperCase()}</p>
              <p className="text-sm">Implementation in progress...</p>
              <button
                onClick={() => setPage("dashboard")}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-surface-bright flex overflow-x-hidden font-sans antialiased">
        <Sidebar current={page} onNavigate={setPage} onLogout={logout} />
        <div
          className={cn(
            "flex-1 transition-all duration-300",
            sidebarOpen ? "ml-64" : "ml-20"
          )}
        >
          <Header onNavigate={() => setPage("settings")} />
          <main className="mt-16 max-w-[1440px] mx-auto min-h-[calc(100vh-4rem)]">
            {renderPage()}
          </main>
        </div>
      </div>
      <Toaster position="top-right" expand={true} richColors />
    </QueryClientProvider>
  );
}
