import React from "react";
import { motion } from "motion/react";
import { Bell, Check, Mail, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Purchase {
  id: string;
  vendor: string;
  reference: string;
  vendorEmail?: string;
  reminderSchedule?: "none" | "daily" | "weekly" | "once_on_due";
  customReminderMessage?: string;
}

interface ReminderModalProps {
  purchase: Purchase;
  onClose: () => void;
  onSave: (id: string, schedule: Purchase["reminderSchedule"], message: string) => void;
}

export function ReminderModal({ purchase, onClose, onSave }: ReminderModalProps) {
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
