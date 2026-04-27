import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Info, X, Library, Zap, Scale } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { TransactionActionBar } from "../components/TransactionActionBar";
import { TransactionTable } from "../components/TransactionTable";
import { mockTransactions } from "../data/mockTransactions";

export function TransactionsPage() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isReconciliationOn, setIsReconciliationOn] = React.useState(false);
  const [showBlueBanner, setShowBlueBanner] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === mockTransactions.length ? [] : mockTransactions.map(t => t.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="p-8 space-y-6 bg-[#fcfcfc] min-h-screen">
      <section className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Transactions</h2>
        <div className="flex gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0077c5] text-white rounded-full text-sm font-bold shadow-md hover:bg-opacity-90 transition-all">Add transaction<ChevronDown size={16} /></button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">More<ChevronDown size={16} /></button>
        </div>
      </section>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#fff1e6] border-l-4 border-[#ff914d] p-4 flex justify-between items-center relative overflow-hidden">
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-[#ff914d]" />
          <p className="text-sm font-bold text-[#4a321f]">Import transactions securely to automate your bookkeeping and reports.</p>
        </div>
        <div className="hidden lg:flex items-center bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden absolute right-4 top-1/2 -translate-y-1/2">
          <div className="px-4 py-2 flex items-center gap-2 border-r border-gray-50 cursor-pointer hover:bg-gray-50 transition-all">
            <span className="text-xs font-bold text-gray-700">Connect your bank</span>
            <span className="bg-[#0077c5] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Pro</span>
          </div>
          <div className="px-4 py-2 text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-50 transition-all">Upload transactions</div>
        </div>
      </motion.div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-gray-300 transition-all shadow-sm">
          <div><p className="text-sm font-semibold text-gray-900">All accounts</p><p className="text-[11px] font-bold text-gray-500">-$179,277.53</p></div>
          <ChevronDown size={18} className="text-gray-400" />
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Scale size={18} className="text-gray-400" />
            <span className="text-sm font-semibold">Reconciliation</span>
          </div>
          <button onClick={() => setIsReconciliationOn(!isReconciliationOn)} className={cn("w-12 h-6 rounded-full transition-all relative", isReconciliationOn ? "bg-[#0077c5]" : "bg-gray-200")}>
            <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm", isReconciliationOn ? "left-7" : "left-1")} />
          </button>
        </div>
      </section>

      <AnimatePresence>
        {showBlueBanner && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-[#edf6ff] border border-[#cfe6ff] rounded-xl p-5 flex items-start gap-4 relative">
            <div className="w-10 h-10 rounded-lg bg-[#cfe6ff] flex items-center justify-center text-[#0077c5]"><Library size={20} /></div>
            <div className="flex-1"><h4 className="text-sm font-bold text-gray-900 mb-1">Seeing the same transaction twice?</h4><p className="text-sm text-gray-600">We're on it! Wave's auto-updates automatically merge duplicates within 24 hours.</p></div>
            <button className="px-5 py-2 bg-white border border-[#cfe6ff] text-[#0077c5] rounded-full text-xs font-bold hover:bg-[#f8fbff] transition-all">Learn more</button>
            <button onClick={() => setShowBlueBanner(false)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <TransactionActionBar
          selectedCount={selectedIds.length}
          totalCount={mockTransactions.length}
          onSelectAll={toggleSelectAll}
          isAllSelected={selectedIds.length === mockTransactions.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <TransactionTable transactions={mockTransactions} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
      </section>
    </div>
  );
}
