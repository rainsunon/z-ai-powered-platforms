import React from 'react';
import { type Invoice } from '@/store/useBillingStore';
import { InvoiceItem } from './InvoiceItem';

interface RecentInvoicesProps {
  invoices: Invoice[];
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-2xl font-headline font-bold">Recent Invoices</h4>
        <a className="text-primary font-bold text-sm hover:underline" href="#">
          View All
        </a>
      </div>
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <InvoiceItem key={invoice.id} invoice={invoice} />
        ))}
      </div>
    </section>
  );
}
