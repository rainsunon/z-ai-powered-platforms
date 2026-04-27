import React from "react";
import { formatCurrency } from "@/src/lib/utils";
import { Receipt } from "lucide-react";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
}

interface LineItemsTableProps {
  items: LineItem[];
  showHeader?: boolean;
  emptyMessage?: string;
}

export function LineItemsTable({
  items,
  showHeader = true,
  emptyMessage = "No items found",
}: LineItemsTableProps) {
  const getPrice = (item: LineItem) => item.unitPrice || item.price || 0;
  const getTotal = (item: LineItem) => item.quantity * getPrice(item);

  if (!items || items.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <Receipt size={24} className="text-gray-200" />
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-left">
        {showHeader && (
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] uppercase font-black text-gray-400 tracking-[0.15em]">
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Rate</th>
              <th className="py-3 px-4 text-right">Subtotal</th>
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-50/80">
          {items.map((item) => (
            <tr
              key={item.id}
              className="text-sm hover:bg-gray-50/30 transition-colors"
            >
              <td className="py-3 px-4 font-semibold text-gray-700">
                {item.description}
              </td>
              <td className="py-3 px-4 text-center font-mono text-gray-500">
                {item.quantity}
              </td>
              <td className="py-3 px-4 text-right text-gray-500">
                {formatCurrency(getPrice(item))}
              </td>
              <td className="py-3 px-4 text-right font-black text-gray-900">
                {formatCurrency(getTotal(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface LineItemsTotalProps {
  items: LineItem[];
  tax?: number;
  discount?: number;
}

export function LineItemsTotal({ items, tax = 0, discount = 0 }: LineItemsTotalProps) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.unitPrice || item.price || 0;
    return sum + item.quantity * price;
  }, 0);

  const taxAmount = subtotal * (tax / 100);
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + taxAmount - discountAmount;

  return (
    <div className="w-full max-w-[280px] space-y-2.5 bg-gray-50/30 p-4 rounded-lg">
      <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
        <span>Subtotal:</span>
        <span className="tabular-nums">{formatCurrency(subtotal)}</span>
      </div>
      
      {tax > 0 && (
        <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
          <span>Tax ({tax}%):</span>
          <span className="tabular-nums">{formatCurrency(taxAmount)}</span>
        </div>
      )}
      
      {discount > 0 && (
        <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
          <span>Discount ({discount}%):</span>
          <span className="tabular-nums text-red-600">-{formatCurrency(discountAmount)}</span>
        </div>
      )}
      
      <div className="h-px bg-gray-200 my-2" />
      
      <div className="flex justify-between items-center text-sm font-black text-gray-900">
        <span>Total:</span>
        <span className="tabular-nums text-lg">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
