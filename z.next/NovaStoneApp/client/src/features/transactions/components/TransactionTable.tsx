import React from "react";
import { Check, ChevronDown, FileText } from "lucide-react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { Transaction } from "../types";

interface TransactionTableProps {
  transactions: Transaction[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

export function TransactionTable({ transactions, selectedIds, onToggleSelect }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50/30">
            <th className="py-4 px-6 w-12"></th>
            <th className="py-4 px-6">Date</th>
            <th className="py-4 px-6">Description</th>
            <th className="py-4 px-6">Account</th>
            <th className="py-4 px-6">Category</th>
            <th className="py-4 px-6">Amount</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <tr key={tx.id} className={cn("group transition-colors hover:bg-gray-50/50", selectedIds.includes(tx.id) && "bg-blue-50/30 font-medium")}>
              <td className="py-5 px-6">
                <input type="checkbox" checked={selectedIds.includes(tx.id)} onChange={() => onToggleSelect(tx.id)} className="w-5 h-5 rounded border-gray-300 text-[#0077c5] focus:ring-[#0077c5]" />
              </td>
              <td className="py-5 px-6 text-sm font-bold text-gray-900">{tx.date}</td>
              <td className="py-5 px-6 text-sm font-black text-gray-900 tracking-tight">{tx.description}</td>
              <td className="py-5 px-6 text-sm font-bold text-gray-500">{tx.account}</td>
              <td className="py-5 px-6">
                <span className={cn("text-sm font-bold text-gray-500", tx.categoryIsUncertain && "underline underline-offset-4 decoration-dotted decoration-gray-300")}>{tx.category}</span>
              </td>
              <td className="py-5 px-6"><span className="text-sm font-black text-gray-900">{formatCurrency(tx.amount)}</span></td>
              <td className="py-5 px-6">
                <div className="flex items-center justify-end gap-3 translate-x-2">
                  <div className="relative">
                    <FileText size={18} className="text-gray-400" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#8b5cf6] border-2 border-white" />
                  </div>
                  <button className={cn("w-8 h-8 rounded-full border flex items-center justify-center transition-all", tx.isReconciled ? "border-[#0077c5] text-[#0077c5] bg-[#0077c5]/5" : "border-gray-200 text-gray-300 hover:border-gray-300")}>
                    <Check size={14} strokeWidth={3} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-all">
                    <ChevronDown size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
