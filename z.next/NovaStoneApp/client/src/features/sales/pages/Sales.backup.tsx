import React from "react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
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
  MessageSquare,
  User
} from "lucide-react";
import { toast } from "sonner";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  customer: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
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

export const mockSales: Sale[] = [
  {
    id: "SLE-001",
    customer: "Acme Corp",
    date: "2026-06-20",
    dueDate: "2026-07-20",
    amount: 5400.00,
    status: "unpaid",
    category: "Services",
    reference: "INV-2026-001",
    customerAddress: "456 Enterprise Way, Suite 100, Austin, TX 78701",
    customerPhone: "+1 (512) 555-0123",
    customerEmail: "finance@acme.com",
    paymentTerms: "Net 30",
    lineItems: [
      { id: "LI-1", description: "Strategic Consulting - Q2", quantity: 1, unitPrice: 5000.00 },
      { id: "LI-2", description: "Expense Reimbursement", quantity: 1, unitPrice: 400.00 }
    ]
  },
  {
    id: "SLE-002",
    customer: "Global Tech Solutions",
    date: "2026-06-15",
    dueDate: "2026-06-15",
    amount: 1250.50,
    status: "paid",
    category: "Hardware",
    reference: "INV-2026-002",
    customerEmail: "billing@globaltech.io",
    lineItems: [
      { id: "LI-3", description: "NodeStone Server Rack", quantity: 1, unitPrice: 1250.50 }
    ]
  },
  {
    id: "SLE-003",
    customer: "Innovative Designs",
    date: "2026-05-10",
    dueDate: "2026-06-10",
    amount: 850.00,
    status: "overdue",
    category: "Design",
    reference: "INV-2026-003",
    customerEmail: "accounts@innovative.com",
    lineItems: [
      { id: "LI-4", description: "UI/UX Refresh - Mobile App", quantity: 1, unitPrice: 850.00 }
    ]
  }
];

export function SalesPage() {
  const [sales, setSales] = React.useState<Sale[]>(mockSales);
  const [categories, setCategories] = React.useState<string[]>(["Services", "Hardware", "Design", "Software License", "Subscription", "Consulting"]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterCategory, setFilterCategory] = React.useState<string>("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSale, setEditingSale] = React.useState<Sale | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = React.useState(false);
  const [reminderTarget, setReminderTarget] = React.useState<Sale | null>(null);

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    const matchesCategory = filterCategory === "all" || s.category === filterCategory;
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
    if (selectedIds.length === filteredSales.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSales.map(s => s.id));
    }
  };

  const handleBulkMarkAsPaid = () => {
    setSales(prev => prev.map(s => 
      selectedIds.includes(s.id) ? { ...s, status: "paid" as const } : s
    ));
    toast.success(`Marked ${selectedIds.length} sales as paid`);
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const selectedSales = sales.filter(s => selectedIds.includes(s.id));
    const csvContent = [
      ["ID", "Customer", "Invoice #", "Date", "Due Date", "Amount", "Status", "Category", "Address", "Phone", "Email", "Terms"],
      ...selectedSales.map(s => [
        s.id, s.customer, s.reference, s.date, s.dueDate, s.amount, s.status, s.category,
        `"${s.customerAddress || ''}"`, s.customerPhone || '', s.customerEmail || '', s.paymentTerms || ''
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bulk-sales-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedIds.length} items`);
  };

  const totals = {
    total: sales.reduce((acc, curr) => acc + curr.amount, 0),
    unpaid: sales.filter(s => s.status === "unpaid").reduce((acc, curr) => acc + curr.amount, 0),
    overdue: sales.filter(s => s.status === "overdue").reduce((acc, curr) => acc + curr.amount, 0),
  };

  const handleAddSale = (newSale: Omit<Sale, "id">) => {
    if (editingSale) {
      setSales(prev => prev.map(s => s.id === editingSale.id ? { ...newSale, id: editingSale.id } as Sale : s));
      toast.success("Invoice updated successfully");
    } else {
      const id = `SLE-${String(sales.length + 1).padStart(3, '0')}`;
      setSales(prev => [{ ...newSale, id }, ...prev]);
      toast.success("Invoice recorded successfully");
    }
    setIsModalOpen(false);
    setEditingSale(null);
  };

  const handleEditClick = (sale: Sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleDeleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
    toast.success("Invoice record removed");
  };

  const handleUpdateCategories = (newCategories: string[]) => {
    setCategories(newCategories);
  };

  const handleSaveReminder = (id: string, schedule: Sale["reminderSchedule"], message: string) => {
    setSales(prev => prev.map(s => 
      s.id === id ? { ...s, reminderSchedule: schedule, customReminderMessage: message } : s
    ));
    toast.success("Reminder configuration saved");
    setIsReminderModalOpen(false);
    setReminderTarget(null);
  };

  const handleExport = () => {
    if (filteredSales.length === 0) {
      toast.error("No data to export.");
      return;
    }
    const filename = `novastone-sales-${new Date().toISOString().split('T')[0]}.csv`;
    const csvContent = [
      ["ID", "Customer", "Address", "Phone", "Email", "Invoice #", "Date", "Due Date", "Category", "Amount", "Status"].join(","),
      ...filteredSales.map(s => [
        s.id, `"${s.customer}"`, `"${s.customerAddress || ''}"`, `"${s.customerPhone || ''}"`, `"${s.customerEmail || ''}"`,
        `"${s.reference}"`, s.date, s.dueDate, `"${s.category}"`, s.amount, s.status
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    toast.success("Sales data exported!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8 bg-[#fcfcfc] min-h-screen relative"
    >
      <AnimatePresence>
        {isModalOpen && (
          <SaleModal 
            onClose={() => {
              setIsModalOpen(false);
              setEditingSale(null);
            }} 
            onSubmit={handleAddSale} 
            categories={categories}
            initialData={editingSale || undefined}
          />
        )}
        {isCategoryModalOpen && (
          <ManageCategoriesModal
            categories={categories}
            onClose={() => setIsCategoryModalOpen(false)}
            onSave={handleUpdateCategories}
          />
        )}
        {isReminderModalOpen && reminderTarget && (
          <ReminderModal 
            sale={reminderTarget}
            onClose={() => {
              setIsReminderModalOpen(false);
              setReminderTarget(null);
            }}
            onSave={handleSaveReminder}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Sales</h2>
          <p className="text-gray-500 mt-1">Track your revenue, invoices, and customer payments.</p>
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
            New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SaleKPICard 
          title="Total Receivables" 
          amount={totals.unpaid + totals.overdue} 
          subtitle={`${sales.filter(s => s.status !== "paid").length} active invoices`}
          icon={Receipt}
          color="blue"
        />
        <SaleKPICard 
          title="Open Invoices" 
          amount={totals.unpaid} 
          subtitle="Waiting for payment"
          icon={Clock}
          color="yellow"
        />
        <SaleKPICard 
          title="Overdue Payments" 
          amount={totals.overdue} 
          subtitle="Follow-up required"
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
              placeholder="Search customer or invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden p-1 bg-gray-50/50">
              {["all", "unpaid", "overdue"].map((status) => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-md transition-all capitalize",
                    filterStatus === status ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-3 pr-8 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer hover:bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                <th className="py-4 px-6 w-12 text-center">
                  <button 
                    onClick={toggleSelectAll}
                    className={cn(
                      "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center mx-auto",
                      selectedIds.length === filteredSales.length && filteredSales.length > 0 ? "bg-primary border-primary text-white" : "border-gray-400 bg-white"
                    )}
                  >
                    {selectedIds.length === filteredSales.length && filteredSales.length > 0 && <Check size={12} strokeWidth={4} />}
                  </button>
                </th>
                <th className="py-4 px-6 w-8"></th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Invoice #</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSales.map((sale) => (
                <React.Fragment key={sale.id}>
                  <tr 
                    onClick={() => toggleRow(sale.id)}
                    className={cn(
                      "hover:bg-gray-50/50 transition-colors group cursor-pointer",
                      expandedRow === sale.id && "bg-gray-50/80",
                      selectedIds.includes(sale.id) && "bg-primary/5"
                    )}
                  >
                    <td className="py-4 px-6 text-center" onClick={(e) => toggleSelect(e, sale.id)}>
                      <div className={cn(
                        "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center mx-auto",
                        selectedIds.includes(sale.id) ? "bg-primary border-primary text-white" : "border-gray-400 bg-white"
                      )}>
                        {selectedIds.includes(sale.id) && <Check size={12} strokeWidth={4} />}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <motion.div animate={{ rotate: expandedRow === sale.id ? 90 : 0 }}>
                        <ChevronRight size={16} className="text-gray-300" />
                      </motion.div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{sale.customer}</span>
                        <span className="text-xs text-gray-400">{sale.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-gray-600 font-mono">{sale.reference}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{sale.date}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{sale.dueDate}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md w-fit">
                        <Tag size={10} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{sale.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(sale.amount)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={sale.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleEditClick(sale)} className="p-1.5 text-gray-400 hover:text-primary transition-colors"><ExternalLink size={14} /></button>
                        <button onClick={() => handleDeleteSale(sale.id)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"><Plus className="rotate-45" size={14} /></button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === sale.id && (
                    <tr className="bg-gray-50/20">
                      <td colSpan={10} className="p-6">
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-6 grid grid-cols-12 gap-8">
                          <div className="col-span-12 lg:col-span-4 space-y-6">
                            <div>
                               <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Customer Insights</h4>
                               <div className="space-y-4">
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><User size={14} /></div>
                                    <div><p className="text-sm font-bold text-gray-900">{sale.customer}</p><p className="text-[10px] text-gray-500 font-mono">{sale.id}</p></div>
                                  </div>
                                  {sale.customerAddress && (
                                    <div className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><MapPin size={14} /></div>
                                      <div><p className="text-[9px] font-black text-gray-400 uppercase mb-1">Billing Location</p><p className="text-xs text-gray-600 font-medium">{sale.customerAddress}</p></div>
                                    </div>
                                  )}
                                  <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                                    {sale.customerPhone && <div className="flex items-center gap-3"><Phone size={14} className="text-gray-400" /><span className="text-xs text-gray-700 font-bold">{sale.customerPhone}</span></div>}
                                    {sale.customerEmail && <div className="flex items-center gap-3"><Mail size={14} className="text-gray-400" /><span className="text-xs text-primary font-bold">{sale.customerEmail}</span></div>}
                                  </div>
                               </div>
                            </div>
                            <div className="pt-6 border-t border-gray-100">
                               <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Automated Reminders</h4>
                                  {sale.status !== "paid" && (
                                    <button onClick={() => {setReminderTarget(sale); setIsReminderModalOpen(true);}} className="text-[9px] font-black text-primary uppercase flex items-center gap-1"><Bell size={10} />Configure</button>
                                  )}
                               </div>
                               {sale.status === "paid" ? <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Invoice Fully Paid</p> :
                                !sale.customerEmail ? <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">No Customer Email Provided</p> :
                                (
                                  <div className="space-y-3">
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Calendar size={12} className="text-gray-400" /><span className="text-[10px] text-gray-600">Schedule: <span className="font-bold text-gray-900 uppercase">{sale.reminderSchedule || "none"}</span></span></div>
                                        <button onClick={() => toast.success(`Reminder sent to ${sale.customerEmail}`)} className="bg-primary text-white p-1.5 rounded-lg hover:bg-opacity-90 shadow-md"><Send size={12} /></button>
                                     </div>
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="col-span-12 lg:col-span-8 flex flex-col">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Invoice Items</h4>
                             <div className="rounded-xl border border-gray-100 overflow-hidden mb-6">
                                <table className="w-full text-left">
                                   <thead className="bg-gray-50 text-[9px] uppercase font-black text-gray-400">
                                      <tr><th className="py-3 px-4">Description</th><th className="py-3 px-4 text-center">Qty</th><th className="py-3 px-4 text-right">Price</th><th className="py-3 px-4 text-right">Total</th></tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-50">
                                      {sale.lineItems?.map(item => (
                                         <tr key={item.id} className="text-sm">
                                            <td className="py-3 px-4 font-semibold text-gray-700">{item.description}</td>
                                            <td className="py-3 px-4 text-center font-mono text-gray-500">{item.quantity}</td>
                                            <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(item.unitPrice)}</td>
                                            <td className="py-3 px-4 text-right font-black text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                         </tr>
                                      )) || <tr><td colSpan={4} className="py-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No Items Recorded</td></tr>}
                                   </tbody>
                                </table>
                             </div>
                             <div className="ml-auto w-full max-w-[240px] space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center text-xs text-gray-500"><span>Sum Subtotal:</span><span className="font-bold text-gray-700">{formatCurrency(sale.amount)}</span></div>
                                <div className="flex justify-between items-center bg-primary/5 p-3 rounded-xl"><span className="text-xs font-black text-primary uppercase tracking-widest">Total Due</span><span className="text-xl font-black text-primary tracking-tighter">{formatCurrency(sale.amount)}</span></div>
                             </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredSales.length === 0 && (
                <tr><td colSpan={10} className="py-20 text-center"><ShoppingBag size={40} className="text-gray-200 mx-auto mb-4" /><p className="text-gray-400 font-medium">No sales found matching your criteria</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-950 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-8 backdrop-blur-md">
          <div className="flex items-center gap-3 pr-8 border-r border-white/10"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black">{selectedIds.length}</div><span className="text-xs font-bold uppercase text-gray-400">Selected</span></div>
          <div className="flex items-center gap-4">
            <button onClick={handleBulkMarkAsPaid} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-500/20 transition-all"><CheckCircle2 size={14} />Mark Paid</button>
            <button onClick={handleBulkExport} className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all"><Download size={14} />Export</button>
            <button onClick={() => setSelectedIds([])} className="text-xs font-bold text-gray-500 hover:text-white transition-colors ml-4">Clear</button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function SaleKPICard({ title, amount, subtitle, icon: Icon, color }: { title: string; amount: number; subtitle: string; icon: any; color: "blue" | "yellow" | "red" }) {
  const colorMap = { blue: "bg-blue-50 text-blue-600 border-blue-100", yellow: "bg-amber-50 text-amber-600 border-amber-100", red: "bg-rose-50 text-rose-600 border-rose-100" };
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
      <div className={cn("p-3 rounded-lg border", colorMap[color])}><Icon size={20} /></div>
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
        <p className="text-2xl font-black text-gray-900 tracking-tighter mt-1">{formatCurrency(amount)}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase">{subtitle}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Sale["status"] }) {
  const styles = { paid: "bg-green-50 text-green-600 border-green-100", unpaid: "bg-amber-50 text-amber-600 border-amber-100", overdue: "bg-rose-50 text-rose-600 border-rose-100" };
  const icons = { paid: <CheckCircle2 size={12} />, unpaid: <Clock size={12} />, overdue: <AlertCircle size={12} /> };
  return <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight", styles[status])}>{icons[status]}{status}</div>;
}

function ReminderModal({ sale, onClose, onSave }: { sale: Sale; onClose: () => void; onSave: (id: string, schedule: Sale["reminderSchedule"], message: string) => void }) {
  const [schedule, setSchedule] = React.useState(sale.reminderSchedule || "none");
  const [message, setMessage] = React.useState(sale.customReminderMessage || `Hi ${sale.customer}, this is a reminder regarding our unpaid Invoice ${sale.reference}. Please let us know the status. Thanks!`);
  const schedules: { id: Sale["reminderSchedule"]; label: string; desc: string }[] = [
    { id: "none", label: "None", desc: "No reminders" },
    { id: "once_on_due", label: "Due Date", desc: "Send on due date" },
    { id: "daily", label: "Daily", desc: "Daily follow-ups" },
    { id: "weekly", label: "Weekly", desc: "Weekly reminders" },
  ];
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Bell size={20} /></div>
          <div><h3 className="text-lg font-black text-gray-900 tracking-tight">Invoice Reminders</h3><p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{sale.customer} • {sale.reference}</p></div>
        </div>
        <div className="p-6 space-y-6">
           <div>
              <h4 className="text-[10px] font-black uppercase text-primary tracking-widest mb-3">Schedule Frequency</h4>
              <div className="grid grid-cols-2 gap-2">
                {schedules.map(s => (
                  <button key={s.id} onClick={() => setSchedule(s.id)} className={cn("p-4 rounded-xl border-2 text-left transition-all", schedule === s.id ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200")}>
                    <p className="text-[10px] font-black uppercase text-gray-900 mb-1">{s.label}</p><p className="text-[9px] text-gray-500 font-medium tracking-tight">{s.desc}</p>
                  </button>
                ))}
              </div>
           </div>
           <div>
              <h4 className="text-[10px] font-black uppercase text-primary tracking-widest mb-3">Custom Message</h4>
              <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:ring-2 focus:ring-primary/10 outline-none" />
           </div>
        </div>
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
           <button onClick={() => onSave(sale.id, schedule, message)} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"><Send size={14} />Save Settings</button>
           <button onClick={onClose} className="px-6 py-4 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 rounded-2xl transition-all">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

function ManageCategoriesModal({ categories, onClose, onSave }: { categories: string[]; onClose: () => void; onSave: (cats: string[]) => void }) {
  const [localCats, setLocalCats] = React.useState([...categories]);
  const [newCat, setNewCat] = React.useState("");
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div><h3 className="text-lg font-bold text-gray-900">Revenue Categories</h3><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Classification Taxonomy</p></div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Plus className="rotate-45 text-gray-500" size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
           <div className="flex gap-2">
              <input type="text" placeholder="Add new category..." value={newCat} onChange={e => setNewCat(e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none" />
              <button onClick={() => {if(newCat) {setLocalCats([...localCats, newCat]); setNewCat("");}}} className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-widest">Add</button>
           </div>
           <div className="max-h-64 overflow-y-auto space-y-1">
              {localCats.map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  <span className="text-sm font-semibold text-gray-700">{cat}</span>
                  <button onClick={() => setLocalCats(localCats.filter((_, idx) => idx !== i))} className="p-1.5 text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Plus className="rotate-45" size={14} /></button>
                </div>
              ))}
           </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
           <button onClick={() => {onSave(localCats); onClose();}} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/10">Apply Changes</button>
           <button onClick={onClose} className="px-6 py-3 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 rounded-xl">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

function SaleModal({ onClose, onSubmit, categories, initialData }: { onClose: () => void; onSubmit: (data: Omit<Sale, "id">) => void; categories: string[]; initialData?: Sale }) {
  const [formData, setFormData] = React.useState({
    customer: initialData?.customer || "",
    customerAddress: initialData?.customerAddress || "",
    customerPhone: initialData?.customerPhone || "",
    customerEmail: initialData?.customerEmail || "",
    paymentTerms: initialData?.paymentTerms || "Net 30",
    date: initialData?.date || new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate || "",
    amount: initialData?.amount.toString() || "",
    status: initialData?.status || "unpaid" as const,
    category: initialData?.category || categories[0] || "General",
    reference: initialData?.reference || "",
    lineItems: initialData?.lineItems || [] as LineItem[],
  });
  const [nl, setNl] = React.useState({ description: "", quantity: 1, unitPrice: 0 });
  const addItem = () => { if(nl.description) { const items = [...formData.lineItems, {...nl, id: Date.now().toString()}]; setFormData({...formData, lineItems: items, amount: items.reduce((a,b) => a + (b.quantity*b.unitPrice), 0).toFixed(2)}); setNl({description: "", quantity: 1, unitPrice: 0}); } };
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div><h3 className="text-lg font-bold text-gray-900">{initialData ? "Update Invoice" : "Generate Invoice"}</h3><p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Revenue Registry</p></div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Plus className="rotate-45 text-gray-500" size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           <section className="space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-4 flex items-center gap-2"><span className="w-8 h-[1px] bg-primary/20"></span>Header Information</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Customer Name *</label><input required type="text" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
                 <div className="col-span-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Street Address</label><input type="text" value={formData.customerAddress} onChange={e => setFormData({...formData, customerAddress: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
                 <div className="col-span-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Email Address</label><input type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
                 <div className="col-span-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Reference #</label><input type="text" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
                 <div className="col-span-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Issue Date</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
                 <div className="col-span-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Grand Total ($)</label><input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold outline-none" /></div>
              </div>
           </section>
           <section className="space-y-4">
              <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-4 flex items-center gap-2"><span className="w-8 h-[1px] bg-primary/20"></span>Service Items</h4>
              <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                <div className="grid grid-cols-12 gap-2">
                   <input className="col-span-6 px-3 py-2 border border-gray-200 rounded-lg text-xs" placeholder="Item/Service" value={nl.description} onChange={e => setNl({...nl, description: e.target.value})} />
                   <input className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-xs" type="number" value={nl.quantity} onChange={e => setNl({...nl, quantity: parseInt(e.target.value)||0})} />
                   <input className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-xs" type="number" step="0.01" value={nl.unitPrice} onChange={e => setNl({...nl, unitPrice: parseFloat(e.target.value)||0})} />
                   <button type="button" onClick={addItem} className="col-span-1 bg-primary text-white rounded-lg flex items-center justify-center"><Plus size={14} /></button>
                </div>
                <div className="space-y-1">
                  {formData.lineItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm"><span className="text-xs font-semibold">{item.description}</span><span className="text-xs font-bold">{formatCurrency(item.quantity * item.unitPrice)}</span></div>
                  ))}
                </div>
              </div>
           </section>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
          <button onClick={() => onSubmit({...formData, amount: parseFloat(formData.amount), dueDate: formData.dueDate || formData.date})} className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2"><Receipt size={18} />{initialData ? "Save Changes" : "Post Invoice"}</button>
          <button onClick={onClose} className="w-full py-3 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Discard</button>
        </div>
      </motion.div>
    </div>
  );
}
