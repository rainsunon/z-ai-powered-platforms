import React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Mail, Printer, FileDown, Trash, FileText, Info } from "lucide-react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Invoice } from "../types";
import { StatCard, TabButton, ActionMenuItem, CreditCardIcon } from "./InvoiceSubcomponents";

interface InvoiceListViewProps {
  invoices: Invoice[];
  activeTab: "unpaid" | "draft" | "all";
  onTabChange: (tab: "unpaid" | "draft" | "all") => void;
  onCreateNew: () => void;
  showActionMenu: string | null;
  onToggleActionMenu: (id: string | null) => void;
}

const Edit3Icon = (props: any) => <FileText {...props} />;
const CheckCircle2Icon = (props: any) => <Info {...props} />;

export function InvoiceListView({ invoices, activeTab, onTabChange, onCreateNew, showActionMenu, onToggleActionMenu }: InvoiceListViewProps) {
  const filteredInvoices = React.useMemo(() => {
    if (activeTab === "all") return invoices;
    if (activeTab === "unpaid") return invoices.filter((inv) => inv.status === "Unpaid");
    return invoices.filter((inv) => inv.status === "Draft");
  }, [activeTab, invoices]);

  return (
    <div className="p-8 space-y-12 bg-white min-h-screen font-sans antialiased">
      <section className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Invoices</h2>
        <button onClick={onCreateNew} className="px-8 py-2.5 bg-[#0077c5] text-white rounded-full text-sm font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">
          Create an invoice
        </button>
      </section>

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
            <CreditCardIcon />
            <span className="text-xs text-[#0077c5] font-medium">Invoices get paid 3x faster with online payments. <strong className="cursor-pointer hover:underline">Turn on Payments</strong></span>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-bold">0</div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">active filters</span>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <FilterSelect options={["All customers"]} className="col-span-12 md:col-span-4" />
          <FilterSelect options={["All statuses"]} className="col-span-12 md:col-span-2" />
          <div className="col-span-12 md:col-span-3 flex gap-2">
            <DateInput placeholder="From" />
            <DateInput placeholder="To" />
          </div>
          <div className="col-span-12 md:col-span-3 relative group">
            <input type="text" placeholder="Enter invoice #" className="w-full pl-6 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none placeholder:italic" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth={2} /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2} /></svg>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center">
        <div className="w-full border-t border-gray-100 relative mb-12">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f0f7ff] p-1 rounded-xl border border-blue-50 flex items-center shadow-sm">
            <TabButton active={activeTab === "unpaid"} onClick={() => onTabChange("unpaid")} label="Unpaid" count={0} />
            <TabButton active={activeTab === "draft"} onClick={() => onTabChange("draft")} label="Draft" count={0} />
            <TabButton active={activeTab === "all"} onClick={() => onTabChange("all")} label="All invoices" />
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
                    <InvoiceRow key={inv.id} invoice={inv} showActionMenu={showActionMenu} onToggleActionMenu={onToggleActionMenu} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center pt-8 border-t border-gray-50">
              <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                <span>Show:</span>
                <select className="bg-white border border-gray-200 rounded px-2 py-1 outline-none"><option>25</option></select>
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
              <button onClick={onCreateNew} className="px-10 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-blue-50">Create a new invoice</button>
              <button onClick={() => onTabChange("all")} className="px-10 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-blue-50">View all invoices</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function InvoiceRow({ invoice, showActionMenu, onToggleActionMenu }: { invoice: Invoice; showActionMenu: string | null; onToggleActionMenu: (id: string | null) => void }) {
  return (
    <tr className="group hover:bg-gray-50/50 transition-colors">
      <td className="py-4 px-4">
        <span className={cn(
          "px-3 py-1 rounded text-[10px] font-black uppercase tracking-tight",
          invoice.status === "Paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        )}>
          {invoice.status}
        </span>
      </td>
      <td className="py-4 px-4 text-sm font-medium text-gray-600">{invoice.date}</td>
      <td className="py-4 px-4 text-sm font-bold text-gray-800">{invoice.number}</td>
      <td className="py-4 px-4 text-sm font-bold text-gray-800">{invoice.customer}</td>
      <td className="py-4 px-4 text-right text-sm font-bold text-gray-900">{formatCurrency(invoice.total)}</td>
      <td className="py-4 px-4 text-right text-sm font-bold text-gray-900">{formatCurrency(invoice.amountDue)}</td>
      <td className="py-4 px-4 text-right relative">
        <div className="flex items-center justify-end gap-2">
          <button className="text-blue-600 text-sm font-bold hover:underline">View</button>
          <button onClick={() => onToggleActionMenu(showActionMenu === invoice.id ? null : invoice.id)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50">
            <ChevronDown size={14} />
          </button>
        </div>
        <AnimatePresence>
          {showActionMenu === invoice.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => onToggleActionMenu(null)} />
              <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className="absolute right-4 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  <ActionMenuItem icon={Edit3Icon} label="Edit" />
                  <ActionMenuItem icon={FileDown} label="Duplicate" />
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
  );
}

function FilterSelect({ options, className }: { options: string[]; className: string }) {
  return (
    <div className={`${className} relative group`}>
      <select className="w-full pl-6 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-500 appearance-none outline-none focus:ring-2 focus:ring-blue-100">
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function DateInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative flex-1 group">
      <input type="text" placeholder={placeholder} className="w-full pl-6 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none placeholder:italic" />
      <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} /><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} /><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} /><line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} /></svg>
    </div>
  );
}
