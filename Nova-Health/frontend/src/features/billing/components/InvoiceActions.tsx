import React from 'react';
import { Button } from '@/components/ui/button';

interface InvoiceActionsProps {
  btnClass?: string;
  btnLabel?: string;
}

export function InvoiceActions({ btnClass, btnLabel }: InvoiceActionsProps) {
  return (
    <>
      <Button variant="ghost" size="icon" className="text-primary rounded-full">
        <span className="material-symbols-outlined">download</span>
      </Button>
      {btnLabel ? (
        <Button className={`${btnClass} font-bold px-6 py-2 rounded-full text-sm h-auto`}>
          {btnLabel}
        </Button>
      ) : (
        <Button variant="ghost" size="icon" className="text-primary rounded-full">
          <span className="material-symbols-outlined">receipt_long</span>
        </Button>
      )}
    </>
  );
}
