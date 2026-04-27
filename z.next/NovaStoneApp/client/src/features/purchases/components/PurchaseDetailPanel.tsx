import React from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Check,
  Bell,
  Send,
  Calendar,
  MessageSquare,
  History,
  Receipt,
} from "lucide-react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { Purchase } from "../types";

interface PurchaseDetailPanelProps {
  purchase: Purchase;
  allPurchases: Purchase[];
  onReminderConfigure: (purchase: Purchase) => void;
}

export function PurchaseDetailPanel({ purchase, allPurchases, onReminderConfigure }: PurchaseDetailPanelProps) {
  const vendorHistory = allPurchases
    .filter(p => p.vendor === purchase.vendor && p.id !== purchase.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <tr className="bg-gray-50/20">
      <td colSpan={10} className="px-6 py-6 font-sans">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden"
        >
          <div className="grid grid-cols-12">
            <VendorInfoColumn
              purchase={purchase}
              vendorHistory={vendorHistory}
              onReminderConfigure={onReminderConfigure}
            />
            <LineItemsColumn purchase={purchase} />
          </div>
        </motion.div>
      </td>
    </tr>
  );
}

function VendorInfoColumn({ purchase, vendorHistory, onReminderConfigure }: {
  purchase: Purchase;
  vendorHistory: Purchase[];
  onReminderConfigure: (purchase: Purchase) => void;
}) {
  return (
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

        <AuditTimeline purchase={purchase} />
        <ReminderSection purchase={purchase} onReminderConfigure={onReminderConfigure} />
        <VendorHistorySection vendorHistory={vendorHistory} />
      </div>
    </div>
  );
}

function AuditTimeline({ purchase }: { purchase: Purchase }) {
  return (
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
  );
}

function ReminderSection({ purchase, onReminderConfigure }: {
  purchase: Purchase;
  onReminderConfigure: (purchase: Purchase) => void;
}) {
  return (
    <div className="pt-6 border-t border-gray-200/60">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Reminders</h4>
        {purchase.status !== "paid" && purchase.vendorEmail && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReminderConfigure(purchase);
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
          <p className="text-[10px] font-bold uppercase tracking-tight">Bill Settled &bull; No Reminders</p>
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
                import("sonner").then(({ toast }) => toast.success(`Reminder sent to ${purchase.vendorEmail}`));
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
  );
}

function VendorHistorySection({ vendorHistory }: { vendorHistory: Purchase[] }) {
  return (
    <div className="pt-6 border-t border-gray-200/60">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Vendor History</h4>
      <div className="space-y-3">
        {vendorHistory.map(historyItem => (
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
        {vendorHistory.length === 0 && (
          <div className="flex flex-col items-center py-4 bg-white/50 rounded-lg border border-dashed border-gray-200">
            <History size={16} className="text-gray-200 mb-1" />
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">No Prior Records</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LineItemsColumn({ purchase }: { purchase: Purchase }) {
  return (
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
                  <td className="py-3 px-4 text-right font-black text-gray-900">
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
  );
}
