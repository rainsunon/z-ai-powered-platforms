import React from "react";
import { ChevronDown, Search } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { LineItem } from "../types";
import { EstimateCreateView } from "../components/EstimateCreateView";
import { TabButton } from "../components/EstimatesSubcomponents";

export type { LineItem } from "../types";

export function EstimatesPage() {
  const [view, setView] = React.useState<"list" | "create">("list");
  const [activeTab, setActiveTab] = React.useState<"active" | "draft" | "all">("active");
  const [formData, setFormData] = React.useState({
    estimateNumber: "1",
    customerRef: "",
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: "CAD ($)",
    discount: 0,
    lineItems: [] as LineItem[],
    notes: ""
  });

  if (view === "create") {
    return <EstimateCreateView formData={formData} setFormData={setFormData} onDone={() => setView("list")} />;
  }

  return (
    <div className="p-8 space-y-12 bg-white min-h-screen font-sans antialiased">
      <section className="flex justify-between items-center border-b border-gray-100 pb-12">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Estimates</h2>
        <button onClick={() => setView("create")} className="px-8 py-2.5 bg-[#0077c5] text-white rounded-full text-sm font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">Create estimate</button>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-bold">0</div>
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Active filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <FilterSelect options={["All customers"]} className="md:col-span-4" />
          <FilterSelect options={["All statuses"]} className="md:col-span-2" />
          <div className="md:col-span-3 flex items-center gap-2">
            <DateInput placeholder="From" />
            <DateInput placeholder="To" />
          </div>
          <div className="md:col-span-3 relative group">
            <input type="text" placeholder="Enter estimate #" className="w-full pl-6 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-400 placeholder:italic focus:ring-2 focus:ring-blue-100 outline-none" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-all"><Search size={14} /></div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center">
        <div className="w-full border-t border-gray-100 relative mb-20">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f0f7ff] p-1 rounded-xl border border-blue-50 flex items-center shadow-sm">
            <TabButton active={activeTab === "active"} onClick={() => setActiveTab("active")} label="Active" count={0} />
            <TabButton active={activeTab === "draft"} onClick={() => setActiveTab("draft")} label="Draft" count={0} />
            <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")} label="All" />
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 pt-12">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Don't underestimate it — Create a new estimate</h3>
            <p className="text-sm text-gray-500 font-medium">Create and share a new estimate, then convert it to an invoice in record time.</p>
          </div>
          <button onClick={() => setView("create")} className="px-10 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-sm font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Create estimate</button>
        </motion.div>
      </section>
    </div>
  );
}

function FilterSelect({ options, className }: { options: string[]; className: string }) {
  return (
    <div className={`${className} relative group`}>
      <select className="w-full pl-6 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-500 appearance-none outline-none focus:ring-2 focus:ring-blue-100 transition-all">
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
    </div>
  );
}

function DateInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative flex-1 group">
      <input type="text" placeholder={placeholder} className="w-full pl-6 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-400 placeholder:italic focus:ring-2 focus:ring-blue-100 outline-none" />
    </div>
  );
}
