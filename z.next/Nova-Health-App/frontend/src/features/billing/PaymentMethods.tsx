import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StoredMethodCard } from './components/StoredMethodCard';
import { AddMethodSidebar } from './components/AddMethodSidebar';
import { RecentInvoiceRow } from './components/RecentInvoiceRow';

const STORED_METHODS = [
  {
    icon: 'credit_card',
    iconColor: 'text-[#1a1f71]',
    title: 'Visa ending in 4242',
    subtitle: 'Expires 12/26',
    status: 'primary' as const,
  },
  {
    icon: 'account_balance',
    iconColor: 'text-[#ff5f00]',
    title: 'Chase Checking Account',
    subtitle: 'Account ending in ••••8812',
    status: 'expiring' as const,
  },
  {
    icon: 'payment',
    title: 'Mastercard ending in 0019',
    subtitle: 'Expired 08/23',
    status: 'expired' as const,
  },
];

const RECENT_INVOICES = [
  { icon: 'receipt_long', title: 'Consultation - Oct 12', paymentMethod: 'Paid via Visa ****4242', amount: '$120.00' },
  { icon: 'lab_research', title: 'Lab Results - Sep 28', paymentMethod: 'Paid via Chase ****8812', amount: '$45.00' },
];

export function PaymentMethods() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-12 mt-4 pb-20">
      {/* Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Stored Methods (spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-headline text-xl font-bold text-on-surface">Stored Methods</h3>
            <Badge className="bg-secondary-container text-primary text-xs font-bold px-3 py-1 rounded-full hover:bg-secondary-container">
              {STORED_METHODS.length} Active Methods
            </Badge>
          </div>

          {STORED_METHODS.map((m) => (
            <StoredMethodCard
              key={m.title}
              {...m}
              onEdit={m.status !== 'expired' ? () => {} : undefined}
              onDelete={() => {}}
            />
          ))}
        </div>

        <AddMethodSidebar
          onAddCard={() => navigate('/billing/methods/add-card')}
          onLinkBank={() => navigate('/billing/methods/add-bank')}
        />
      </div>

      {/* Recent Invoices */}
      <section className="mt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
              Recent Invoices
            </h3>
            <p className="text-on-surface-variant text-sm">
              Download PDFs of your latest medical service billings.
            </p>
          </div>
          <Button
            variant="link"
            onClick={() => navigate('/billing')}
            className="text-primary font-bold text-sm p-0 h-auto"
          >
            View All Billing History
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECENT_INVOICES.map((inv) => (
            <RecentInvoiceRow key={inv.title} {...inv} />
          ))}
        </div>
      </section>
    </div>
  );
}
