import React from "react";
import { motion } from "motion/react";
import { Plus, Receipt } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Sale, LineItem } from "../types";

interface SaleModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<Sale, "id">) => void;
  categories: string[];
  initialData?: Sale;
}

export function SaleModal({ onClose, onSubmit, categories, initialData }: SaleModalProps) {
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

  const [newLineItem, setNewLineItem] = React.useState({ description: "", quantity: 1, unitPrice: 0 });

  const addItem = () => {
    if (newLineItem.description.trim()) {
      const items = [...formData.lineItems, { ...newLineItem, id: Date.now().toString() }];
      setFormData({ ...formData, lineItems: items, amount: items.reduce((a, b) => a + (b.quantity * b.unitPrice), 0).toFixed(2) });
      setNewLineItem({ description: "", quantity: 1, unitPrice: 0 });
    }
  };

  const handleSubmit = () => {
    onSubmit({ ...formData, amount: parseFloat(formData.amount), dueDate: formData.dueDate || formData.date });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col">
        <ModalHeader initialData={initialData} onClose={onClose} />
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <HeaderInfoSection formData={formData} setFormData={setFormData} />
          <ServiceItemsSection formData={formData} setFormData={setFormData} newLineItem={newLineItem} setNewLineItem={setNewLineItem} onAddItem={addItem} />
        </div>
        <ModalFooter initialData={initialData} onClose={onClose} onSubmit={handleSubmit} />
      </motion.div>
    </div>
  );
}

function ModalHeader({ initialData, onClose }: { initialData?: Sale; onClose: () => void }) {
  return (
    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{initialData ? "Update Invoice" : "Generate Invoice"}</h3>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Revenue Registry</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Plus className="rotate-45 text-gray-500" size={20} /></button>
    </div>
  );
}

function HeaderInfoSection({ formData, setFormData }: any) {
  return (
    <section className="space-y-4">
      <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-4 flex items-center gap-2"><span className="w-8 h-[1px] bg-primary/20"></span>Header Information</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Customer Name *</label><input required type="text" value={formData.customer} onChange={e => setFormData({ ...formData, customer: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
        <div className="col-span-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Street Address</label><input type="text" value={formData.customerAddress} onChange={e => setFormData({ ...formData, customerAddress: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
        <div className="col-span-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Email Address</label><input type="email" value={formData.customerEmail} onChange={e => setFormData({ ...formData, customerEmail: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
        <div className="col-span-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Reference #</label><input type="text" value={formData.reference} onChange={e => setFormData({ ...formData, reference: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
        <div className="col-span-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Issue Date</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" /></div>
        <div className="col-span-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Grand Total ($)</label><input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold outline-none" /></div>
      </div>
    </section>
  );
}

function ServiceItemsSection({ formData, newLineItem, setNewLineItem, onAddItem }: any) {
  return (
    <section className="space-y-4">
      <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-4 flex items-center gap-2"><span className="w-8 h-[1px] bg-primary/20"></span>Service Items</h4>
      <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
        <div className="grid grid-cols-12 gap-2">
          <input className="col-span-6 px-3 py-2 border border-gray-200 rounded-lg text-xs" placeholder="Item/Service" value={newLineItem.description} onChange={e => setNewLineItem({ ...newLineItem, description: e.target.value })} />
          <input className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-xs" type="number" value={newLineItem.quantity} onChange={e => setNewLineItem({ ...newLineItem, quantity: parseInt(e.target.value) || 0 })} />
          <input className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-xs" type="number" step="0.01" value={newLineItem.unitPrice} onChange={e => setNewLineItem({ ...newLineItem, unitPrice: parseFloat(e.target.value) || 0 })} />
          <button type="button" onClick={onAddItem} className="col-span-1 bg-primary text-white rounded-lg flex items-center justify-center"><Plus size={14} /></button>
        </div>
        <div className="space-y-1">
          {formData.lineItems.map((item: LineItem) => (
            <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold">{item.description}</span>
              <span className="text-xs font-bold">{formatCurrency(item.quantity * item.unitPrice)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModalFooter({ initialData, onClose, onSubmit }: { initialData?: Sale; onClose: () => void; onSubmit: () => void }) {
  return (
    <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
      <button onClick={onSubmit} className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2"><Receipt size={18} />{initialData ? "Save Changes" : "Post Invoice"}</button>
      <button onClick={onClose} className="w-full py-3 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Discard</button>
    </div>
  );
}
