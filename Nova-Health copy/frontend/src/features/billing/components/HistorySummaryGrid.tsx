import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface HistorySummaryGridProps {
  totalPaid: number;
  successCount: number;
  failedCount: number;
  refundedAmount: number;
  refundedCount: number;
}

export function HistorySummaryGrid({
  totalPaid,
  successCount,
  failedCount,
  refundedAmount,
  refundedCount,
}: HistorySummaryGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Total Paid Hero */}
      <Card className="md:col-span-2 bg-primary-gradient rounded-[2rem] text-white border-0 shadow-lg overflow-hidden relative">
        <CardContent className="p-8 flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-80 mb-1 uppercase tracking-widest">
              Total Paid (YTD)
            </p>
            <h3 className="text-5xl font-extrabold tracking-tighter">
              ${totalPaid.toFixed(2)}
            </h3>
          </div>
          <div className="mt-8 relative z-10 flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successCount} successful transactions</span>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </CardContent>
      </Card>

      {/* Failed */}
      <Card className="bg-surface-container-high rounded-[2rem] border-0">
        <CardContent className="p-8 flex flex-col justify-between h-full">
          <div>
            <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">
              Failed
            </p>
            <h3 className="text-3xl font-bold mt-1">{failedCount}</h3>
            {failedCount > 0 && (
              <div className="flex items-center gap-2 text-error text-sm font-bold mt-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>Requires action</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refunded */}
      <Card className="bg-surface-container rounded-[2rem] border-0">
        <CardContent className="p-8 flex flex-col justify-between h-full">
          <div>
            <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">
              Refunded
            </p>
            <h3 className="text-3xl font-bold mt-1">${refundedAmount.toFixed(2)}</h3>
          </div>
          <div className="flex items-center gap-2 text-primary text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">undo</span>
            <span>
              {refundedCount} refund{refundedCount !== 1 ? 's' : ''} processed
            </span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
