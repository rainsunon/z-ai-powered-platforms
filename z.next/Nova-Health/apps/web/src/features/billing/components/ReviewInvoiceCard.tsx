import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReviewInvoiceCardProps {
  invoiceId: string;
  title: string;
  serviceDate: string;
  amount: string;
  status: string;
  icon: string;
  iconColor?: string;
}

export function ReviewInvoiceCard({
  invoiceId,
  title,
  serviceDate,
  amount,
  status,
  icon,
  iconColor = 'text-primary',
}: ReviewInvoiceCardProps) {
  return (
    <Card className="rounded-[2rem] shadow-[0px_10px_30px_rgba(21,30,18,0.03)] border-outline-variant/10 hover:translate-y-[-2px] transition-all group">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center ${iconColor}`}>
            <span className="material-symbols-outlined text-3xl">{icon}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">
              {invoiceId}
            </p>
            <h3 className="text-lg font-bold text-on-surface">{title}</h3>
            <p className="text-sm text-on-surface-variant">Service Date: {serviceDate}</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xl font-black text-on-surface">{amount}</p>
          <Badge className="bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/10">
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
