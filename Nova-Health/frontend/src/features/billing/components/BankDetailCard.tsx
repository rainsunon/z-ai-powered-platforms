import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function BankDetailCard() {
  return (
    <div className="md:col-span-5 relative">
      <Card className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0px_20px_40px_rgba(21,30,18,0.06)] border-white/40 relative z-10">
        <CardContent className="p-0 space-y-6">
          <div className="flex justify-between items-start">
            <div className="bg-surface-container p-3 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
            </div>
            <Badge className="bg-secondary-fixed text-on-secondary-container text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              Active
            </Badge>
          </div>

          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              Financial Institution
            </p>
            <h3 className="text-2xl font-black text-on-surface tracking-tight">CHASE BANK</h3>
          </div>

          <Separator className="bg-outline-variant/20" />

          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              Account Number
            </p>
            <p className="text-xl font-medium text-on-surface flex items-center gap-1 tracking-widest">
              •••• •••• •••• 8812
            </p>
          </div>

          <div className="bg-surface-container-lowest/50 rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">verified_user</span>
            <span className="text-xs font-semibold text-on-surface-variant">
              Instant verification complete
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary-fixed opacity-20 blur-3xl rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-container opacity-10 blur-2xl rounded-full" />
    </div>
  );
}
