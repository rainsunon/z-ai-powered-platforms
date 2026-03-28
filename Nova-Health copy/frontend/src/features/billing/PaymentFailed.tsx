import React from 'react';
import { useNavigate } from 'react-router-dom';

export function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12 w-full">
        {/* Notification Shell */}
        <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0px_20px_40px_rgba(21,30,18,0.06)] relative overflow-hidden">
          {/* Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-container"></div>

          {/* Icon & Header */}
          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-error-container text-error mb-6">
              <span className="material-symbols-outlined text-3xl">error_outline</span>
            </div>
            <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight mb-4">
              Payment Update: Action Required
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
              We're writing to let you know that the recent payment attempt for your health services was unsuccessful. Please review your billing details to maintain uninterrupted access to your care team.
            </p>
          </div>

          {/* Transaction Details Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-surface-container-low p-6 rounded-xl">
              <h3 className="font-headline font-bold text-primary mb-4 text-sm uppercase tracking-widest">Invoice Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">Invoice Number</span>
                  <span className="font-semibold font-headline">#NH-2024-812</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">Amount Due</span>
                  <span className="font-extrabold text-xl font-headline">$839.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">Date</span>
                  <span className="font-semibold">Oct 25, 2024</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container p-6 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="font-headline font-bold text-primary mb-4 text-sm uppercase tracking-widest">Payment Method</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-surface-container-highest rounded flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">credit_card</span>
                  </div>
                  <span className="font-semibold">Visa ending in 4242</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/15">
                <p className="text-xs text-on-surface-variant italic">
                  Common issues include card expiration, temporary blocks, or insufficient funds.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => navigate('/billing/bulk-pay/method')}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-center rounded-full shadow-lg hover:opacity-90 transition-all active:scale-95"
            >
              Update Payment Method & Retry
            </button>
            <button 
              onClick={() => navigate('/billing')}
              className="font-headline font-semibold text-primary hover:text-primary-container transition-colors underline decoration-primary/30 underline-offset-4"
            >
              View Billing Dashboard
            </button>
          </div>
        </div>

        {/* Support Box */}
        <div className="mt-12 p-8 bg-surface-container-high rounded-xl text-center">
          <h4 className="font-headline font-bold mb-2">Need assistance?</h4>
          <p className="text-on-surface-variant mb-4">Our financial support team is here to help with any billing questions.</p>
          <div className="flex justify-center gap-6">
            <a href="mailto:support@novahealth.com" className="flex items-center gap-2 text-primary font-semibold">
              <span className="material-symbols-outlined text-lg">mail</span>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
