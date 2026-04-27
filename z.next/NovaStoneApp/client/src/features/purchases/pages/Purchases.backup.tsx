import React from "react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { motion } from "motion/react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Receipt, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreHorizontal,
  ArrowUpDown,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Printer,
  MapPin,
  Phone,
  Mail,
  Tag,
  History,
  Check,
  Bell,
  Send,
  Calendar,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Purchase {
  id: string;
  vendor: string;
  vendorAddress?: string;
  vendorPhone?: string;
  vendorEmail?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  category: string;
  reference: string;
  paymentTerms?: string;
  lineItems?: LineItem[];
  reminderSchedule?: "none" | "daily" | "weekly" | "once_on_due";
  customReminderMessage?: string;
}

const mockPurchases: Purchase[] = [
  {
    id: "PUR-001",
    vendor: "Cloudflare Inc.",
    date: "2026-06-15",
    dueDate: "2026-06-30",
    amount: 250.00,
    status: "paid",
    category: "Software",
    reference: "INV-8821",
    vendorAddress: "101 Townsend St, San Francisco, CA 94107",
    vendorPhone: "+1 (888) 992-5683",
    vendorEmail: "billing@cloudflare.com",
    lineItems: [
      { id: "LI-1", description: "Pro Plan Subscription - Annual", quantity: 1, unitPrice: 200.00 },
      { id: "LI-2", description: "Argo Smart Routing", quantity: 1, unitPrice: 50.00 }
    ]
  },
  {
    id: "PUR-002",
    vendor: "WeWork Global",
    date: "2026-06-18",
    dueDate: "2026-07-01",
    amount: 1200.00,
    status: "unpaid",
    category: "Rent",
    reference: "WW-JUN-26",
    vendorAddress: "115 Broadway, New York, NY 10006",
    vendorPhone: "+1 (646) 389-3922",
    vendorEmail: "support@wework.com",
    lineItems: [
      { id: "LI-3", description: "Dedicated Desk - June", quantity: 2, unitPrice: 600.00 }
    ]
  },
  {
    id: "PUR-003",
    vendor: "Stripe Terminal",
    date: "2026-06-10",
    dueDate: "2026-06-24",
    amount: 450.00,
    status: "paid",
    category: "Hardware",
    reference: "ST-092",
    lineItems: [
      { id: "LI-4", description: "Stripe Reader S700", quantity: 1, unitPrice: 350.00 },
      { id: "LI-5", description: "Charging Dock", quantity: 2, unitPrice: 50.00 }
    ]
  },
  {
    id: "PUR-004",
    vendor: "Google Workspace",
    date: "2026-06-01",
    dueDate: "2026-06-15",
    amount: 84.50,
    status: "paid",
    category: "Software",
    reference: "GWS-2026-06",
    lineItems: [
      { id: "LI-6", description: "Business Standard License", quantity: 5, unitPrice: 12.00 },
      { id: "LI-7", description: "Additional Storage (1TB)", quantity: 1, unitPrice: 24.50 }
    ]
  },
  {
    id: "PUR-005",
    vendor: "Amazon Web Services",
    date: "2026-05-30",
    dueDate: "2026-06-12",
    amount: 3450.20,
    status: "paid",
    category: "Software",
    reference: "AWS-9921",
    lineItems: [
      { id: "LI-8", description: "EC2 Reserved Instances", quantity: 4, unitPrice: 800.00 },
      { id: "LI-9", description: "S3 Storage - Standard", quantity: 1, unitPrice: 250.20 }
    ]
  },
  {
    id: "PUR-006",
    vendor: "Logistics Pro",
    date: "2026-05-15",
    dueDate: "2026-05-29",
    amount: 500.00,
    status: "overdue",
    category: "Shipping",
    reference: "LP-001",
    lineItems: [
      { id: "LI-10", description: "International Freight", quantity: 1, unitPrice: 500.00 }
    ]
  },
];

export function PurchasesPage() {
  const [purchases, setPurchases] = React.useState<Purchase[]>(mockPurchases);
  const [categories, setCategories] = React.useState<string[]>(["Software", "Hardware", "Rent", "Shipping", "Office Supplies", "Marketing", "Consulting", "Utilities"]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPurchase, setEditingPurchase] = React.useState<Purchase | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = React.useState(false);
  const [reminderTarget, setReminderTarget] = React.useState<Purchase | null>(null);

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleRow = (id: string) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPurchases.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPurchases.map(p => p.id));
    }
  };

  const handleBulkMarkAsPaid = () => {
    setPurchases(prev => prev.map(p => 
      selectedIds.includes(p.id) ? { ...p, status: "paid" as const } : p
    ));
    toast.success(`Marked ${selectedIds.length} purchases as paid`);
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const selectedPurchases = purchases.filter(p => selectedIds.includes(p.id));
    const csvContent = [
      ["ID", "Vendor", "PO #", "Date", "Due Date", "Amount", "Status", "Category", "Address", "Phone", "Email", "Terms"],
      ...selectedPurchases.map(p => [
        p.id, p.vendor, p.reference, p.date, p.dueDate, p.amount, p.status, p.category,
        `"${p.vendorAddress || ''}"`, p.vendorPhone || '', p.vendorEmail || '', p.paymentTerms || ''
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bulk-purchases-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedIds.length} items`);
  };

  const totals = {
    total: purchases.reduce((acc, curr) => acc + curr.amount, 0),
    unpaid: purchases.filter(p => p.status === "unpaid").reduce((acc, curr) => acc + curr.amount, 0),
    overdue: purchases.filter(p => p.status === "overdue").reduce((acc, curr) => acc + curr.amount, 0),
  };

  const handleAddPurchase = (newPurchase: Omit<Purchase, "id">) => {
    if (editingPurchase) {
      setPurchases(prev => prev.map(p => p.id === editingPurchase.id ? { ...newPurchase, id: editingPurchase.id } as Purchase : p));
      toast.success("Purchase updated successfully");
    } else {
      const id = `PUR-${String(purchases.length + 1).padStart(3, '0')}`;
      setPurchases(prev => [{ ...newPurchase, id }, ...prev]);
      toast.success("Purchase recorded successfully");
    }
    setIsModalOpen(false);
    setEditingPurchase(null);
  };

  const handleEditClick = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleDeletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
    toast.success("Purchase record removed");
  };

  const handleUpdateCategories = (newCategories: string[]) => {
    setCategories(newCategories);
  };

  const handleSaveReminder = (id: string, schedule: Purchase["reminderSchedule"], message: string) => {
    setPurchases(prev => prev.map(p => 
      p.id === id ? { ...p, reminderSchedule: schedule, customReminderMessage: message } : p
    ));
    toast.success("Reminder configuration saved");
    setIsReminderModalOpen(false);
    setReminderTarget(null);
  };

  const handleExport = () => {
    if (filteredPurchases.length === 0) {
      toast.error("No data to export.");
      return;
    }

    const filename = `novastone-purchases-${new Date().toISOString().split('T')[0]}.csv`;
    
    try {
      const csvContent = [
        ["ID", "Vendor", "Address", "Phone", "Email", "PO #", "Date", "Due Date", "Category", "Amount", "Status"].join(","),
        ...filteredPurchases.map(p => [
          p.id,
          `"${p.vendor}"`,
          `"${p.vendorAddress || ''}"`,
          `"${p.vendorPhone || ''}"`,
          `"${p.vendorEmail || ''}"`,
          `"${p.reference}"`,
          p.date,
          p.dueDate,
          `"${p.category}"`,
          p.amount,
          p.status
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Purchases data exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export purchase data.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8 bg-[#fcfcfc] min-h-screen relative"
    >
      {isModalOpen && (
        <PurchaseModal 
          onClose={() => {
            setIsModalOpen(false);
            setEditingPurchase(null);
          }} 
          onSubmit={handleAddPurchase} 
          categories={categories}
          initialData={editingPurchase || undefined}
        />
      )}

      {isCategoryModalOpen && (
        <ManageCategoriesModal
          categories={categories}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={handleUpdateCategories}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Purchases</h2>
          <p className="text-gray-500 mt-1">Manage your bills, expenses and vendor payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            <Tag size={16} />
            Categories
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            <Printer size={16} />
            Print PDF
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm shadow-primary/20"
          >
            <Plus size={16} />
            New Purchase
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PurchaseKPICard 
          title="Total Outstanding" 
          amount={totals.unpaid + totals.overdue} 
          subtitle={`${purchases.filter(p => p.status !== "paid").length} active bills`}
          icon={Receipt}
          color="blue"
        />
        <PurchaseKPICard 
          title="Unpaid Bills" 
          amount={totals.unpaid} 
          subtitle="Awaiting payment date"
          icon={Clock}
          color="yellow"
        />
        <PurchaseKPICard 
          title="Overdue" 
          amount={totals.overdue} 
          subtitle="Requires immediate action"
          icon={AlertCircle}
          color="red"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search vendor or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden p-1 bg-gray-50/50">
              <button 
                onClick={() => setFilterStatus("all")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all",
                  filterStatus === "all" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                All
              </button>
              <button 
                onClick={() => setFilterStatus("unpaid")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all",
                  filterStatus === "unpaid" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Unpaid
              </button>
              <button 
                onClick={() => setFilterStatus("overdue")}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-all",
                  filterStatus === "overdue" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Overdue
              </button>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-9 pr-8 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer hover:bg-white min-w-[140px]"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                <th className="py-4 px-6 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={toggleSelectAll}
                    className={cn(
                      "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center mx-auto",
                      selectedIds.length === filteredPurchases.length && filteredPurchases.length > 0
                        ? "bg-primary border-primary text-white" 
                        : "border-gray-400 hover:border-primary bg-white shadow-sm"
                    )}
                  >
                    {selectedIds.length === filteredPurchases.length && filteredPurchases.length > 0 && <Check size={12} strokeWidth={4} />}
                    {selectedIds.length > 0 && selectedIds.length < filteredPurchases.length && (
                      <div className="w-2.5 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-6 w-8"></th>
                <th className="py-4 px-6">Vendor</th>
                <th className="py-4 px-6">PO #</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <React.Fragment key={purchase.id}>
                    <tr 
                      onClick={() => toggleRow(purchase.id)}
                      className={cn(
                        "hover:bg-gray-50/50 transition-colors group cursor-pointer",
                        expandedRow === purchase.id && "bg-gray-50/80",
                        selectedIds.includes(purchase.id) && "bg-primary/5"
                      )}
                    >
                      <td className="py-4 px-6 text-center w-12" onClick={(e) => toggleSelect(e, purchase.id)}>
                        <div className={cn(
                          "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center mx-auto",
                          selectedIds.includes(purchase.id) 
                            ? "bg-primary border-primary text-white shadow-sm shadow-primary/20" 
                            : "border-gray-400 group-hover:border-primary bg-white"
                        )}>
                          {selectedIds.includes(purchase.id) && <Check size={12} strokeWidth={4} />}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center w-8">
                        <motion.div
                          animate={{ rotate: expandedRow === purchase.id ? 90 : 0 }}
                          className="text-gray-300"
                        >
                          <ChevronRight size={16} />
                        </motion.div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{purchase.vendor}</span>
                          <span className="text-xs text-gray-400">{purchase.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-600 font-mono tracking-tighter uppercase">{purchase.reference}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">{purchase.date}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">{purchase.dueDate}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md w-fit">
                          <Tag size={10} className="text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{purchase.category}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-gray-900 tracking-tight">{formatCurrency(purchase.amount)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={purchase.status} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => handleEditClick(purchase)}
                            className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <ExternalLink size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              if(confirm("Are you sure you want to delete this record?")) {
                                handleDeletePurchase(purchase.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                            title="Delete"
                          >
                            <Plus className="rotate-45" size={14} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === purchase.id && (
                      <tr className="bg-gray-50/20">
                        <td colSpan={10} className="px-6 py-6 font-sans">
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden"
                          >
                            <div className="grid grid-cols-12">
                              {/* Left Column: Vendor Info & Header */}
                              <div className="col-span-12 lg:col-span-4 bg-gray-50/50 p-6 border-r border-gray-100">
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Vendor Intelligence</h4>
                                    <div className="space-y-4">
                                      <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                                          <ShoppingBag size={14} />
                                        </div>
                                        <div>
                                          <p className="text-sm font-bold text-gray-900">{purchase.vendor}</p>
                                          <p className="text-[10px] text-gray-500 font-mono">{purchase.id}</p>
                                        </div>
                                      </div>

                                      {purchase.vendorAddress && (
                                        <div className="flex items-start gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                                            <MapPin size={14} />
                                          </div>
                                          <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Mailing Address</p>
                                            <p className="text-xs text-gray-600 leading-relaxed font-medium">{purchase.vendorAddress}</p>
                                          </div>
                                        </div>
                                      )}

                                      {(purchase.vendorPhone || purchase.vendorEmail) && (
                                        <div className="pt-4 mt-4 border-t border-gray-200/60 flex flex-col gap-4">
                                          {purchase.vendorPhone && (
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                                                <Phone size={14} />
                                              </div>
                                              <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Direct Phone</p>
                                                <p className="text-xs text-gray-700 font-bold">{purchase.vendorPhone}</p>
                                              </div>
                                            </div>
                                          )}
                                          {purchase.vendorEmail && (
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                                                <Mail size={14} />
                                              </div>
                                              <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Corporate Email</p>
                                                <p className="text-xs text-primary font-bold truncate">{purchase.vendorEmail}</p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="pt-6 border-t border-gray-200/60">
                                    <div className="flex justify-between items-center mb-3">
                                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Audit Timeline</h4>
                                      {purchase.paymentTerms && (
                                        <div className="px-2 py-0.5 bg-primary/10 rounded text-[9px] font-black text-primary uppercase tracking-tighter">
                                          {purchase.paymentTerms}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-6">
                                      <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Dispatched</p>
                                        <p className="text-xs text-gray-700 font-semibold">{purchase.date}</p>
                                      </div>
                                      <div className="w-10 h-[1px] bg-gray-200"></div>
                                      <div>
                                        <p className="text-[9px] font-bold text-rose-400 uppercase mb-0.5">Maturity</p>
                                        <p className="text-xs text-rose-600 font-black">{purchase.dueDate}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-6 border-t border-gray-200/60">
                                    <div className="flex justify-between items-center mb-3">
                                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Reminders</h4>
                                      {purchase.status !== "paid" && purchase.vendorEmail && (
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setReminderTarget(purchase);
                                            setIsReminderModalOpen(true);
                                          }}
                                          className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-tighter hover:bg-primary/5 px-2 py-0.5 rounded transition-all"
                                        >
                                          <Bell size={10} />
                                          Configure
                                        </button>
                                      )}
                                    </div>
                                    
                                    {purchase.status === "paid" ? (
                                      <div className="flex items-center gap-2 text-emerald-500">
                                        <CheckCircle2 size={12} />
                                        <p className="text-[10px] font-bold uppercase tracking-tight">Bill Settled • No Reminders</p>
                                      </div>
                                    ) : !purchase.vendorEmail ? (
                                      <div className="flex items-center gap-2 text-rose-400">
                                        <AlertCircle size={12} />
                                        <p className="text-[10px] font-bold uppercase tracking-tight">No Vendor Email Found</p>
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-gray-400" />
                                            <p className="text-[10px] font-medium text-gray-600">
                                              Schedule: <span className="font-bold text-gray-900 uppercase tracking-tighter">{purchase.reminderSchedule || "none"}</span>
                                            </p>
                                          </div>
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toast.success(`Reminder sent to ${purchase.vendorEmail}`);
                                            }}
                                            className="bg-primary text-white p-1.5 rounded-lg hover:bg-opacity-90 shadow-md shadow-primary/20 transition-all"
                                            title="Send Manual Reminder Now"
                                          >
                                            <Send size={12} />
                                          </button>
                                        </div>
                                        {purchase.customReminderMessage && (
                                          <div className="bg-white border border-gray-100 p-2 rounded-lg">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                              <MessageSquare size={10} />
                                              Custom Message
                                            </p>
                                            <p className="text-[10px] text-gray-600 line-clamp-2">{purchase.customReminderMessage}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div className="pt-6 border-t border-gray-200/60">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Vendor History</h4>
                                    <div className="space-y-3">
                                      {purchases
                                        .filter(p => p.vendor === purchase.vendor && p.id !== purchase.id)
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .slice(0, 3)
                                        .map(historyItem => (
                                          <div key={historyItem.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                            <div>
                                              <p className="text-[10px] font-bold text-gray-900">{historyItem.date}</p>
                                              <p className="text-[9px] text-gray-400 font-mono tracking-tighter">{historyItem.reference}</p>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-[10px] font-black text-gray-900">{formatCurrency(historyItem.amount)}</p>
                                              <div className={cn(
                                                "text-[8px] font-black uppercase tracking-tighter",
                                                historyItem.status === "paid" ? "text-emerald-500" : 
                                                historyItem.status === "overdue" ? "text-rose-500" : "text-amber-500"
                                              )}>
                                                {historyItem.status}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      {purchases.filter(p => p.vendor === purchase.vendor && p.id !== purchase.id).length === 0 && (
                                        <div className="flex flex-col items-center py-4 bg-white/50 rounded-lg border border-dashed border-gray-200">
                                          <History size={16} className="text-gray-200 mb-1" />
                                          <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">No Prior Records</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: Line Items & Totals */}
                              <div className="col-span-12 lg:col-span-8 p-0 flex flex-col">
                                <div className="p-6 border-b border-gray-100 bg-white">
                                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Itemized Procurement</h4>
                                  <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                    <table className="w-full text-left">
                                      <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] uppercase font-black text-gray-400 tracking-[0.15em]">
                                          <th className="py-3 px-4">Article Description</th>
                                          <th className="py-3 px-4 text-center">Qty</th>
                                          <th className="py-3 px-4 text-right">Rate</th>
                                          <th className="py-3 px-4 text-right">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-50/80">
                                        {purchase.lineItems?.map(item => (
                                          <tr key={item.id} className="text-sm hover:bg-gray-50/30 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-gray-700">{item.description}</td>
                                            <td className="py-3 px-4 text-center font-mono text-gray-500">{item.quantity}</td>
                                            <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(item.unitPrice)}</td>
                                            <td className="py-3 px-4 text-right font-black text-gray-900 group-hover:text-primary">
                                              {formatCurrency(item.quantity * item.unitPrice)}
                                            </td>
                                          </tr>
                                        ))}
                                        {(!purchase.lineItems || purchase.lineItems.length === 0) && (
                                          <tr>
                                            <td colSpan={4} className="py-12 text-center">
                                              <div className="flex flex-col items-center gap-2">
                                                <Receipt size={24} className="text-gray-200" />
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Line Item Record</p>
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div className="flex-1 bg-gray-50/30 p-6 flex flex-col justify-end">
                                  <div className="flex justify-end">
                                    <div className="w-full max-w-[280px] space-y-2.5">
                                      <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                                        <span>Sum of Items:</span>
                                        <span className="tabular-nums">{formatCurrency(purchase.amount)}</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                                        <span>Est. Tax (0%):</span>
                                        <span className="tabular-nums">$0.00</span>
                                      </div>
                                      <div className="pt-2.5 border-t-2 border-gray-900 flex justify-between items-center">
                                        <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Grand Total</span>
                                        <span className="text-xl font-black text-primary tracking-tighter tabular-nums">
                                          {formatCurrency(purchase.amount)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <ShoppingBag size={40} className="text-gray-200 mb-4" />
                      <p className="text-gray-400 font-medium tracking-tight">No purchases found matching your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <p>Showing {filteredPurchases.length} of {purchases.length} results</p>
          <div className="flex gap-2">
             <button disabled className="px-3 py-1 border border-gray-100 rounded opacity-50 cursor-not-allowed">Previous</button>
             <button disabled className="px-3 py-1 border border-gray-100 rounded opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-950 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-md"
        >
          <div className="flex items-center gap-3 pr-8 border-r border-white/10">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black">
              {selectedIds.length}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Items Selected</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleBulkMarkAsPaid}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <CheckCircle2 size={14} />
              Mark as Paid
            </button>
            <button 
              onClick={handleBulkExport}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <Download size={14} />
              Export Selected
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="text-xs font-bold text-gray-500 hover:text-white transition-colors ml-4"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {isReminderModalOpen && reminderTarget && (
        <ReminderModal 
          purchase={reminderTarget}
          onClose={() => {
            setIsReminderModalOpen(false);
            setReminderTarget(null);
          }}
          onSave={handleSaveReminder}
        />
      )}
    </motion.div>
  );
}

function ReminderModal({ purchase, onClose, onSave }: { 
  purchase: Purchase; 
  onClose: () => void; 
  onSave: (id: string, schedule: Purchase["reminderSchedule"], message: string) => void;
}) {
  const [schedule, setSchedule] = React.useState<Purchase["reminderSchedule"]>(purchase.reminderSchedule || "none");
  const [message, setMessage] = React.useState(purchase.customReminderMessage || `Hi ${purchase.vendor}, this is a reminder regarding our unpaid PO #${purchase.reference}. Please let us know the status. Thanks!`);

  const schedules: { id: Purchase["reminderSchedule"]; label: string; desc: string }[] = [
    { id: "none", label: "No Reminders", desc: "No automated triggers" },
    { id: "once_on_due", label: "On Due Date", desc: "Send exactly when valid" },
    { id: "daily", label: "Daily Alert", desc: "Continuous reconciliation" },
    { id: "weekly", label: "Weekly Digest", desc: "Steady follow-up cadence" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-gray-50 border-b border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Configure Reminders</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{purchase.vendor} • {purchase.reference}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto font-sans">
          {/* Schedule Selection */}
          <section>
            <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary/20"></span>
              Frequency Schedule
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {schedules.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSchedule(s.id)}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all text-left group",
                    schedule === s.id 
                      ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                      : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      schedule === s.id ? "text-primary" : "text-gray-400"
                    )}>
                      {s.label}
                    </span>
                    {schedule === s.id && <Check size={14} className="text-primary" />}
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Email Content */}
          <section>
            <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary/20"></span>
              Custom Email Content
            </h4>
            <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <Mail size={12} className="text-gray-400" />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Recipient: <span className="text-primary font-mono">{purchase.vendorEmail}</span></p>
              </div>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your custom reminder message here..."
                className="w-full h-32 bg-transparent text-sm text-gray-700 leading-relaxed outline-none resize-none placeholder:text-gray-300"
              />
              <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400 font-medium italic">
                <MessageSquare size={10} />
                <span>Standard professional footer will be appended automatically.</span>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <button 
            type="button"
            onClick={() => onSave(purchase.id, schedule, message)}
            className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-opacity-90 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <Send size={14} />
            Save & Activate
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-4 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-gray-600 transition-all"
          >
            Discard
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function PurchaseKPICard({ title, amount, subtitle, icon: Icon, color }: { 
  title: string; 
  amount: number; 
  subtitle: string; 
  icon: any; 
  color: "blue" | "yellow" | "red" 
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    yellow: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
      <div className={cn("p-3 rounded-lg border", colorMap[color])}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
        <p className="text-2xl font-black text-gray-900 tracking-tighter mt-1">{formatCurrency(amount)}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-tight">{subtitle}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "paid" | "unpaid" | "overdue" }) {
  const styles = {
    paid: "bg-green-50 text-green-600 border-green-100",
    unpaid: "bg-amber-50 text-amber-600 border-amber-100",
    overdue: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const icons = {
    paid: <CheckCircle2 size={12} />,
    unpaid: <Clock size={12} />,
    overdue: <AlertCircle size={12} />,
  };

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight w-fit",
      styles[status]
    )}>
      {icons[status]}
      {status}
    </div>
  );
}

function ManageCategoriesModal({ categories, onClose, onSave }: { 
  categories: string[]; 
  onClose: () => void; 
  onSave: (cats: string[]) => void;
}) {
  const [localCats, setLocalCats] = React.useState([...categories]);
  const [newCat, setNewCat] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editValue, setEditValue] = React.useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    if (localCats.includes(newCat.trim())) {
      toast.error("Category already exists");
      return;
    }
    setLocalCats([...localCats, newCat.trim()]);
    setNewCat("");
  };

  const handleDelete = (index: number) => {
    setLocalCats(localCats.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(localCats[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (!editValue.trim()) return;
    const updated = [...localCats];
    updated[index] = editValue.trim();
    setLocalCats(updated);
    setEditingIndex(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Purchase Categories</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Classification Taxonomy</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Plus className="rotate-45 text-gray-500" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Add new category..."
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90"
            >
              Add
            </button>
          </form>

          <div className="space-y-2">
            {localCats.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                {editingIndex === index ? (
                  <input 
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSaveEdit(index)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                    className="flex-1 bg-white border border-primary px-2 py-1 rounded text-sm focus:outline-none"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-700">{cat}</span>
                )}
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEditing(index)}
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                  >
                    <ExternalLink size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(index)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    <Plus className="rotate-45" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
          <button 
            onClick={() => {
              onSave(localCats);
              onClose();
              toast.success("Taxonomy updated");
            }}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 shadow-lg shadow-primary/10"
          >
            Apply Changes
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-3 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function PurchaseModal({ onClose, onSubmit, categories, initialData }: { 
  onClose: () => void; 
  onSubmit: (data: Omit<Purchase, "id">) => void;
  categories: string[];
  initialData?: Purchase;
}) {
  const [formData, setFormData] = React.useState({
    vendor: initialData?.vendor || "",
    vendorAddress: initialData?.vendorAddress || "",
    vendorPhone: initialData?.vendorPhone || "",
    vendorEmail: initialData?.vendorEmail || "",
    paymentTerms: initialData?.paymentTerms || "Net 30",
    date: initialData?.date || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate || "",
    amount: initialData?.amount.toString() || "",
    status: initialData?.status || "unpaid" as const,
    category: initialData?.category || categories[0] || "General",
    reference: initialData?.reference || "",
    lineItems: initialData?.lineItems || [] as LineItem[],
  });

  const [newLineItem, setNewLineItem] = React.useState({
    description: "",
    quantity: 1,
    unitPrice: 0,
  });

  const handleAddLineItem = () => {
    if (!newLineItem.description) return;
    const item: LineItem = {
      ...newLineItem,
      id: `LI-${Date.now()}`,
    };
    const updatedItems = [...formData.lineItems, item];
    const totalAmount = updatedItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    
    setFormData(prev => ({
      ...prev,
      lineItems: updatedItems,
      amount: totalAmount > 0 ? totalAmount.toFixed(2) : prev.amount
    }));
    setNewLineItem({ description: "", quantity: 1, unitPrice: 0 });
  };

  const removeLineItem = (id: string) => {
    const updatedItems = formData.lineItems.filter(item => item.id !== id);
    const totalAmount = updatedItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    setFormData(prev => ({
      ...prev,
      lineItems: updatedItems,
      amount: totalAmount > 0 ? totalAmount.toFixed(2) : prev.amount
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendor || !formData.amount) {
      toast.error("Please fill in required fields");
      return;
    }
    
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate || formData.date,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {initialData ? "Edit Purchase Bill" : "New Purchase Bill"}
            </h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Acquisition Entry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <Plus className="rotate-45 text-gray-500" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          <section className="space-y-4">
            <h4 className="text-xs font-black uppercase text-primary tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary/20"></span>
              Header Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Vendor Name *</label>
                <input 
                  autoFocus
                  required
                  type="text"
                  placeholder="e.g. Amazon Web Services"
                  value={formData.vendor}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Vendor Address</label>
                <input 
                  type="text"
                  placeholder="Street, City, State, ZIP"
                  value={formData.vendorAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendorAddress: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Vendor Phone</label>
                <input 
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.vendorPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendorPhone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Vendor Email</label>
                <input 
                  type="email"
                  placeholder="billing@vendor.com"
                  value={formData.vendorEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendorEmail: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Payment Terms</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["Net 30", "Net 60", "Due on Receipt", "Immediate"].map(term => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentTerms: term }))}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                        formData.paymentTerms === term 
                          ? "bg-primary text-white border-primary" 
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <input 
                  type="text"
                  placeholder="Custom terms..."
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Issue Date</label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Due Date</label>
                <input 
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Total Amount ($) *</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Purchase Order #</label>
                <input 
                  type="text"
                  placeholder="e.g. PO-2026-001"
                  value={formData.reference}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary/10 outline-none transition-all uppercase"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-black uppercase text-primary tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary/20"></span>
              Line Items
            </h4>
            
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
               <div className="grid grid-cols-12 gap-2">
                 <div className="col-span-6">
                    <input 
                      type="text" 
                      placeholder="Item Description"
                      value={newLineItem.description}
                      onChange={(e) => setNewLineItem(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary/30"
                    />
                 </div>
                 <div className="col-span-2">
                    <input 
                      type="number" 
                      placeholder="Qty"
                      value={newLineItem.quantity}
                      onChange={(e) => setNewLineItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary/30"
                    />
                 </div>
                 <div className="col-span-3">
                    <input 
                      type="number" 
                      placeholder="Price"
                      step="0.01"
                      value={newLineItem.unitPrice}
                      onChange={(e) => setNewLineItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary/30"
                    />
                 </div>
                 <div className="col-span-1">
                    <button 
                      type="button"
                      onClick={handleAddLineItem}
                      className="w-full h-full bg-primary text-white rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-all font-bold"
                    >
                      <Plus size={14} />
                    </button>
                 </div>
               </div>

               {formData.lineItems.length > 0 && (
                 <div className="space-y-2 mt-4">
                   {formData.lineItems.map((item) => (
                     <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm group">
                       <div className="flex-1 min-w-0">
                         <p className="text-xs font-semibold text-gray-700 truncate">{item.description}</p>
                         <p className="text-[10px] text-gray-400">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
                       </div>
                       <div className="flex items-center gap-3">
                         <span className="text-xs font-bold text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</span>
                         <button 
                           type="button"
                           onClick={() => removeLineItem(item.id)}
                           className="p-1 text-gray-300 hover:text-rose-500 transition-colors"
                         >
                           <Plus className="rotate-45" size={14} />
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-black uppercase text-primary tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary/20"></span>
              Classification
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Expense Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-lg border transition-all text-left truncate",
                        formData.category === cat 
                          ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                          : "border-gray-100 text-gray-500 hover:border-gray-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Status</label>
                <div className="flex gap-2">
                  {(["paid", "unpaid"] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status }))}
                      className={cn(
                        "flex-1 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg border transition-all flex items-center justify-center gap-2",
                        formData.status === status 
                          ? (status === 'paid' ? "bg-green-500 border-green-500 text-white" : "bg-amber-500 border-amber-500 text-white")
                          : "border-gray-100 text-gray-400"
                      )}
                    >
                      {status === 'paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
          <button 
            onClick={handleSubmit}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Receipt size={18} />
            {initialData ? "Update Purchase Bill" : "Create Purchase Bill"}
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="w-full py-3 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-gray-600 transition-all"
          >
            Discard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
