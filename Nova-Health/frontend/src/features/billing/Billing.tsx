import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useBillingStore } from '@/store/useBillingStore';
import { BillingStats } from './components/BillingStats';
import { RecentInvoices } from './components/RecentInvoices';
import { ArchiveHistory } from './components/ArchiveHistory';
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
            <Button
              variant="secondary"
              className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest gap-2 h-auto"
            >
              <span className="material-symbols-outlined">download</span> Download Statement
            </Button>
            <Button className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg hover:opacity-95 gap-2 h-auto">
              <span className="material-symbols-outlined">add</span> New Payment
            </Button>
          </>
        }
      />

      <BillingStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          <RecentInvoices invoices={invoices} />
          <ArchiveHistory />
        </div>
        <InsuranceSidebar />
      </div>
    </div>
  );
}
