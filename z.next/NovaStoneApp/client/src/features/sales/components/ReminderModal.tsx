import React from "react";
import { motion } from "motion/react";
import { Bell, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Sale {
  id: string;
  customer: string;
  reference: string;
  reminderSchedule?: "none" | "daily" | "weekly" | "once_on_due";
  customReminderMessage?: string;
}

interface ReminderModalProps {
  sale: Sale;
  onClose: () => void;
  onSave: (id: string, schedule: Sale["reminderSchedule"], message: string) => void;
}

export function ReminderModal({ sale, onClose, onSave }: ReminderModalProps) {
  const [schedule, setSchedule] = React.useState(sale.reminderSchedule || "none");
  const [message, setMessage] = React.useState(
    sale.customReminderMessage || 
    `Hi ${sale.customer}, this is a reminder regarding our unpaid Invoice ${sale.reference}. Please let us know the status. Thanks!`
  );

  const schedules: { id: Sale["reminderSchedule"]; label: string; desc: string }[] = [
    { id: "none", label: "None", desc: "No reminders" },
    { id: "once_on_due", label: "Due Date", desc: "Send on due date" },
    { id: "daily", label: "Daily", desc: "Daily follow-ups" },
    { id: "weekly", label: "Weekly", desc: "Weekly reminders" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Invoice Reminders</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{sale.customer} • {sale.reference}</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-[10px] font-black uppercase text-primary tracking-widest mb-3">Schedule Frequency</h4>
            <div className="grid grid-cols-2 gap-2">
              {schedules.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setSchedule(s.id)} 
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all", 
                    schedule === s.id ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <p className="text-[10px] font-black uppercase text-gray-900 mb-1">{s.label}</p>
                  <p className="text-[9px] text-gray-500 font-medium tracking-tight">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase text-primary tracking-widest mb-3">Custom Message</h4>
            <textarea 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 resize-none focus:ring-2 focus:ring-primary/10 outline-none" 
            />
          </div>
        </div>
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
          <button 
            onClick={() => onSave(sale.id, schedule, message)} 
            className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Send size={14} />
            Save Settings
          </button>
          <button 
            onClick={onClose} 
            className="px-6 py-4 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 rounded-2xl transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
