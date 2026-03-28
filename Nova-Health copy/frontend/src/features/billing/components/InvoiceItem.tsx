import React from 'react';
import { type Invoice } from '@/store/useBillingStore';

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
    <div className={`bg-surface-container-low p-6 rounded-[1.5rem] flex flex-wrap items-center justify-between gap-4 ${style.rowBorder} ${style.opacity} transition-all`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center`}>
          <span className="material-symbols-outlined">{invoice.icon}</span>
        </div>
        <div>
          <p className="font-bold">{invoice.title}</p>
          <p className="text-xs text-on-surface-variant">Inv #{invoice.id} • {invoice.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="font-bold text-lg">${invoice.amount.toFixed(2)}</p>
          <span className={`text-[10px] font-extrabold ${style.label} uppercase tracking-widest`}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
        <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
          <span className="material-symbols-outlined">download</span>
        </button>
        {style.btnLabel ? (
          <button className={`${style.btnClass} font-bold px-6 py-2 rounded-full text-sm transition-opacity`}>
            {style.btnLabel}
          </button>
        ) : (
          <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">receipt_long</span>
          </button>
        )}
      </div>
    </div>
  );
}
