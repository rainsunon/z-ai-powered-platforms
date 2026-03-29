import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBillingStore } from '@/store/useBillingStore';
import { TotalExpensesCard } from './TotalExpensesCard';
import { PendingCard } from './PendingCard';
import { InsuranceCard } from './InsuranceCard';

export function BillingStats() {
  const navigate = useNavigate();
  const { totalExpenses, pendingAmount, insuranceCoverage } = useBillingStore();

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <TotalExpensesCard amount={totalExpenses} />
      <PendingCard amount={pendingAmount} onPayAll={() => navigate('/billing/bulk-pay/review')} />
      <InsuranceCard coverage={insuranceCoverage} />
    </section>
  );
}
