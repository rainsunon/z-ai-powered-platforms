import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface InvoiceInfo {
  invoiceNumber: string;
  amountDue: string;
  date: string;
}

interface TransactionDetailsGridProps {
  invoice: InvoiceInfo;
  cardBrand?: string;
  cardLast4?: string;
}

export function TransactionDetailsGrid({
  invoice,
  cardBrand = 'Visa',
  cardLast4 = '4242',
}: TransactionDetailsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Invoice Details */}
      <Card className="bg-surface-container-low rounded-xl border-0">
        <CardContent className="p-6">
          <h3 className="font-headline font-bold text-primary mb-4 text-sm uppercase tracking-widest">
            Invoice Details
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm">Invoice Number</span>
              <span className="font-semibold font-headline">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm">Amount Due</span>
              <span className="font-extrabold text-xl font-headline">{invoice.amountDue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-sm">Date</span>
              <span className="font-semibold">{invoice.date}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="bg-surface-container rounded-xl border-0">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-headline font-bold text-primary mb-4 text-sm uppercase tracking-widest">
              Payment Method
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-surface-container-highest rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">credit_card</span>
              </div>
              <span className="font-semibold">
                {cardBrand} ending in {cardLast4}
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Separator className="mb-4 bg-outline-variant/15" />
            <p className="text-xs text-on-surface-variant italic">
              Common issues include card expiration, temporary blocks, or insufficient funds.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
