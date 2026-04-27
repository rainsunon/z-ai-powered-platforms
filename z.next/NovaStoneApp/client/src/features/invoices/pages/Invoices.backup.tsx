import React from "react";
import { 
  Plus, 
  Search, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  X, 
  CloudUpload, 
  Info, 
  Trash2, 
  HelpCircle,
  Eye,
  Save,
  UserPlus,
  Settings2,
  Trash,
  RotateCcw,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileText,
  Mail,
  Printer,
  FileDown,
  Copy
} from "lucide-react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  status: "Paid" | "Unpaid" | "Draft" | "Overdue";
  date: string;
  number: string;
  customer: string;
  total: number;
  amountDue: number;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

const mockInvoices: Invoice[] = [
  { id: "1", status: "Paid", date: "2025-07-24", number: "2025-07D", customer: "Insight Global", total: 4096.25, amountDue: 0 },
  { id: "2", status: "Paid", date: "2025-07-17", number: "2025-07V", customer: "Insight Global", total: 4096.25, amountDue: 0 },
  { id: "3", status: "Paid", date: "2025-07-10", number: "2025-07B", customer: "Insight Global", total: 3277.00, amountDue: 0 },
  { id: "4", status: "Paid", date: "2025-07-03", number: "2025-07A", customer: "Insight Global", total: 4096.25, amountDue: 0 },
  { id: "5", status: "Paid", date: "2025-06-26", number: "2025-06G", customer: "Insight Global", total: 4096.25, amountDue: 0 },
  { id: "6", status: "Paid", date: "2025-06-19", number: "2025-06F", customer: "Insight Global", total: 4096.25, amountDue: 0 },
  { id: "7", status: "Paid", date: "2025-06-18", number: "202506", customer: "Insight Global", total: 8192.50, amountDue: 0 },
  { id: "8", status: "Paid", date: "2025-05-30", number: "202505", customer: "Insight Global", total: 18842.75, amountDue: 0 },
  { id: "9", status: "Paid", date: "2025-04-30", number: "202504", customer: "Insight Global", total: 15565.75, amountDue: 0 },
];

export function InvoicesPage() {
  const [view, setView] = React.useState<"list" | "create">("list");
  const [activeTab, setActiveTab] = React.useState<"unpaid" | "draft" | "all">("unpaid");
  const [showActionMenu, setShowActionMenu] = React.useState<string | null>(null);

  // Form State
  const [formData, setFormData] = React.useState({
    invoiceNumber: "2025-06G1",
    poNumber: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    currency: "CAD ($)",
    discount: 0,
    lineItems: [] as LineItem[],
    notes: ""
  });

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      quantity: 1,
      price: 0
    };
    setFormData(prev => ({ ...prev, lineItems: [...prev.lineItems, newItem] }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({ ...prev, lineItems: prev.lineItems.filter(item => item.id !== id) }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const calculateSubtotal = () => {
    return formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal - formData.discount;

  const filteredInvoices = React.useMemo(() => {
    if (activeTab === "all") return mockInvoices;
    if (activeTab === "unpaid") return mockInvoices.filter((invoice) => invoice.status === "Unpaid");
    return mockInvoices.filter((invoice) => invoice.status === "Draft");
  }, [activeTab]);

  const renderCreateView = () => (
    <div className="bg-[#f2f5f7] min-h-screen p-8 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">New invoice</h2>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
              <Eye size={16} />
              Preview
            </button>
            <div className="flex">
              <button 
                onClick={() => { toast.success("Invoice created successfully"); setView("list"); }}
                className="px-6 py-2 bg-blue-600 text-white rounded-l-full text-sm font-bold hover:bg-blue-700 transition-all"
              >
                Save and continue
              </button>
              <button className="px-3 bg-blue-700 text-white rounded-r-full hover:bg-blue-800 transition-all border-l border-blue-500">
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <CollapsibleButton label="Business address and contact details, title, summary, and logo" />

          <div className="bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden">
            <div className="p-12 space-y-12">
              <div className="grid grid-cols-2 gap-20">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl p-12 bg-gray-50/50 group cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <UserPlus size={24} />
                  </div>
                  <span className="text-sm font-black text-blue-600 uppercase tracking-widest">Add a customer</span>
                </div>

                <div className="space-y-4">
                  <FormInput label="Invoice number" value={formData.invoiceNumber} onChange={(v) => setFormData(p => ({ ...p, invoiceNumber: v }))} />
                  <FormInput label="P.O./S.O. number" value={formData.poNumber} onChange={(v) => setFormData(p => ({ ...p, poNumber: v }))} />
                  <FormDate label="Invoice date" value={formData.date} onChange={(v) => setFormData(p => ({ ...p, date: v }))} />
                  <div className="space-y-1">
                    <FormDate label="Payment due" value={formData.dueDate} onChange={(v) => setFormData(p => ({ ...p, dueDate: v }))} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight text-right pr-4">On Receipt</p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50">
                    <Settings2 size={12} />
                    Edit columns
                  </button>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#edf2f7]">
                      <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <th className="py-4 px-6 w-1/2">Items</th>
                        <th className="py-4 px-6 text-right">Quantity</th>
                        <th className="py-4 px-6 text-right">Price</th>
                        <th className="py-4 px-6 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {formData.lineItems.map(item => (
                        <tr key={item.id}>
                          <td className="py-4 px-6 text-sm font-bold text-gray-800">{item.description || "—"}</td>
                          <td className="py-4 px-6 text-right text-sm font-bold text-gray-800">{item.quantity}</td>
                          <td className="py-4 px-6 text-right text-sm font-bold text-gray-800">{formatCurrency(item.price)}</td>
                          <td className="py-4 px-6 text-right text-sm font-black text-gray-900">{formatCurrency(item.quantity * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={addItem} className="w-full py-4 text-sm font-black text-blue-600 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-all border-t border-gray-50">
                    <Plus size={16} />
                    Add an item
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="flex flex-col items-end gap-4 px-6">
                <div className="w-[300px] space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Subtotal</span>
                    <span className="font-black text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <button className="w-full flex items-center justify-end gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">
                    <Plus size={12} />
                    Add a discount
                  </button>
                  <div className="flex justify-between items-center pt-2">
                    <select className="bg-gray-50 px-3 py-1 rounded text-[10px] font-black text-gray-500 border border-gray-200 outline-none">
                      <option>CAD ($) - Canadian dollar</option>
                    </select>
                    <span className="text-xl font-black text-gray-900">{formatCurrency(total)}</span>
                  </div>
                  <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Amount Due</span>
                    <span className="text-xl font-black text-gray-900">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notes / Terms</label>
                <textarea 
                  placeholder="Enter notes or terms of service that are visible to your customer"
                  className="w-full h-24 p-4 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none resize-none placeholder:italic placeholder:text-gray-300"
                />
              </div>
            </div>
          </div>

          <CollapsibleButton label="Footer" />
          <AttachmentSection />

          <div className="flex justify-center gap-4 py-12">
            <button className="px-8 py-2.5 border border-blue-600 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-50 transition-all">Preview</button>
            <div className="flex shadow-xl shadow-blue-200/50">
              <button 
                onClick={() => { toast.success("Invoice created successfully"); setView("list"); }}
                className="px-10 py-2.5 bg-blue-600 text-white rounded-l-full text-sm font-bold hover:bg-blue-700 transition-all"
              >
                Save and continue
              </button>
              <button className="px-4 bg-blue-700 text-white rounded-r-full hover:bg-blue-800 transition-all border-l border-blue-500">
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="p-8 space-y-12 bg-white min-h-screen font-sans antialiased">
      {/* Header */}
      <section className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Invoices</h2>
        <button 
          onClick={() => setView("create")}
          className="px-8 py-2.5 bg-[#0077c5] text-white rounded-full text-sm font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
        >
          Create an invoice
        </button>
      </section>

      {/* Stats Dashboard */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-gray-100">
          <StatCard label="Overdue" value="0.00" sub="CAD" />
          <StatCard label="Due within next 30 days" value="0.00" sub="CAD" />
          <StatCard label="Average time to get paid" value="168" sub="days" />
          <div className="p-6">
            <p className="text-[10px] font-black text-gray-400 border-gray-200 uppercase tracking-widest mb-2">Upcoming payout</p>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-gray-900 border-b-2 border-dotted border-gray-300 w-fit">None</span>
            </div>
          </div>
        </div>
        <div className="bg-white border-t border-gray-50 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
            Last updated just a moment ago. <RotateCcw size={12} className="text-blue-500 cursor-pointer" />
          </div>
          <div className="bg-[#f0f7ff] rounded-lg px-4 py-2 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <CreditCardIcon />
            </div>
            <span className="text-xs text-[#0077c5] font-medium">Invoices get paid 3x faster with online payments. <strong className="cursor-pointer hover:underline">Turn on Payments</strong></span>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
           <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-bold">0</div>
           <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">active filters</span>
        </div>
        <div className="grid grid-cols-12 gap-4">
           <div className="col-span-12 md:col-span-4 relative group">
              <select className="w-full pl-6 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-500 appearance-none outline-none focus:ring-2 focus:ring-blue-100">
                <option>All customers</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
           <div className="col-span-12 md:col-span-2 relative group">
              <select className="w-full pl-6 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-500 appearance-none outline-none focus:ring-2 focus:ring-blue-100">
                <option>All statuses</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
           <div className="col-span-12 md:col-span-3 flex gap-2">
              <div className="relative flex-1 group">
                 <input type="text" placeholder="From" className="w-full pl-6 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none placeholder:italic" />
                 <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative flex-1 group">
                 <input type="text" placeholder="To" className="w-full pl-6 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none placeholder:italic" />
                 <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
           </div>
           <div className="col-span-12 md:col-span-3 relative group">
              <input type="text" placeholder="Enter invoice #" className="w-full pl-6 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none placeholder:italic" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-gray-400">
                <Search size={14} />
              </div>
           </div>
        </div>
      </section>

      {/* Segmented Controls & List */}
      <section className="flex flex-col items-center">
        <div className="w-full border-t border-gray-100 relative mb-12">
           <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f0f7ff] p-1 rounded-xl border border-blue-50 flex items-center shadow-sm">
              <TabButton active={activeTab === "unpaid"} onClick={() => setActiveTab("unpaid")} label="Unpaid" count={0} />
              <TabButton active={activeTab === "draft"} onClick={() => setActiveTab("draft")} label="Draft" count={0} />
              <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")} label="All invoices" />
           </div>
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="w-full space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-100">
                  <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 flex items-center gap-1 cursor-pointer">Date <ChevronDown size={12} /></th>
                    <th className="py-4 px-4">Number</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4 text-right">Total</th>
                    <th className="py-4 px-4 text-right">Amount due</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <span className={cn(
                          "px-3 py-1 rounded text-[10px] font-black uppercase tracking-tight",
                          inv.status === "Paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-600">{inv.date}</td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-800">{inv.number}</td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-800">{inv.customer}</td>
                      <td className="py-4 px-4 text-right text-sm font-bold text-gray-900">{formatCurrency(inv.total)}</td>
                      <td className="py-4 px-4 text-right text-sm font-bold text-gray-900">{formatCurrency(inv.amountDue)}</td>
                      <td className="py-4 px-4 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                           <button className="text-blue-600 text-sm font-bold hover:underline">View</button>
                           <button 
                            onClick={() => setShowActionMenu(showActionMenu === inv.id ? null : inv.id)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50"
                           >
                              <ChevronDown size={14} />
                           </button>
                        </div>

                        <AnimatePresence>
                          {showActionMenu === inv.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(null)} />
                              <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute right-4 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                              >
                                <div className="p-2 space-y-1">
                                  <ActionMenuItem icon={Edit3Icon} label="Edit" />
                                  <ActionMenuItem icon={Copy} label="Duplicate" />
                                  <div className="h-[1px] bg-gray-100 my-1" />
                                  <ActionMenuItem icon={Mail} label="Send invoice" />
                                  <ActionMenuItem icon={CheckCircle2Icon} label="Mark as sent" />
                                  <div className="h-[1px] bg-gray-100 my-1" />
                                  <ActionMenuItem icon={FileDown} label="Export as PDF" />
                                  <ActionMenuItem icon={Printer} label="Print" />
                                  <ActionMenuItem icon={Trash} label="Delete" variant="danger" />
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center pt-8 border-t border-gray-50">
               <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                  <span>Show:</span>
                  <select className="bg-white border border-gray-200 rounded px-2 py-1 outline-none">
                    <option>25</option>
                  </select>
                  <span>per page</span>
               </div>
               <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-gray-800">1-25 <span className="text-gray-400 font-medium">of 78</span></span>
                  <div className="flex gap-2">
                     <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:bg-gray-50"><ChevronLeft size={16} /></button>
                     <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-blue-600 hover:bg-blue-50"><ChevronRight size={16} /></button>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 pt-12">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Ready to get paid? Approve your draft invoice.</h3>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setView("create")}
                className="px-10 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-blue-50"
              >
                Create a new invoice
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className="px-10 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-blue-50"
              >
                View all invoices
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );

  return view === "create" ? renderCreateView() : renderListView();
}

// --- Subcomponents ---

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="p-6">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-gray-900">${value}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub}</span>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
        active ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold",
          active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

function CollapsibleButton({ label }: { label: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <button className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-all font-sans">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest text-left">{label}</span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>
    </div>
  );
}

function FormInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest w-40 text-right">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold" 
      />
    </div>
  );
}

function FormDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest w-40 text-right">{label}</label>
      <div className="flex-1 relative">
        <input 
          type="date" 
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold" 
        />
        <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function AttachmentSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-sm">
       <div className="flex items-center gap-2">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">Attachments</h3>
          <HelpCircle size={16} className="text-gray-300" />
       </div>
       <div className="border-2 border-dashed border-blue-200 rounded-[2rem] p-12 bg-blue-50/10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-blue-50/30 transition-all">
            <CloudUpload size={48} className="text-blue-200 group-hover:scale-110 group-hover:text-blue-300 transition-all" />
            <div className="text-center font-sans">
               <p className="text-sm font-bold text-gray-600">Drag files here or click to upload</p>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Max 20MB</p>
            </div>
       </div>
       <div className="bg-[#fff1e6] border border-[#ff914d]/20 rounded-xl p-4 flex justify-between items-center font-sans">
            <div className="flex items-center gap-3">
              <div className="text-[#ff914d]">
                <Settings2 size={18} />
              </div>
              <span className="text-xs font-bold text-[#4a321f]">Attach files to your invoices and fire them off, right from Wave.</span>
            </div>
            <button className="px-4 py-2 bg-[#ffdac1] text-[#7c2d12] rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#ffcfaf] transition-all">
              Upgrade now
            </button>
       </div>
    </div>
  );
}

function ActionMenuItem({ icon: Icon, label, variant }: { icon: any, label: string, variant?: "danger" }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 p-2 rounded-lg text-xs font-bold transition-all",
      variant === "danger" ? "text-red-500 hover:bg-red-50" : "text-gray-600 hover:bg-gray-50"
    )}>
      <Icon size={14} />
      {label}
    </button>
  );
}

function CreditCardIcon() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-8 h-5 bg-gray-600 rounded flex items-center justify-center text-[6px] font-bold text-white">BANK</div>
      <div className="w-8 h-5 bg-blue-800 rounded flex items-center justify-center text-[6px] font-bold text-white italic">AMEX</div>
      <div className="w-8 h-5 bg-orange-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-red-600 -mr-1" />
        <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-80" />
      </div>
      <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] font-black text-white">VISA</div>
    </div>
  );
}

// Icons for ActionMenu
const Edit3Icon = (props: any) => <FileText {...props} />;
const CheckCircle2Icon = (props: any) => <Info {...props} />;
