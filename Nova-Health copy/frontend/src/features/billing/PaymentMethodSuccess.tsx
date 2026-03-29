import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PrimaryMethodSummary } from './components/PrimaryMethodSummary';
import { FloatingMetricCard } from './components/FloatingMetricCard';

export function PaymentMethodSuccess() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Organic Shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-fixed/10 rounded-full blur-3xl" />

      {/* Success Container */}
      <div className="w-full max-w-xl flex flex-col items-center text-center z-10">
        {/* Icon Cluster */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary-container/20 blur-2xl rounded-full scale-150" />
          <div className="relative w-32 h-32 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-[0px_20px_40px_rgba(21,30,18,0.06)] backdrop-blur-xl border border-outline-variant/15">
            <span
              className="material-symbols-outlined text-primary text-6xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
        </div>

        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
          Payment Method Successfully Updated
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-md mb-12 font-light">
          Your future consultations and health record renewals will now be processed using your new
          primary card.
        </p>

        <div className="mb-12 w-full">
          <PrimaryMethodSummary brand="Mastercard" last4="8899" expires="08/2027" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-br from-primary to-primary-container text-white px-10 py-5 h-auto rounded-full font-headline font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Back to Dashboard
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/billing')}
            className="bg-surface-container-high text-primary px-10 py-5 h-auto rounded-full font-headline font-bold text-lg hover:bg-surface-container-highest"
          >
            View Billing History
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-16 w-full">
          <Separator className="bg-outline-variant/10 mb-8" />
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-on-surface-variant/60 text-sm mb-4">
              <span className="material-symbols-outlined text-sm">lock</span>
              <p>Secured by NovaHealth Vault Encryption</p>
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                Support Center
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Accent Cards */}
      <FloatingMetricCard
        icon="payments"
        iconBg="bg-secondary-fixed"
        iconColor="text-on-secondary-container"
        label="Next Payment"
        value="$24.00 — Oct 12"
        className="absolute top-1/4 right-[10%] hidden lg:flex"
      />
      <FloatingMetricCard
        icon="medical_services"
        iconBg="bg-primary-container/20"
        iconColor="text-primary"
        label="Consultation Status"
        value="Coverage Active"
        className="absolute bottom-1/4 left-[10%] hidden lg:flex"
      />
    </main>
  );
}
