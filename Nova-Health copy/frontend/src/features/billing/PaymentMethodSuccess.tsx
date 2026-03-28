import React from 'react';
import { useNavigate } from 'react-router-dom';

export function PaymentMethodSuccess() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Organic Shapes (Luminous Sanctuary Style) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-fixed/10 rounded-full blur-3xl"></div>

      {/* Success Container */}
      <div className="w-full max-w-xl flex flex-col items-center text-center z-10">
        {/* Icon Cluster: Glassmorphism Backdrop */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary-container/20 blur-2xl rounded-full scale-150"></div>
          <div className="relative w-32 h-32 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-[0px_20px_40px_rgba(21,30,18,0.06)] backdrop-blur-xl border border-outline-variant/15">
            <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-6 leading-tight">
          Payment Method Successfully Updated
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-md mb-12 font-light">
          Your future consultations and health record renewals will now be processed using your new primary card.
        </p>

        {/* Card Summary: Bento Style Inset */}
        <div className="w-full bg-surface-container-low rounded-[2rem] p-8 mb-12 flex items-center gap-6 border border-outline-variant/10">
          <div className="w-16 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-label font-bold text-primary tracking-widest uppercase mb-1">Primary Method</p>
            <p className="text-xl font-headline font-bold text-on-surface">Mastercard ending in 8899</p>
            <p className="text-on-surface-variant text-sm">Expires 08/2027</p>
          </div>
          <div className="hidden sm:block">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-br from-primary to-primary-container text-white px-10 py-5 rounded-full font-headline font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => navigate('/billing')}
            className="bg-surface-container-high text-primary px-10 py-5 rounded-full font-headline font-bold text-lg hover:bg-surface-container-highest transition-colors duration-300"
          >
            View Billing History
          </button>
        </div>

        {/* Supporting Text */}
        <div className="mt-16 pt-8 border-t border-outline-variant/10 w-full flex flex-col items-center">
          <div className="flex items-center gap-2 text-on-surface-variant/60 text-sm mb-4">
            <span className="material-symbols-outlined text-sm">lock</span>
            <p>Secured by NovaHealth Vault Encryption</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">Support Center</a>
          </div>
        </div>
      </div>

      {/* Visual Accent: Floating Health Metric (Asymmetric Detail) */}
      <div className="absolute top-1/4 right-[10%] hidden lg:block">
        <div className="bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] flex items-center gap-4 border border-outline-variant/15">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary-container">payments</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant/50">Next Payment</p>
            <p className="text-base font-bold text-on-surface">$24.00 — Oct 12</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-1/4 left-[10%] hidden lg:block">
        <div className="bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-[2rem] shadow-[0px_20px_40px_rgba(21,30,18,0.06)] flex items-center gap-4 border border-outline-variant/15">
          <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">medical_services</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant/50">Consultation Status</p>
            <p className="text-base font-bold text-on-surface">Coverage Active</p>
          </div>
        </div>
      </div>
    </main>
  );
}
