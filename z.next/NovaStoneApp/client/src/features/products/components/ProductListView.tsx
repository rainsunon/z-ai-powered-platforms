import React from "react";
import { Pencil, Trash2, Package } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";
import { toast } from "sonner";
import { ProductService } from "../types";

const mockProducts: ProductService[] = [
  { id: "1", name: "IT consulting", price: 100.00, sellThis: true, buyThis: false, salesTax: "HST" },
  { id: "2", name: "service", description: "IT consulting", price: 96.32, sellThis: true, buyThis: false, salesTax: "HST" },
];

interface ProductListViewProps {
  products: ProductService[];
  onCreateNew: () => void;
  onDelete: (id: string) => void;
}

export function ProductListView({ products, onCreateNew, onDelete }: ProductListViewProps) {
  return (
    <div className="min-h-screen bg-white p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Products & Services (Sales)</h2>
          <button onClick={onCreateNew} className="px-8 py-2.5 bg-[#0077c5] text-white rounded-full text-sm font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95">Add a product or service</button>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-sm font-bold text-gray-700">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6 text-right">Price</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6"><div><p className="text-sm font-bold text-gray-900">{product.name}</p>{product.description && <p className="text-xs text-gray-500 mt-0.5">{product.description}</p>}</div></td>
                    <td className="py-4 px-6 text-right"><div><p className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</p>{product.salesTax && <p className="text-xs text-gray-500 mt-0.5">+ {product.salesTax}</p>}</div></td>
                    <td className="py-4 px-6"><div className="flex items-center justify-end gap-3"><button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button><button onClick={() => onDelete(product.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="py-16 text-center"><div className="flex flex-col items-center gap-4"><div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><Package size={32} className="text-gray-400" /></div><div><p className="text-lg font-bold text-gray-900 mb-2">No products or services yet</p><p className="text-sm text-gray-500 mb-4">Get started by adding your first product or service</p><button onClick={onCreateNew} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Add a product or service</button></div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
