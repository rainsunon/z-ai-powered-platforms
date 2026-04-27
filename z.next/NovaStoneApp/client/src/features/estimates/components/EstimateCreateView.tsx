import React from "react";
import { Plus, ChevronDown, Eye, UserPlus, Settings2, Trash2, CloudUpload, HelpCircle } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";
import { motion } from "motion/react";
import { toast } from "sonner";
import { LineItem } from "../types";
export type { LineItem } from "../types";

interface EstimateCreateViewProps {
  formData: {
    estimateNumber: string;
    customerRef: string;
    date: string;
    validUntil: string;
    currency: string;
    discount: number;
    lineItems: LineItem[];
    notes: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onDone: () => void;
}

export function EstimateCreateView({ formData, setFormData, onDone }: EstimateCreateViewProps) {
  const addItem = () => {
    const newItem: LineItem = { id: Math.random().toString(36).substr(2, 9), description: "", quantity: 1, price: 0 };
    setFormData((prev: any) => ({ ...prev, lineItems: [...prev.lineItems, newItem] }));
  };

  const removeItem = (id: string) => {
    setFormData((prev: any) => ({ ...prev, lineItems: prev.lineItems.filter((item: LineItem) => item.id !== id) }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setFormData((prev: any) => ({ ...prev, lineItems: prev.lineItems.map((item: LineItem) => item.id === id ? { ...item, [field]: value } : item) }));
  };

  const subtotal = formData.lineItems.reduce((sum: number, item: LineItem) => sum + (item.quantity * item.price), 0);
  const total = subtotal - formData.discount;

  return (
    <div className="bg-[#f2f5f7] min-h-screen p-8 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">New estimate</h2>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-50 transition-all flex items-center gap-2"><Eye size={16} />Preview</button>
            <div className="flex">
              <button onClick={() => { toast.success("Estimate saved successfully"); onDone(); }} className="px-6 py-2 bg-blue-600 text-white rounded-l-full text-sm font-bold hover:bg-blue-700 transition-all">Save and continue</button>
              <button className="px-3 bg-blue-700 text-white rounded-r-full hover:bg-blue-800 transition-all border-l border-blue-500"><ChevronDown size={16} /></button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <CollapsibleSection label="Business address and contact details, title, summary, and logo" />
          <EstimateFormContent formData={formData} setFormData={setFormData} subtotal={subtotal} total={total} addItem={addItem} removeItem={removeItem} updateItem={updateItem} />
          <CollapsibleSection label="Footer" />
          <AttachmentSection />
          <div className="flex justify-center gap-4 py-12">
            <button className="px-8 py-2.5 border border-blue-600 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-50 transition-all">Preview</button>
            <div className="flex shadow-xl shadow-blue-200/50">
              <button onClick={() => { toast.success("Estimate saved successfully"); onDone(); }} className="px-10 py-2.5 bg-blue-600 text-white rounded-l-full text-sm font-bold hover:bg-blue-700 transition-all">Save and continue</button>
              <button className="px-4 bg-blue-700 text-white rounded-r-full hover:bg-blue-800 transition-all border-l border-blue-500"><ChevronDown size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({ label }: { label: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <button className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-all">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>
    </div>
  );
}

function EstimateFormContent({ formData, setFormData, subtotal, total, addItem, removeItem, updateItem }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden">
      <div className="p-12 space-y-12">
        <div className="grid grid-cols-2 gap-20">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl p-12 bg-gray-50/50 group cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm group-hover:scale-110 transition-transform"><UserPlus size={24} /></div>
            <span className="text-sm font-black text-blue-600 uppercase tracking-widest">Add customer</span>
          </div>
          <div className="space-y-4">
            <FormField label="Estimate number" value={formData.estimateNumber} onChange={(v: string) => setFormData((p: any) => ({ ...p, estimateNumber: v }))} />
            <FormField label="Customer ref" value={formData.customerRef} onChange={(v: string) => setFormData((p: any) => ({ ...p, customerRef: v }))} />
            <FormDateField label="Date" value={formData.date} onChange={(v: string) => setFormData((p: any) => ({ ...p, date: v }))} />
            <FormDateField label="Valid until" value={formData.validUntil} onChange={(v: string) => setFormData((p: any) => ({ ...p, validUntil: v }))} hint="Within 30 days" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50"><Settings2 size={12} />Edit columns</button>
          </div>
          <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#edf2f7] border-b border-gray-100">
                <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <th className="py-4 px-6 w-1/2">Items</th>
                  <th className="py-4 px-6 text-right">Quantity</th>
                  <th className="py-4 px-6 text-right">Price</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {formData.lineItems.map((item: LineItem) => (
                  <tr key={item.id} className="group transition-colors hover:bg-gray-50/30">
                    <td className="py-4 px-6"><input type="text" placeholder="Enter item description" className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 placeholder:text-gray-300" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} /></td>
                    <td className="py-4 px-6"><input type="number" className="w-full bg-transparent text-right outline-none text-sm font-bold text-gray-800" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value))} /></td>
                    <td className="py-4 px-6"><input type="number" className="w-full bg-transparent text-right outline-none text-sm font-bold text-gray-800" value={item.price} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value))} /></td>
                    <td className="py-4 px-6 text-right font-black text-gray-900 text-sm">{formatCurrency(item.quantity * item.price)}</td>
                    <td className="py-4 px-4"><button onClick={() => removeItem(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addItem} className="w-full py-4 text-sm font-black text-blue-600 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50/50 border-t border-gray-50 transition-all"><Plus size={16} />Add item</button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 px-6">
          <div className="w-[300px] space-y-4">
            <div className="flex justify-between items-center text-sm"><span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Subtotal</span><span className="font-black text-gray-900">{formatCurrency(subtotal)}</span></div>
            <button className="w-full flex items-center justify-end gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline"><Plus size={12} />Add discount</button>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex flex-col gap-1">
                <span className="font-black text-gray-900 text-lg uppercase tracking-tight">Total</span>
                <select className="bg-gray-50 px-3 py-1 rounded text-[10px] font-black text-gray-500 border border-gray-200 outline-none" value={formData.currency} onChange={e => setFormData((p: any) => ({ ...p, currency: e.target.value }))}><option>CAD ($) - Canadian dollar</option><option>USD ($) - US Dollar</option></select>
              </div>
              <span className="text-2xl font-black text-gray-900">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center py-4 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer group"><Plus size={12} className="mr-2 group-hover:scale-125 transition-transform" />Request deposit</div>
          <div className="bg-[#fff1e6] border border-[#ff914d]/20 rounded-xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-[#ff914d]"><Settings2 size={18} /></motion.div>
              <span className="text-xs font-bold text-[#4a321f]">Want to seal the deal? Request a deposit, get paid, and get your project moving</span>
            </div>
            <button className="px-4 py-2 bg-[#ffdac1] text-[#7c2d12] rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#ffcfaf] transition-all">Discover Pro</button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notes / Terms</label>
          <textarea placeholder="Enter notes or terms of service that are visible to your customer" className="w-full h-24 p-4 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none resize-none placeholder:italic placeholder:text-gray-300" value={formData.notes} onChange={e => setFormData((p: any) => ({ ...p, notes: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest w-40 text-right">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
    </div>
  );
}

function FormDateField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-xs font-black text-gray-500 uppercase tracking-widest w-40 text-right">{label}</label>
      <div className="flex-1 relative">
        <input type="date" value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
        {hint && <span className="absolute -bottom-5 right-0 text-[10px] font-bold text-gray-400 uppercase tracking-tight">{hint}</span>}
      </div>
    </div>
  );
}

function AttachmentSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">Attachments</h3>
        <HelpCircle size={16} className="text-gray-300" />
      </div>
      <div className="border-2 border-dashed border-blue-200 rounded-[2rem] p-12 bg-blue-50/10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-blue-50/30 transition-all">
        <CloudUpload size={48} className="text-blue-200 group-hover:scale-110 group-hover:text-blue-300 transition-all" />
        <div className="text-center"><p className="text-sm font-bold text-gray-600">Drag files here or click to upload</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Max 20MB</p></div>
      </div>
      <div className="bg-[#fff1e6] border border-[#ff914d]/20 rounded-xl p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="text-[#ff914d]"><Settings2 size={18} /></div>
          <span className="text-xs font-bold text-[#4a321f]">Attach files to your invoices and fire them off, right from Wave.</span>
        </div>
        <button className="px-4 py-2 bg-[#ffdac1] text-[#7c2d12] rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#ffcfaf] transition-all">Upgrade now</button>
      </div>
    </div>
  );
}
