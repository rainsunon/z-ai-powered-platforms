import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { type Invoice } from '@/store/useBillingStore';
import { InvoiceIcon } from './InvoiceIcon';
import { InvoiceActions } from './InvoiceActions';

interface InvoiceItemProps {
  invoice: Invoice;
}

const statusStyles = {
  overdue: {
    iconBg: 'bg-error-container text-error',
    label: 'text-error',
    btnClass: 'bg-error text-white shadow-md hover:opacity-90',
    btnLabel: 'Pay Now',
    rowBorder: 'border-transparent hover:border-error/20',
    opacity: '',
  },
  pending: {
    iconBg: 'bg-surface-variant text-on-surface-variant',
    label: 'text-on-surface-variant',
    btnClass: 'bg-surface-container-high text-on-surface-variant',
    btnLabel: 'View Details',
    rowBorder: '',
    opacity: '',
  },
  paid: {
    iconBg: 'bg-secondary-container text-secondary',
    label: 'text-secondary',
    btnClass: '',
    btnLabel: '',
    rowBorder: '',
    opacity: 'opacity-75 grayscale-[0.5] hover:opacity-100 hover:grayscale-0',
  },
};

export function InvoiceItem({ invoice }: InvoiceItemProps) {
  const style = statusStyles[invoice.status];

  return (
    <Card className={`bg-surface-container-low rounded-[1.5rem] ${style.rowBorder} ${style.opacity} transition-all border-0`}>
      <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <InvoiceIcon icon={invoice.icon} className={style.iconBg} />
          <div>
            <p className="font-bold">{invoice.title}</p>
            <p className="text-xs text-on-surface-variant">Inv #{invoice.id} • {invoice.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="font-bold text-lg">${invoice.amount.toFixed(2)}</p>
            <Badge variant="outline" className={`${style.label} text-[10px] font-extrabold uppercase tracking-widest border-0 px-0`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Badge>
          </div>
          <InvoiceActions btnClass={style.btnClass} btnLabel={style.btnLabel} />
        </div>
      </CardContent>
    </Card>
  );
}
