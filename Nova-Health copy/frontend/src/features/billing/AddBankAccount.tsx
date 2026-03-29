import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BankAccountForm } from './components/BankAccountForm';
import { TrustSignals } from './components/TrustSignals';

export function AddBankAccount() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/billing/methods/verify-ach');
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-20">
      <Card className="w-full max-w-2xl rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.04)] bg-surface-container-low border-none relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl" />

        <CardHeader className="relative z-10 text-center pb-0 pt-8 md:pt-12 px-8 md:px-12">
          <div className="mx-auto mb-6">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container text-primary">
              <span className="material-symbols-outlined text-3xl">account_balance</span>
            </span>
          </div>
          <CardTitle className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">
            Add Bank Account
          </CardTitle>
          <CardDescription className="text-on-surface-variant font-body max-w-md mx-auto">
            Securely link your bank account via ACH for seamless medical payments and reimbursements.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 px-8 md:px-12 pb-8 md:pb-12 pt-6">
          <BankAccountForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/billing/methods')}
          />
          <TrustSignals />
        </CardContent>
      </Card>
    </div>
  );
}
