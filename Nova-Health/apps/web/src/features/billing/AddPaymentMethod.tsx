import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PaymentForm } from './components/PaymentForm';
import { CardPreview } from './components/CardPreview';
import { SecuritySidebar } from './components/SecuritySidebar';

export function AddPaymentMethod() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/billing/methods/success');
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Back Navigation */}
      <div className="mb-10">
        <Button
          variant="link"
          onClick={() => navigate('/billing/methods')}
          className="text-primary font-semibold hover:translate-x-[-4px] transition-transform p-0 h-auto gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Payment Methods
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Form Section */}
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h1 className="font-headline text-4xl font-extrabold text-on-surface mb-2 tracking-tight">
              Add New Payment Method
            </h1>
            <p className="text-on-surface-variant font-medium text-lg leading-relaxed">
              Securely save your card details for faster healthcare consultations and premium
              services.
            </p>
          </section>

          <PaymentForm onSubmit={handleSubmit} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8 sticky top-32">
          <CardPreview />
          <SecuritySidebar />
        </div>
      </div>
    </div>
  );
}
