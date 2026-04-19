import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AddMethodSidebarProps {
  onAddCard: () => void;
  onLinkBank: () => void;
}

const SECURITY_ITEMS = [
  'All transactions are encrypted with 256-bit SSL protocols.',
  'PCI DSS Level 1 compliant infrastructure.',
  'NovaHealth does not store full card numbers on our servers.',
];

export function AddMethodSidebar({ onAddCard, onLinkBank }: AddMethodSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Add New Method */}
      <Card className="bg-primary-container/10 rounded-[2.5rem] border-2 border-primary-container/20 relative overflow-hidden">
        <CardContent className="p-8 relative z-10">
          <h4 className="font-headline font-extrabold text-2xl text-primary leading-tight mb-4">
            Add New
            <br />
            Method
          </h4>
          <p className="text-on-primary-container text-sm leading-relaxed opacity-80 mb-8">
            Securely link your bank account or credit card for automatic billing.
          </p>

          <div className="space-y-3">
            <Button
              onClick={onAddCard}
              className="w-full primary-gradient text-white rounded-[1.5rem] py-4 h-auto font-headline font-extrabold shadow-xl shadow-primary/30"
            >
              <span className="material-symbols-outlined">add_card</span>
              Add Credit Card
            </Button>
            <Button
              variant="secondary"
              onClick={onLinkBank}
              className="w-full bg-surface-container-highest text-on-surface rounded-[1.5rem] py-4 h-auto font-headline font-extrabold hover:bg-surface-dim"
            >
              <span className="material-symbols-outlined">account_balance</span>
              Link Bank Account
            </Button>
          </div>

          {/* Abstract Background Decoration */}
          <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl" />
        </CardContent>
      </Card>

      {/* Billing Security */}
      <Card className="bg-surface-container-low rounded-[2.5rem] border-0">
        <CardContent className="p-8">
          <h4 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">verified_user</span>
            Billing Security
          </h4>
          <ul className="space-y-4">
            {SECURITY_ITEMS.map((text) => (
              <li key={text} className="flex gap-4">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
