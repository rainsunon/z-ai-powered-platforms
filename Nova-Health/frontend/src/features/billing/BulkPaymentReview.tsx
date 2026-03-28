import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StepperBar } from './components/StepperBar';
import { ReviewInvoiceCard } from './components/ReviewInvoiceCard';
import { InsuranceVerifiedCard } from './components/InsuranceVerifiedCard';
import { ReviewSummaryPanel } from './components/ReviewSummaryPanel';

const INVOICES = [
  {
    invoiceId: '#NH-2024-8721',
    title: 'General Consultation',
    serviceDate: 'Oct 12, 2024',
    amount: '$89.50',
    status: 'Pending',
    icon: 'description',
    iconColor: 'text-primary',
  },
  {
    invoiceId: '#NH-2024-8231',
    title: 'Specialized Lab Panel',
    serviceDate: 'Sep 28, 2024',
    amount: '$750.00',
    status: 'Pending',
    icon: 'biotech',
    iconColor: 'text-secondary',
  },
] as const;

const SUMMARY_ITEMS = [
  { label: 'Subtotal (2 Invoices)', value: '$839.50' },
  { label: 'Insurance Coverage', value: '-$145.00', highlight: true, icon: 'info' },
  { label: 'Processing Fee', value: '$0.00' },
];

export function BulkPaymentReview() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      <StepperBar step={1} totalSteps={3} label="Review" />

      <div className="px-6 md:px-12 py-8 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Invoice List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                Selected Invoices
                <Badge variant="secondary" className="bg-secondary-container text-on-secondary-container text-sm font-medium px-2 py-0.5 rounded-full">
                  {INVOICES.length}
                </Badge>
              </h2>
              <Button variant="link" className="text-sm font-bold text-primary p-0 h-auto">
                Edit Selection
              </Button>
            </div>

            <div className="space-y-4">
              {INVOICES.map((inv) => (
                <ReviewInvoiceCard key={inv.invoiceId} {...inv} />
              ))}
            </div>

            <InsuranceVerifiedCard />
          </div>

          <ReviewSummaryPanel
            items={SUMMARY_ITEMS}
            total="$694.50"
            savingsLabel="Save $145.00"
            onContinue={() => navigate('/billing/bulk-pay/method')}
          />
        </div>
      </div>
    </div>
  );
}
