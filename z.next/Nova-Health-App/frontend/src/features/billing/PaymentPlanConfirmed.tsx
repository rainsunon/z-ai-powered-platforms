import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmedSummaryGrid, type SummaryItem } from './components/ConfirmedSummaryGrid';
import { ScheduleTable, type ScheduleRow } from './components/ScheduleTable';
import { PaymentMethodBanner } from './components/PaymentMethodBanner';

const SUMMARY_ITEMS: SummaryItem[] = [
  { label: 'Total Balance', value: '$694.50', subtitle: 'Fully amortized', variant: 'default' },
  { label: 'Installments', value: '4 Parts', subtitle: 'Monthly intervals', variant: 'accent' },
  { label: 'Interest Rate', value: '0% APR', subtitle: 'No hidden fees', variant: 'highlight' },
];

const SCHEDULE_ROWS: ScheduleRow[] = [
  { label: 'Payment 1', amount: '$173.63', dueDate: 'Today', status: 'paid' },
  { label: 'Payment 2', amount: '$173.63', dueDate: 'Nov 24, 2024', status: 'upcoming' },
  { label: 'Payment 3', amount: '$173.63', dueDate: 'Dec 24, 2024', status: 'upcoming' },
  { label: 'Payment 4', amount: '$173.61', dueDate: 'Jan 24, 2025', status: 'upcoming' },
];

const VISA_LOGO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAG2yCFiEtMWr6pjVqoZTX6BZiaJqjwyopbCbYydGIznXzKTyErd168PgMaRIIWOUssVikUDfBSRDVfYg1i0IBilrLEsKWTKEHV6NXTGlcGXTFBJN3A6jThrKQds5H6JN_b1NyM1teYhevC1B0fVWHTi1mpqOP9727KPByspsqLEb94FDBlAWFV-3k1w06ptjzr6AHCPWXi5BbouMveR546ZeqsAP10KykszpvkTn6KjG0eQq866RA164J-3SW6_6OXeicFVQEZGY';

export function PaymentPlanConfirmed() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full px-6 py-12 md:py-20">
        {/* Hero Section */}
        <section className="mb-16 text-center md:text-left">
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
            Payment Plan <span className="text-primary">Confirmed</span>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
            Hello Elena, your payment plan for Invoice #NH-2024-BLK has been successfully set up and is now active.
          </p>
        </section>

        <ConfirmedSummaryGrid items={SUMMARY_ITEMS} />

        <div className="mb-12">
          <ScheduleTable rows={SCHEDULE_ROWS} />
        </div>

        <PaymentMethodBanner
          brand="Visa"
          lastFour="4242"
          logoSrc={VISA_LOGO}
          onDashboard={() => navigate('/billing')}
        />

        {/* Trust/Reassurance Section */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-6">
            <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed italic">
            All payments are processed through our secure, encrypted health-finance gateway. Installments will be automatically charged to your selected method on the scheduled dates. No further action is required from your side.
          </p>
        </div>
      </div>
    </div>
  );
}
