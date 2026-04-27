import React from "react";
import { motion } from "motion/react";
import { Plus, Receipt, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, cn } from "@/lib/utils";
import { Purchase } from "../types";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface PurchaseModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<Purchase, "id">) => void;
  categories: string[];
  initialData?: Purchase;
}

export function PurchaseModal({ onClose, onSubmit, categories, initialData }: PurchaseModalProps) {
  const [formData, setFormData] = React.useState({
    vendor: initialData?.vendor || "",
    vendorAddress: initialData?.vendorAddress || "",
    vendorPhone: initialData?.vendorPhone || "",
    vendorEmail: initialData?.vendorEmail || "",
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

  const handleAddLineItem = () => {
    if (!newLineItem.description) return;
    const item: LineItem = { ...newLineItem, id: `LI-${Date.now()}` };
    const updatedItems = [...formData.lineItems, item];
    const totalAmount = updatedItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    setFormData(prev => ({ ...prev, lineItems: updatedItems, amount: totalAmount > 0 ? totalAmount.toFixed(2) : prev.amount }));
    setNewLineItem({ description: "", quantity: 1, unitPrice: 0 });
  };

  const removeLineItem = (id: string) => {
    const updatedItems = formData.lineItems.filter(item => item.id !== id);
    const totalAmount = updatedItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    setFormData(prev => ({ ...prev, lineItems: updatedItems, amount: totalAmount > 0 ? totalAmount.toFixed(2) : prev.amount }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendor || !formData.amount) { toast.error("Please fill in required fields"); return; }
    onSubmit({ ...formData, amount: parseFloat(formData.amount), dueDate: formData.dueDate || formData.date });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col">
        <ModalHeader initialData={initialData} onClose={onClose} />
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          <HeaderDetailsSection formData={formData} setFormData={setFormData} />
          <LineItemsSection formData={formData} setFormData={setFormData} newLineItem={newLineItem} setNewLineItem={setNewLineItem} onAddLineItem={handleAddLineItem} onRemoveLineItem={removeLineItem} />
          <ClassificationSection formData={formData} setFormData={setFormData} categories={categories} />
        </form>
        <ModalFooter initialData={initialData} onClose={onClose} onSubmit={handleSubmit} />
      </motion.div>
    </div>
  );
}

function ModalHeader({ initialData, onClose }: { initialData?: Purchase; onClose: () => void }) {
  return (
    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{initialData ? "Edit Purchase Bill" : "New Purchase Bill"}</h3>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Acquisition Entry</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Plus className="rotate-45 text-gray-500" size={20} /></button>
    </div>
  );
}

function HeaderDetailsSection({ formData, setFormData }: any) {
  return (
    <section className="space-y-4">
      <SectionTitle title="Header Details" />
      <div className="grid grid-cols-2 gap-4">
        <FormField colSpan label="Vendor Name *" required value={formData.vendor} onChange={(v: string) => setFormData((p: any) => ({ ...p, vendor: v }))} placeholder="e.g. Amazon Web Services" autoFocus />
        <FormField colSpan label="Vendor Address" value={formData.vendorAddress} onChange={(v: string) => setFormData((p: any) => ({ ...p, vendorAddress: v }))} placeholder="Street, City, State, ZIP" />
        <FormField label="Vendor Phone" value={formData.vendorPhone} onChange={(v: string) => setFormData((p: any) => ({ ...p, vendorPhone: v }))} placeholder="+1 (555) 000-0000" type="tel" />
        <FormField label="Vendor Email" value={formData.vendorEmail} onChange={(v: string) => setFormData((p: any) => ({ ...p, vendorEmail: v }))} placeholder="billing@vendor.com" type="email" />
        <PaymentTermsField value={formData.paymentTerms} onChange={(v: string) => setFormData((p: any) => ({ ...p, paymentTerms: v }))} />
        <FormField label="Issue Date" value={formData.date} onChange={(v: string) => setFormData((p: any) => ({ ...p, date: v }))} type="date" />
        <FormField label="Due Date" value={formData.dueDate} onChange={(v: string) => setFormData((p: any) => ({ ...p, dueDate: v }))} type="date" />
        <FormField label="Total Amount ($) *" required value={formData.amount} onChange={(v: string) => setFormData((p: any) => ({ ...p, amount: v }))} type="number" step="0.01" placeholder="0.00" bold />
        <FormField label="Purchase Order #" value={formData.reference} onChange={(v: string) => setFormData((p: any) => ({ ...p, reference: v }))} placeholder="e.g. PO-2026-001" mono />
      </div>
    </section>
  );
}

function LineItemsSection({ formData, newLineItem, setNewLineItem, onAddLineItem, onRemoveLineItem }: any) {
  return (
    <section className="space-y-4">
      <SectionTitle title="Line Items" />
      <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6"><input type="text" placeholder="Item Description" value={newLineItem.description} onChange={(e) => setNewLineItem((p: any) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary/30" /></div>
          <div className="col-span-2"><input type="number" placeholder="Qty" value={newLineItem.quantity} onChange={(e) => setNewLineItem((p: any) => ({ ...p, quantity: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary/30" /></div>
          <div className="col-span-3"><input type="number" placeholder="Price" step="0.01" value={newLineItem.unitPrice} onChange={(e) => setNewLineItem((p: any) => ({ ...p, unitPrice: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary/30" /></div>
          <div className="col-span-1"><button type="button" onClick={onAddLineItem} className="w-full h-full bg-primary text-white rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-all font-bold"><Plus size={14} /></button></div>
        </div>
        {formData.lineItems.length > 0 && (
          <div className="space-y-2 mt-4">
            {formData.lineItems.map((item: LineItem) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm group">
                <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-gray-700 truncate">{item.description}</p><p className="text-[10px] text-gray-400">{item.quantity} x {formatCurrency(item.unitPrice)}</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</span>
                  <button type="button" onClick={() => onRemoveLineItem(item.id)} className="p-1 text-gray-300 hover:text-rose-500 transition-colors"><Plus className="rotate-45" size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ClassificationSection({ formData, setFormData, categories }: any) {
  return (
    <section className="space-y-4">
      <SectionTitle title="Classification" />
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Expense Category</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat: string) => (
              <button key={cat} type="button" onClick={() => setFormData((p: any) => ({ ...p, category: cat }))} className={cn("px-3 py-2 text-xs font-bold rounded-lg border transition-all text-left truncate", formData.category === cat ? "bg-primary border-primary text-white shadow-md shadow-primary/20" : "border-gray-100 text-gray-500 hover:border-gray-200")}>{cat}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Status</label>
          <div className="flex gap-2">
            {(["paid", "unpaid"] as const).map(status => (
              <button key={status} type="button" onClick={() => setFormData((p: any) => ({ ...p, status }))} className={cn("flex-1 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg border transition-all flex items-center justify-center gap-2", formData.status === status ? (status === 'paid' ? "bg-green-500 border-green-500 text-white" : "bg-amber-500 border-amber-500 text-white") : "border-gray-100 text-gray-400")}>
                {status === 'paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}{status}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ModalFooter({ initialData, onClose, onSubmit }: { initialData?: Purchase; onClose: () => void; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
      <button onClick={onSubmit} className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"><Receipt size={18} />{initialData ? "Update Purchase Bill" : "Create Purchase Bill"}</button>
      <button type="button" onClick={onClose} className="w-full py-3 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-gray-600 transition-all">Discard</button>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h4 className="text-xs font-black uppercase text-primary tracking-[0.2em] mb-4 flex items-center gap-2"><span className="w-8 h-[1px] bg-primary/20"></span>{title}</h4>;
}

function FormField({ label, value, onChange, placeholder, type = "text", required, colSpan, autoFocus, step, bold, mono }: any) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">{label}</label>
      <input autoFocus={autoFocus} required={required} type={type} step={step} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={cn("w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all", bold && "font-bold", mono && "font-mono uppercase")} />
    </div>
  );
}

function PaymentTermsField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="col-span-2">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Payment Terms</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {["Net 30", "Net 60", "Due on Receipt", "Immediate"].map(term => (
          <button key={term} type="button" onClick={() => onChange(term)} className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border", value === term ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300")}>{term}</button>
        ))}
      </div>
      <input type="text" placeholder="Custom terms..." value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
    </div>
  );
}
