import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { InvoiceHeader } from './components/InvoiceHeader';
import { ServiceBreakdown } from './components/ServiceBreakdown';
import { CostSummary } from './components/CostSummary';
import { ProviderNotes } from './components/ProviderNotes';
import { ProviderInfoCard } from './components/ProviderInfoCard';
import { InsuranceCoverageCard } from './components/InsuranceCoverageCard';
import { PaymentOptionsCard } from './components/PaymentOptionsCard';

export function BillingDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <Breadcrumb items={[{ label: 'Billing', to: '/billing' }, { label: 'Invoice Detail' }]} />

      <InvoiceHeader onPayNow={() => navigate('/billing/bulk-pay/method')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ServiceBreakdown />
          <CostSummary />
          <ProviderNotes />
        </div>

        <div className="space-y-8">
          <ProviderInfoCard />
          <InsuranceCoverageCard />
          <PaymentOptionsCard
            onPayNow={() => navigate('/billing/bulk-pay/method')}
            onSetupPlan={() => navigate('/billing/bulk-pay/schedule')}
          />
        </div>
      </div>
    </div>
  );
}
