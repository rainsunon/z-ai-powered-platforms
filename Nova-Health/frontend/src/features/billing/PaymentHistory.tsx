import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/Breadcrumb';
import { HistorySummaryGrid } from './components/HistorySummaryGrid';
import { StatusFilterBar } from './components/StatusFilterBar';
import { VirtualTransactionTable, type Transaction } from './components/VirtualTransactionTable';

const transactions: Transaction[] = [
  { id: 'TXN-2024-0812', date: 'Oct 25, 2024', description: 'Specialist Consultation — Dr. Mitchell', amount: 150.00, status: 'completed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0798', date: 'Oct 12, 2024', description: 'Monthly Prescription Refill', amount: 42.50, status: 'completed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0785', date: 'Sep 28, 2024', description: 'Lab Work — Blood Panel', amount: 85.00, status: 'completed', method: 'Chase ••8812' },
  { id: 'TXN-2024-0771', date: 'Sep 15, 2024', description: 'Dental Cleaning & X-Ray', amount: 425.00, status: 'failed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0760', date: 'Sep 01, 2024', description: 'Physical Therapy — Session 4/6', amount: 75.00, status: 'completed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0744', date: 'Aug 22, 2024', description: 'Annual Wellness Exam', amount: 25.00, status: 'completed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0731', date: 'Aug 10, 2024', description: 'Physical Therapy — Session 3/6', amount: 75.00, status: 'completed', method: 'Chase ••8812' },
  { id: 'TXN-2024-0718', date: 'Jul 30, 2024', description: 'Dermatology Follow-up', amount: 60.00, status: 'refunded', method: 'Visa ••4242' },
];

export function PaymentHistory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.status === filter);
  const completed = transactions.filter(t => t.status === 'completed');
  const totalPaid = completed.reduce((s, t) => s + t.amount, 0);
  const failedCount = transactions.filter(t => t.status === 'failed').length;
  const refunded = transactions.filter(t => t.status === 'refunded');
  const refundedAmount = refunded.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      <Breadcrumb
        items={[
          { label: 'Billing', to: '/billing' },
          { label: 'Payment History' },
        ]}
      />

      {/* Hero Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">
            Payment History
          </h2>
          <p className="text-on-surface-variant mt-2 max-w-lg">
            Complete record of all transactions processed through your account.
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded-full px-6 py-3 h-auto font-bold bg-surface-container-high hover:bg-surface-container-highest text-primary"
        >
          <span className="material-symbols-outlined">download</span> Export CSV
        </Button>
      </section>

      <HistorySummaryGrid
        totalPaid={totalPaid}
        successCount={completed.length}
        failedCount={failedCount}
        refundedAmount={refundedAmount}
        refundedCount={refunded.length}
      />

      <StatusFilterBar value={filter} onChange={setFilter} />

      <VirtualTransactionTable filtered={filtered} totalCount={transactions.length} />
    </div>
  );
}
