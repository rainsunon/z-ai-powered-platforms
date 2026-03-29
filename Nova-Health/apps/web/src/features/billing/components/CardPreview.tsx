import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function CardPreview() {
  return (
    <Card className="aspect-[1.58/1] w-full rounded-3xl bg-gradient-to-br from-[#066e00] to-[#1dcc0d] text-white shadow-2xl border-none relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-fixed/20 rounded-full -ml-10 -mb-10 blur-2xl" />

      <CardContent className="p-8 flex flex-col justify-between h-full relative z-10">
        <div className="flex justify-between items-start">
          <div className="w-12 h-9 bg-surface-container-lowest/20 backdrop-blur rounded-lg" />
          <span className="material-symbols-outlined text-4xl opacity-80">contactless</span>
        </div>

        <div>
          <div className="text-2xl font-mono tracking-widest opacity-80 mb-6">
            •••• •••• •••• ••••
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] uppercase tracking-tighter opacity-60 font-bold mb-1">
                Card Holder
              </div>
              <div className="text-sm font-bold uppercase tracking-wider">Your Name Here</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-tighter opacity-60 font-bold mb-1">
                Expires
              </div>
              <div className="text-sm font-bold">-- / --</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
