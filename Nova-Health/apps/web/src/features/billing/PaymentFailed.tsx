import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TransactionDetailsGrid } from './components/TransactionDetailsGrid';
import { SupportBox } from './components/SupportBox';

const INVOICE = {
  invoiceNumber: '#NH-2024-812',
  amountDue: '$839.50',
  date: 'Oct 25, 2024',
};

export function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12 w-full space-y-12">
        {/* Notification Shell */}
        <Card className="rounded-xl shadow-[0px_20px_40px_rgba(21,30,18,0.06)] relative overflow-hidden border-0">
          {/* Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-container" />

          <CardContent className="p-8 md:p-12">
            {/* Icon & Header */}
            <div className="mb-10 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-error-container text-error mb-6">
                <span className="material-symbols-outlined text-3xl">error_outline</span>
              </div>
              <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight mb-4">
                Payment Update: Action Required
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                We're writing to let you know that the recent payment attempt for your health
                services was unsuccessful. Please review your billing details to maintain
                uninterrupted access to your care team.
              </p>
            </div>

            <div className="mb-10">
              <TransactionDetailsGrid invoice={INVOICE} />
            </div>

            {/* Call to Action */}
            <div className="flex flex-col items-center gap-6">
              <Button
                onClick={() => navigate('/billing/bulk-pay/method')}
                className="w-full md:w-auto px-10 py-4 h-auto bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Update Payment Method &amp; Retry
              </Button>
              <Button
                variant="link"
                onClick={() => navigate('/billing')}
                className="font-headline font-semibold text-primary underline decoration-primary/30 underline-offset-4 p-0 h-auto"
              >
                View Billing Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <SupportBox />
      </div>
    </div>
  );
}
