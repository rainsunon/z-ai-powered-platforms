import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useBillingStore } from '@/store/useBillingStore';
import { BillingStats } from './components/BillingStats';
import { InvoiceItem } from './components/InvoiceItem';
import { InsuranceSidebar } from './components/InsuranceSidebar';

export function Billing() {
  const { invoices } = useBillingStore();
  usePageTitle('Billing & Insurance');

  return (
    <div className="space-y-12">
      <PageHeader
        title="Billing & Insurance"
        subtitle="Manage your healthcare expenses, track claims, and view insurance coverage in our secure sanctuary."
        actions={
          <>
            <button className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">download</span> Download Statement
            </button>
            <button className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined">add</span> New Payment
            </button>
          </>
        }
      />

      <BillingStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          {/* Recent Invoices */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-headline font-bold">Recent Invoices</h4>
              <a className="text-primary font-bold text-sm hover:underline" href="#">View All</a>
            </div>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <InvoiceItem key={invoice.id} invoice={invoice} />
              ))}
            </div>
          </section>

          {/* Archive History */}
          <section className="space-y-4">
            <h4 className="text-2xl font-headline font-bold mb-6">Archive History</h4>
            <details className="group bg-surface-container-low rounded-[1.5rem] overflow-hidden" open>
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-bold text-lg">Fiscal Year 2024</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-6 pb-6 pt-2 space-y-2 border-t border-outline-variant/10">
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-on-surface-variant">12 Invoices Processed</span>
                  <span className="font-bold">$3,420.00 Total</span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-on-surface-variant">4 Active Claims</span>
                  <span className="text-primary font-bold">Reviewing</span>
                </div>
              </div>
            </details>

            <details className="group bg-surface-container-low rounded-[1.5rem] overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-bold text-lg">Fiscal Year 2023</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="px-6 pb-6 pt-2 space-y-2 border-t border-outline-variant/10">
                <p className="text-sm text-on-surface-variant">No pending items for this period.</p>
              </div>
            </details>
          </section>
        </div>

        <InsuranceSidebar />
      </div>
    </div>
  );
}
