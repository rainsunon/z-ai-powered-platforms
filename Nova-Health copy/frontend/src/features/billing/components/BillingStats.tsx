import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBillingStore } from '@/store/useBillingStore';

export function BillingStats() {
  const navigate = useNavigate();
  const { totalExpenses, pendingAmount, insuranceCoverage } = useBillingStore();

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-2 bg-primary-gradient rounded-[2rem] p-8 text-white flex flex-col justify-between overflow-hidden relative shadow-lg">
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-80 mb-1 uppercase tracking-widest">Total Expenses (YTD)</p>
          <h3 className="text-5xl font-extrabold tracking-tighter">${totalExpenses.toFixed(2)}</h3>
        </div>
        <div className="mt-8 relative z-10 flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
          <span>12% more than last year</span>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-surface-container-high rounded-[2rem] p-8 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">Pending</p>
          <h3 className="text-3xl font-bold mt-1">${pendingAmount.toFixed(2)}</h3>
          <div className="flex items-center gap-2 text-error text-sm font-bold mt-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>2 Invoices Due</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/billing/bulk-pay/review')}
          className="mt-6 w-full py-3 px-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined">payments</span>
          Pay All Pending
        </button>
      </div>

      <div className="bg-surface-container rounded-[2rem] p-8 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">Insurance Applied</p>
          <h3 className="text-3xl font-bold mt-1">{insuranceCoverage}%</h3>
        </div>
        <div className="flex items-center gap-2 text-primary text-sm font-bold">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Avg. Coverage</span>
        </div>
      </div>
    </section>
  );
}
