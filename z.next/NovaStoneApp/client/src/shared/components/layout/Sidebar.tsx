import React from "react";
import { 
  LayoutDashboard, 
  Receipt, 
  ShoppingCart, 
  Landmark, 
  BarChart3, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  Users,
  UserCheck,
  TrendingUp,
  FilePlus,
  UserPlus,
  Package,
  CalendarClock,
  ArrowRight,
  ChevronDown,
  CreditCard,
  FileBarChart,
  ClipboardList
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useUIStore } from "@/shared/store/uiStore";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

export function Sidebar({ current, onNavigate, onLogout }: { current: string; onNavigate: (page: any) => void; onLogout?: () => void }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { t } = useTranslation();
  const [showCreateMenu, setShowCreateMenu] = React.useState(false);
  const [expandedItem, setExpandedItem] = React.useState<string | null>("sales");

  const navItems = [
    { name: t("dashboard"), icon: LayoutDashboard, id: "dashboard" },
    { 
      name: t("sales"), 
      icon: Receipt, 
      id: "sales-parent",
      children: [
        { name: "Summary", icon: TrendingUp, id: "sales" },
        { name: "Estimates", icon: FileText, id: "estimates" },
        { name: "Invoices", icon: Receipt, id: "invoices" },
        { name: "Payments setup", icon: CreditCard, id: "payments-setup" },
        { name: "Recurring invoice", icon: CalendarClock, id: "recurring-invoices" },
        { name: "Checkouts", icon: ShoppingCart, id: "checkouts" },
        { name: "Customer Statements", icon: FileBarChart, id: "customer-statements" },
        { name: "Customers", icon: Users, id: "customers" },
        { name: "Products & Services", icon: Package, id: "products-services" },
      ]
    },
    { name: t("purchases"), icon: ShoppingCart, id: "purchases" },
    { name: t("receipts"), icon: FileText, id: "receipts" },
    { name: t("accounting"), icon: BookOpen, id: "accounting" },
    { name: t("banking"), icon: Landmark, id: "banking" },
    { name: t("payroll"), icon: Users, id: "payroll" },
    { name: t("reports"), icon: BarChart3, id: "reports" },
    { name: t("advisors"), icon: UserCheck, id: "advisors" },
  ];

  const createActions = [
    { 
      title: "Money In", 
      items: [
        { name: "Transaction", icon: TrendingUp, id: "transactions" },
        { name: "Estimate", icon: FileText, id: "new-estimate" },
        { name: "Invoice", icon: Receipt, id: "new-invoice" },
        { name: "Recurring Invoice", icon: CalendarClock, id: "new-recurring" },
      ]
    },
    {
      title: "Money Out",
      items: [
        { name: "Bill", icon: FilePlus, id: "new-bill" },
      ]
    },
    {
      title: "Relationships",
      items: [
        { name: "Customer", icon: UserPlus, id: "new-customer" },
        { name: "Vendor", icon: UserPlus, id: "new-vendor" },
      ]
    },
    {
      title: "Inventory",
      items: [
        { name: "Product or Service", icon: Package, id: "new-product" },
      ]
    }
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full transition-all duration-300 z-50 flex flex-col py-6 shadow-2xl shadow-black/20",
        sidebarOpen ? "w-64" : "w-20",
        "bg-(--sidebar-bg) text-white/70"
      )}
    >
      <div className="px-6 mb-8 flex flex-col justify-between border-b border-white/5 pb-6">
        {sidebarOpen ? (
          <div onClick={() => onNavigate("dashboard")} className="cursor-pointer mb-6">
            <h1 className="text-xl font-bold tracking-tight text-white">NovaStone</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-medium">Business Accounting</p>
          </div>
        ) : (
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-white mb-6 mx-auto text-lg leading-none">N</div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform lg:flex hidden"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      <div className="px-4 mb-4 relative">
        <button 
          onClick={() => setShowCreateMenu(!showCreateMenu)}
          className={cn(
            "w-full bg-[#0077c5] text-white py-2.5 rounded hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20",
            !sidebarOpen && "px-0"
          )}
        >
          <Plus size={20} className={cn("transition-transform duration-300", showCreateMenu && "rotate-45")} />
          {sidebarOpen && <span className="text-sm font-semibold tracking-wide">Create New</span>}
        </button>

        <AnimatePresence>
          {showCreateMenu && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateMenu(false)}
                className="fixed inset-0 z-[-1] bg-black/5"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20, x: sidebarOpen ? 0 : 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: sidebarOpen ? 0 : 20 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className={cn(
                  "absolute z-[60] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-[280px] overflow-hidden",
                  sidebarOpen ? "top-full left-0 mt-2" : "top-0 left-full ml-4"
                )}
              >
                <div className="space-y-6">
                  {createActions.map((group) => (
                    <div key={group.title}>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-2 flex items-center gap-2">
                        {group.title}
                        <div className="flex-1 h-[1px] bg-gray-100"></div>
                      </h4>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              onNavigate(item.id);
                              setShowCreateMenu(false);
                            }}
                            className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                <item.icon size={16} />
                              </div>
                              <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">{item.name}</span>
                            </div>
                            <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <div key={item.id} className="space-y-0.5">
            <button
              onClick={() => {
                if (item.children) {
                  setExpandedItem(expandedItem === item.id ? null : item.id);
                } else {
                  onNavigate(item.id);
                }
              }}
              className={cn(
                "w-full flex items-center px-4 py-2.5 transition-all duration-150 rounded-md text-left group",
                (current === item.id || (item.children && item.children.some(child => child.id === current)))
                  ? "bg-(--sidebar-active) text-white" 
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={cn("mr-3 shrink-0", (current === item.id || (item.children && item.children.some(child => child.id === current))) ? "text-white" : "text-white/50 group-hover:text-white/80")} />
              {sidebarOpen && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.children && (
                    <ChevronDown 
                      size={14} 
                      className={cn(
                        "transition-transform duration-200",
                        expandedItem === item.id ? "rotate-180" : ""
                      )} 
                    />
                  )}
                </div>
              )}
            </button>

            {item.children && sidebarOpen && (
              <AnimatePresence initial={false}>
                {expandedItem === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-0.5 ml-4"
                  >
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => onNavigate(child.id)}
                        className={cn(
                          "w-full flex items-center px-4 py-2 transition-all duration-150 rounded-md text-left group",
                          current === child.id 
                            ? "text-white font-bold" 
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <child.icon size={14} className={cn("mr-3 shrink-0", current === child.id ? "text-white" : "text-white/30 group-hover:text-white/60")} />
                        <span className="text-xs">{child.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="p-4 border-t border-outline-variant">
          <div className="p-3 bg-surface-container/50 rounded-xl border border-outline-variant">
            <div className="label-system mb-2">Onboarding Progress</div>
            <div className="w-full bg-surface-container-high h-1 rounded-full mb-1">
              <div className="bg-primary h-1 rounded-full w-[85%]"></div>
            </div>
            <div className="text-[10px] text-on-surface-variant">85% Setup complete</div>
          </div>
        </div>
      )}
    </aside>
  );
}
