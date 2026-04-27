import React from "react";
import { Plus, ChevronDown, Eye, UserPlus, Settings2 } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";
import { toast } from "sonner";
import { LineItem } from "../types";
import { CollapsibleButton, FormField, FormDate, AttachmentSection } from "../components/InvoiceSubcomponents";

interface InvoiceCreateViewProps {
  formData: {
    invoiceNumber: string;
    poNumber: string;
    date: string;
    dueDate: string;
    currency: string;
    discount: number;
    lineItems: LineItem[];
    notes: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onDone: () => void;
}

export function InvoiceCreateView({ formData, setFormData, onDone }: InvoiceCreateViewProps) {
  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      quantity: 1,
      price: 0
    };
    setFormData((prev: any) => ({ ...prev, lineItems: [...prev.lineItems, newItem] }));
  };

  const subtotal = formData.lineItems.reduce((sum: number, item: LineItem) => sum + (item.quantity * item.price), 0);
  const total = subtotal - formData.discount;

  return (
    <div className="bg-[#f2f5f7] min-h-screen p-8 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">New invoice</h2>
          <div className="flex gap-4">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
              <Eye size={16} />
              Preview
            </button>
            <div className="flex">
              <button onClick={() => { toast.success("Invoice created successfully"); onDone(); }} className="px-6 py-2 bg-blue-600 text-white rounded-l-full text-sm font-bold hover:bg-blue-700 transition-all">
                Save and continue
              </button>
              <button className="px-3 bg-blue-700 text-white rounded-r-full hover:bg-blue-800 transition-all border-l border-blue-500">
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <CollapsibleButton label="Business address and contact details, title, summary, and logo" />

          <div className="bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden">
            <div className="p-12 space-y-12">
              <div className="grid grid-cols-2 gap-20">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl p-12 bg-gray-50/50 group cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                  <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <UserPlus size={24} />
                  </div>
                  <span className="text-sm font-black text-blue-600 uppercase tracking-widest">Add a customer</span>
                </div>
                <div className="space-y-4">
                  <FormField label="Invoice number" value={formData.invoiceNumber} onChange={(v) => setFormData((p: any) => ({ ...p, invoiceNumber: v }))} />
                  <FormField label="P.O./S.O. number" value={formData.poNumber} onChange={(v) => setFormData((p: any) => ({ ...p, poNumber: v }))} />
                  <FormDate label="Invoice date" value={formData.date} onChange={(v) => setFormData((p: any) => ({ ...p, date: v }))} />
                  <div className="space-y-1">
                    <FormDate label="Payment due" value={formData.dueDate} onChange={(v) => setFormData((p: any) => ({ ...p, dueDate: v }))} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight text-right pr-4">On Receipt</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-4">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50">
                    <Settings2 size={12} />
                    Edit columns
                  </button>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#edf2f7]">
                      <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <th className="py-4 px-6 w-1/2">Items</th>
                        <th className="py-4 px-6 text-right">Quantity</th>
                        <th className="py-4 px-6 text-right">Price</th>
                        <th className="py-4 px-6 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {formData.lineItems.map(item => (
                        <tr key={item.id}>
                          <td className="py-4 px-6 text-sm font-bold text-gray-800">{item.description || "\u2014"}</td>
                          <td className="py-4 px-6 text-right text-sm font-bold text-gray-800">{item.quantity}</td>
                          <td className="py-4 px-6 text-right text-sm font-bold text-gray-800">{formatCurrency(item.price)}</td>
                          <td className="py-4 px-6 text-right text-sm font-black text-gray-900">{formatCurrency(item.quantity * item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={addItem} className="w-full py-4 text-sm font-black text-blue-600 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-all border-t border-gray-50">
                    <Plus size={16} />
                    Add an item
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 px-6">
                <div className="w-[300px] space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">Subtotal</span>
                    <span className="font-black text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <button className="w-full flex items-center justify-end gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">
                    <Plus size={12} />
                    Add a discount
                  </button>
                  <div className="flex justify-between items-center pt-2">
                    <select className="bg-gray-50 px-3 py-1 rounded text-[10px] font-black text-gray-500 border border-gray-200 outline-none">
                      <option>CAD ($) - Canadian dollar</option>
                    </select>
                    <span className="text-xl font-black text-gray-900">{formatCurrency(total)}</span>
                  </div>
                  <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-black text-gray-900 uppercase tracking-tight">Amount Due</span>
                    <span className="text-xl font-black text-gray-900">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notes / Terms</label>
                <textarea placeholder="Enter notes or terms of service that are visible to your customer" className="w-full h-24 p-4 bg-white border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none resize-none placeholder:italic placeholder:text-gray-300" />
              </div>
            </div>
          </div>

          <CollapsibleButton label="Footer" />
          <AttachmentSection />

          <div className="flex justify-center gap-4 py-12">
            <button className="px-8 py-2.5 border border-blue-600 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-50 transition-all">Preview</button>
            <div className="flex shadow-xl shadow-blue-200/50">
              <button onClick={() => { toast.success("Invoice created successfully"); onDone(); }} className="px-10 py-2.5 bg-blue-600 text-white rounded-l-full text-sm font-bold hover:bg-blue-700 transition-all">Save and continue</button>
              <button className="px-4 bg-blue-700 text-white rounded-r-full hover:bg-blue-800 transition-all border-l border-blue-500"><ChevronDown size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
