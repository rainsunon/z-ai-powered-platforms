import React from "react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { toast } from "sonner";
import { ProductService } from "../types";

const mockProducts: ProductService[] = [
  { id: "1", name: "IT consulting", price: 100.00, sellThis: true, buyThis: false, salesTax: "HST" },
  { id: "2", name: "service", description: "IT consulting", price: 96.32, sellThis: true, buyThis: false, salesTax: "HST" },
];

interface ProductCreateViewProps {
  formData: { name: string; description: string; price: string; sellThis: boolean; buyThis: boolean; salesTax: string };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
}

export function ProductCreateView({ formData, setFormData, onSave }: ProductCreateViewProps) {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Add a Product or Service</h2>
          <p className="text-sm text-gray-600 leading-relaxed">Products and services that you buy from vendors are used as items on Bills to record those purchases, and the ones that you sell to customers are used as items on Invoices to record those sales.</p>
        </div>
        <div className="space-y-6">
          <FormFieldRow label="Name" required><input type="text" value={formData.name} onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" /></FormFieldRow>
          <FormFieldRow label="Description"><textarea value={formData.description} onChange={(e) => setFormData((p: any) => ({ ...p, description: e.target.value }))} rows={4} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none" /></FormFieldRow>
          <FormFieldRow label="Price"><input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData((p: any) => ({ ...p, price: e.target.value }))} className="w-48 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" /></FormFieldRow>
          <FormFieldRow label="Sell this"><div className="flex-1"><div className="flex items-start gap-3"><input type="checkbox" id="sellThis" checked={formData.sellThis} onChange={(e) => setFormData((p: any) => ({ ...p, sellThis: e.target.checked }))} className="mt-1 w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-100" /><label htmlFor="sellThis" className="text-sm text-gray-500">Allow this product or service to be added to Invoices.</label></div></div></FormFieldRow>
          <FormFieldRow label="Buy this"><div className="flex-1"><div className="flex items-start gap-3"><input type="checkbox" id="buyThis" checked={formData.buyThis} onChange={(e) => setFormData((p: any) => ({ ...p, buyThis: e.target.checked }))} className="mt-1 w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-100" /><label htmlFor="buyThis" className="text-sm text-gray-500">Allow this product or service to be added to Bills.</label></div></div></FormFieldRow>
          <FormFieldRow label="Sales tax"><input type="text" value={formData.salesTax} onChange={(e) => setFormData((p: any) => ({ ...p, salesTax: e.target.value }))} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" /></FormFieldRow>
          <div className="pt-6">
            <button onClick={onSave} disabled={!formData.name} className={cn("px-8 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg transition-all", formData.name ? "hover:bg-blue-700 active:scale-95" : "opacity-50 cursor-not-allowed")}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormFieldRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <label className="text-sm font-medium text-gray-700 w-32 pt-2">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}
