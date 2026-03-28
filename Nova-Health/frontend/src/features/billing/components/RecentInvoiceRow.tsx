import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface RecentInvoiceRowProps {
  icon: string;
  title: string;
  paymentMethod: string;
  amount: string;
}

export function RecentInvoiceRow({
  icon,
  title,
  paymentMethod,
  amount,
}: RecentInvoiceRowProps) {
  return (
    <Card className="rounded-[2rem] border-0 bg-surface-container hover:bg-surface-container-high transition-colors group">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-surface-container-lowest rounded-2xl text-primary">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <p className="font-headline font-bold text-on-surface text-sm">{title}</p>
            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              {paymentMethod}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-headline font-black text-on-surface">{amount}</p>
          <button className="text-[10px] font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-xs">download</span>
            PDF
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
