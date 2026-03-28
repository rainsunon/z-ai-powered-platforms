import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StepperBar } from './components/StepperBar';
import { InstallmentSummaryCard } from './components/InstallmentSummaryCard';
import { InstallmentItem } from './components/InstallmentItem';
import { PaymentMethodSidebar } from './components/PaymentMethodSidebar';

const PAYMENTS: {
  label: string;
  dueDate: string;
  amount: string;
  status: 'due-today' | 'upcoming';
}[] = [
  { label: 'Payment 1', dueDate: 'Due Today, Oct 24', amount: '$173.63', status: 'due-today' },
  { label: 'Payment 2', dueDate: 'Nov 24, 2024', amount: '$173.63', status: 'upcoming' },
  { label: 'Payment 3', dueDate: 'Dec 24, 2024', amount: '$173.63', status: 'upcoming' },
  { label: 'Payment 4', dueDate: 'Jan 24, 2025', amount: '$173.61', status: 'upcoming' },
];

export function InstallmentSchedule() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      <StepperBar step={2.5} totalSteps={3} label="Installments" />

      <div className="px-6 md:px-12 py-8 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Summary & Schedule */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">
                Payment Plan Schedule
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Review your installment breakdown before confirming your healthcare plan
                subscription.
              </p>
            </div>

            <InstallmentSummaryCard total="$694.50" installmentCount={4} />

            <div className="space-y-4">
              <h3 className="text-xl font-bold px-2">Upcoming Payments</h3>
              {PAYMENTS.map((p, i) => (
                <InstallmentItem key={i} index={i + 1} {...p} />
              ))}
            </div>
          </div>

          <PaymentMethodSidebar
            firstPaymentAmount="$173.63"
            onChangeMethod={() => navigate('/billing/bulk-pay/method')}
            onConfirm={() => navigate('/billing/payment-confirmed')}
            onGoBack={() => navigate(-1 as any)}
          />
        </div>
      </div>
    </div>
  );
}
