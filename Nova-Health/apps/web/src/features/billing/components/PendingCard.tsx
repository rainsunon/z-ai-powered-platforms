import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PendingCardProps {
  amount: number;
  onPayAll: () => void;
}

export function PendingCard({ amount, onPayAll }: PendingCardProps) {
  return (
    <Card className="bg-surface-container-high rounded-[2rem] p-8 border-0">
      <CardContent className="p-0 flex flex-col justify-between h-full">
        <div>
          <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest">
            Pending
          </p>
          <h3 className="text-3xl font-bold mt-1">${amount.toFixed(2)}</h3>
          <div className="flex items-center gap-2 text-error text-sm font-bold mt-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>2 Invoices Due</span>
          </div>
        </div>
        <Button
          onClick={onPayAll}
          className="mt-6 w-full py-3 px-4 rounded-2xl font-bold gap-2 shadow-sm h-auto"
        >
          <span className="material-symbols-outlined">payments</span>
          Pay All Pending
        </Button>
      </CardContent>
    </Card>
  );
}
