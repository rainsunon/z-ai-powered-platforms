import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';

const transactions = [
  { id: 'TXN-2024-0812', date: 'Oct 25, 2024', description: 'Specialist Consultation — Dr. Mitchell', amount: 150.00, status: 'completed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0798', date: 'Oct 12, 2024', description: 'Monthly Prescription Refill', amount: 42.50, status: 'completed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0785', date: 'Sep 28, 2024', description: 'Lab Work — Blood Panel', amount: 85.00, status: 'completed', method: 'Chase ••8812' },
  { id: 'TXN-2024-0771', date: 'Sep 15, 2024', description: 'Dental Cleaning & X-Ray', amount: 425.00, status: 'failed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0760', date: 'Sep 01, 2024', description: 'Physical Therapy — Session 4/6', amount: 75.00, status: 'completed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0744', date: 'Aug 22, 2024', description: 'Annual Wellness Exam', amount: 25.00, status: 'completed', method: 'Visa ••4242' },
  { id: 'TXN-2024-0731', date: 'Aug 10, 2024', description: 'Physical Therapy — Session 3/6', amount: 75.00, status: 'completed', method: 'Chase ••8812' },
  { id: 'TXN-2024-0718', date: 'Jul 30, 2024', description: 'Dermatology Follow-up', amount: 60.00, status: 'refunded', method: 'Visa ••4242' },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'bg-secondary-container text-secondary' },
  failed: { label: 'Failed', className: 'bg-error-container text-error' },
  refunded: { label: 'Refunded', className: 'bg-tertiary-container text-on-tertiary-container' },
  pending: { label: 'Pending', className: 'bg-surface-variant text-on-surface-variant' },
};

export function PaymentHistory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.status === filter);

  const totalPaid = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalCount = transactions.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
        <button onClick={() => navigate('/billing')} className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Billing
        </button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium">Payment History</span>
      </div>

      {/* Hero Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">Payment History</h2>
          <p className="text-on-surface-variant mt-2 max-w-lg">Complete record of all transactions processed through your account.</p>
        </div>
        <button className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined">download</span> Export CSV
        </button>
      </section>

      {/* Summary Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-primary-gradient rounded-[2rem] p-8 text-white flex flex-col justify-between overflow-hidden relative shadow-lg">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-1 uppercase tracking-widest">Total Paid (YTD)</p>
            <h3 className="text-5xl font-extrabold tracking-tighter">${totalPaid.toFixed(2)}</h3>
          </div>
          <div className="mt-8 relative z-10 flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{totalCount} successful transactions</span>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-surface-container-high rounded-[2rem] p-8 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">Failed</p>
            <h3 className="text-3xl font-bold mt-1">1</h3>
            <div className="flex items-center gap-2 text-error text-sm font-bold mt-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>Requires action</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container rounded-[2rem] p-8 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">Refunded</p>
            <h3 className="text-3xl font-bold mt-1">$60.00</h3>
          </div>
          <div className="flex items-center gap-2 text-primary text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">undo</span>
            <span>1 refund processed</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-surface-container p-1.5 rounded-full w-fit">
        {['all', 'completed', 'failed', 'refunded'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all capitalize ${
              filter === f
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {f === 'all' ? 'All Transactions' : f}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <VirtualTransactionTable filtered={filtered} statusConfig={statusConfig} transactions={transactions} />
    </div>
  );
}

function VirtualTransactionTable({
  filtered,
  statusConfig,
  transactions,
}: {
  filtered: typeof transactions;
  statusConfig: Record<string, { label: string; className: string }>;
  transactions: typeof filtered;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const ROW_HEIGHT = 68;

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant/15">
              <th className="text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-8 py-5">Transaction</th>
              <th className="text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-5">Date</th>
              <th className="text-left font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-5">Method</th>
              <th className="text-right font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-4 py-5">Amount</th>
              <th className="text-center font-bold text-on-surface-variant uppercase tracking-widest text-[10px] px-8 py-5">Status</th>
            </tr>
          </thead>
        </table>
        <div
          ref={parentRef}
          className="overflow-y-auto hide-scrollbar"
          style={{ maxHeight: 480 }}
        >
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td colSpan={5} style={{ padding: 0 }}>
                  <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
                    {virtualizer.getVirtualItems().map((virtualRow) => {
                      const txn = filtered[virtualRow.index];
                      const cfg = statusConfig[txn.status];
                      return (
                        <div
                          key={txn.id}
                          className="absolute top-0 left-0 w-full"
                          style={{
                            height: virtualRow.size,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          <table className="w-full text-sm">
                            <tbody>
                              <tr className="hover:bg-surface-container-low/50 transition-colors">
                                <td className="px-8 py-5">
                                  <p className="font-bold text-on-surface">{txn.description}</p>
                                  <p className="text-xs text-on-surface-variant mt-0.5">{txn.id}</p>
                                </td>
                                <td className="px-4 py-5 text-on-surface-variant">{txn.date}</td>
                                <td className="px-4 py-5">
                                  <span className="flex items-center gap-2 text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[16px]">credit_card</span>
                                    {txn.method}
                                  </span>
                                </td>
                                <td className="px-4 py-5 text-right font-headline font-bold">${txn.amount.toFixed(2)}</td>
                                <td className="px-8 py-5 text-center">
                                  <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${cfg.className}`}>
                                    {cfg.label}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-8 py-5 border-t border-outline-variant/15">
        <p className="text-xs text-on-surface-variant">Showing {filtered.length} of {transactions.length} transactions</p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors" disabled>
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded-full hover:bg-surface-container-high text-on-surface-variant text-xs font-bold flex items-center justify-center transition-colors">2</button>
          <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
