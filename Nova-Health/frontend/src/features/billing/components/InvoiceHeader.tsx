import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InvoiceHeaderProps {
  onPayNow: () => void;
}

export function InvoiceHeader({ onPayNow }: InvoiceHeaderProps) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start gap-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">
            Specialist Consultation
          </h2>
          <Badge className="bg-tertiary-container text-on-tertiary-container text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full">
            Pending
          </Badge>
        </div>
        <p className="text-on-surface-variant mt-2">
          Invoice #NH-89245 • Issued Oct 05, 2024 • Due Nov 04, 2024
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="bg-surface-container-high text-primary font-bold px-6 py-3 rounded-full hover:bg-surface-container-highest gap-2 h-auto"
        >
          <span className="material-symbols-outlined">download</span> Download PDF
        </Button>
        <Button
          onClick={onPayNow}
          className="primary-gradient text-white font-bold px-8 py-3 rounded-full shadow-lg hover:opacity-95 gap-2 h-auto"
        >
          <span className="material-symbols-outlined">payments</span> Pay Now
        </Button>
      </div>
    </section>
  );
}
