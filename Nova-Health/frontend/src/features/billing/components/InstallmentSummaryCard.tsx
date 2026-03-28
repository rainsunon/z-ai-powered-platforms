import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InstallmentSummaryCardProps {
  total: string;
  installmentCount: number;
}

export function InstallmentSummaryCard({
  total,
  installmentCount,
}: InstallmentSummaryCardProps) {
  return (
    <Card className="bg-surface-container-low rounded-[2rem] border-0 relative overflow-hidden">
      <CardContent className="p-8">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-on-surface-variant font-medium mb-1">Total Bill Amount</p>
            <h2 className="text-5xl font-extrabold text-primary tracking-tighter">{total}</h2>
          </div>
          <Badge
            variant="secondary"
            className="bg-secondary-container text-on-secondary-container px-6 py-4 rounded-2xl h-auto flex items-center gap-3"
          >
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              calendar_today
            </span>
            <div className="text-left">
              <p className="text-xs uppercase font-bold tracking-wider opacity-80">Payment Plan</p>
              <p className="font-bold text-lg">{installmentCount} Interest-free payments</p>
            </div>
          </Badge>
        </div>
        {/* Aesthetic Background Shape */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </CardContent>
    </Card>
  );
}
