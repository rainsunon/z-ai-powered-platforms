import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TotalExpensesCardProps {
  amount: number;
}

export function TotalExpensesCard({ amount }: TotalExpensesCardProps) {
  return (
    <Card className="md:col-span-2 bg-primary-gradient rounded-[2rem] p-8 text-white overflow-hidden relative shadow-lg border-0">
      <CardContent className="p-0 flex flex-col justify-between h-full">
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-80 mb-1 uppercase tracking-widest">
            Total Expenses (YTD)
          </p>
          <h3 className="text-5xl font-extrabold tracking-tighter">${amount.toFixed(2)}</h3>
        </div>
        <Badge className="mt-8 relative z-10 bg-white/10 text-white w-fit px-3 py-1.5 rounded-full backdrop-blur-md hover:bg-white/15">
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
          <span>12% more than last year</span>
        </Badge>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      </CardContent>
    </Card>
  );
}
