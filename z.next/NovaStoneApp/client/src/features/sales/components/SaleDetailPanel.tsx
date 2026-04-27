import React from "react";
import { motion } from "motion/react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Bell,
  Send,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";
import { Sale } from "../types";

interface SaleDetailPanelProps {
  sale: Sale;
  onReminderConfigure: (sale: Sale) => void;
}

export function SaleDetailPanel({ sale, onReminderConfigure }: SaleDetailPanelProps) {
  return (
    <tr className="bg-gray-50/20">
      <td colSpan={10} className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-6 grid grid-cols-12 gap-8"
        >
          <CustomerInfoColumn sale={sale} onReminderConfigure={onReminderConfigure} />
          <InvoiceItemsColumn sale={sale} />
        </motion.div>
      </td>
    </tr>
  );
}

function CustomerInfoColumn({ sale, onReminderConfigure }: { sale: Sale; onReminderConfigure: (sale: Sale) => void }) {
  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      <div>
        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Customer Insights</h4>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              <User size={14} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{sale.customer}</p>
              <p className="text-[10px] text-gray-500 font-mono">{sale.id}</p>
            </div>
          </div>
          {sale.customerAddress && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Billing Location</p>
                <p className="text-xs text-gray-600 font-medium">{sale.customerAddress}</p>
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            {sale.customerPhone && (
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-gray-400" />
                <span className="text-xs text-gray-700 font-bold">{sale.customerPhone}</span>
              </div>
            )}
            {sale.customerEmail && (
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-gray-400" />
                <span className="text-xs text-primary font-bold">{sale.customerEmail}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Automated Reminders</h4>
          {sale.status !== "paid" && (
            <button
              onClick={() => onReminderConfigure(sale)}
              className="text-[9px] font-black text-primary uppercase flex items-center gap-1"
            >
              <Bell size={10} />
              Configure
            </button>
          )}
        </div>
        {sale.status === "paid" ? (
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Invoice Fully Paid</p>
        ) : !sale.customerEmail ? (
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">No Customer Email Provided</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-gray-400" />
                <span className="text-[10px] text-gray-600">
                  Schedule: <span className="font-bold text-gray-900 uppercase">{sale.reminderSchedule || "none"}</span>
                </span>
              </div>
              <button
                onClick={() => import("sonner").then(({ toast }) => toast.success(`Reminder sent to ${sale.customerEmail}`))}
                className="bg-primary text-white p-1.5 rounded-lg hover:bg-opacity-90 shadow-md"
              >
                <Send size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InvoiceItemsColumn({ sale }: { sale: Sale }) {
  return (
    <div className="col-span-12 lg:col-span-8 flex flex-col">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Invoice Items</h4>
      <div className="rounded-xl border border-gray-100 overflow-hidden mb-6">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[9px] uppercase font-black text-gray-400">
            <tr>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Price</th>
              <th className="py-3 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sale.lineItems?.map(item => (
              <tr key={item.id} className="text-sm">
                <td className="py-3 px-4 font-semibold text-gray-700">{item.description}</td>
                <td className="py-3 px-4 text-center font-mono text-gray-500">{item.quantity}</td>
                <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 px-4 text-right font-black text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
              </tr>
            )) || (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  No Items Recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="ml-auto w-full max-w-[240px] space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Sum Subtotal:</span>
          <span className="font-bold text-gray-700">{formatCurrency(sale.amount)}</span>
        </div>
        <div className="flex justify-between items-center bg-primary/5 p-3 rounded-xl">
          <span className="text-xs font-black text-primary uppercase tracking-widest">Total Due</span>
          <span className="text-xl font-black text-primary tracking-tighter">{formatCurrency(sale.amount)}</span>
        </div>
      </div>
    </div>
  );
}
