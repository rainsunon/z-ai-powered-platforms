import React from 'react';
import { useNavigate } from 'react-router-dom';

export function AddPaymentMethod() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/billing/methods/success');
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-10 flex items-center gap-2">
        <button 
          onClick={() => navigate('/billing/methods')}
          className="flex items-center text-primary font-semibold hover:translate-x-[-4px] transition-transform"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="ml-2">Back to Payment Methods</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Form Section */}
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h1 className="font-headline text-4xl font-extrabold text-on-surface mb-2 tracking-tight">Add New Payment Method</h1>
            <p className="text-on-surface-variant font-medium text-lg leading-relaxed">Securely save your card details for faster healthcare consultations and premium services.</p>
          </section>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Cardholder Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1">Cardholder Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">person</span>
                </div>
                <input 
                  type="text" 
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-4 text-on-surface font-semibold placeholder:opacity-40 transition-all focus:bg-surface-container-highest focus:ring-2 focus:ring-primary/20" 
                  placeholder="e.g. Alexander Mitchell" 
                  required
                />
              </div>
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1">Card Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">credit_card</span>
                </div>
                <input 
                  type="text" 
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-12 pr-12 text-on-surface font-semibold placeholder:opacity-40 transition-all focus:bg-surface-container-highest focus:ring-2 focus:ring-primary/20" 
                  placeholder="0000 0000 0000 0000" 
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD642hNtgcSimi4W3zl73QtX3KEg25s0x7U9gdbbULT6-t8Fru_o0IEKZT2EMlpsidxnLowVKEYebqx19j5hqsol4dM3zqVS2du057LlhEZlcMmwYuZ0KUxX0WSRxr-CSCQlTr1JHJ0zDZqlTjlYUEueCphtPEha8V08R0qn8ccPYliPqp4IseQNS0b6hU_pEMAl5Fadz3uLR5_bkzJAsH90_1tEt-jGlMyX7QkhwbWBhEna2ndO0Z4Q3pw93zmm8wWdGYEbbm2Yfo" 
                    alt="Visa" 
                    className="h-6 grayscale opacity-40" 
                  />
                </div>
              </div>
            </div>

            {/* Expiry and CVV Row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1">Expiry Date</label>
                <input 
                  type="text" 
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-4 text-on-surface font-semibold placeholder:opacity-40 transition-all focus:bg-surface-container-highest focus:ring-2 focus:ring-primary/20" 
                  placeholder="MM / YY" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1">CVV</label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-4 text-on-surface font-semibold placeholder:opacity-40 transition-all focus:bg-surface-container-highest focus:ring-2 focus:ring-primary/20" 
                    placeholder="***" 
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <span className="material-symbols-outlined text-outline text-lg cursor-help">info</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider ml-1">Billing Address</label>
              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="text" 
                  className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-on-surface font-semibold placeholder:opacity-40 transition-all focus:bg-surface-container-highest focus:ring-2 focus:ring-primary/20" 
                  placeholder="Street Address" 
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-on-surface font-semibold placeholder:opacity-40 transition-all focus:bg-surface-container-highest focus:ring-2 focus:ring-primary/20" 
                    placeholder="City" 
                    required
                  />
                  <input 
                    type="text" 
                    className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-6 text-on-surface font-semibold placeholder:opacity-40 transition-all focus:bg-surface-container-highest focus:ring-2 focus:ring-primary/20" 
                    placeholder="Postal Code" 
                    required
                  />
                </div>
              </div>
            </div>

            {/* Set as Primary */}
            <div className="flex items-center gap-4 bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="primary-method" 
                  className="w-6 h-6 rounded-lg border-outline-variant text-primary focus:ring-primary/20" 
                />
              </div>
              <label htmlFor="primary-method" className="flex-1 cursor-pointer">
                <span className="block font-bold text-on-surface">Set as Primary</span>
                <span className="block text-sm text-on-surface-variant">Use this card for all future recurring billing and appointments.</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-col gap-4">
              <button 
                type="submit" 
                className="w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-headline text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
              >
                Save Payment Method
              </button>
              <p className="text-center text-on-surface-variant text-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                Your payment information is encrypted and never stored on our servers.
              </p>
            </div>
          </form>
        </div>

        {/* Trust and Card Preview Section */}
        <div className="lg:col-span-4 space-y-8 sticky top-32">
          {/* Virtual Card Preview */}
          <div className="aspect-[1.58/1] w-full rounded-3xl bg-gradient-to-br from-[#066e00] to-[#1dcc0d] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-fixed/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-9 bg-surface-container-lowest/20 backdrop-blur rounded-lg"></div>
              <span className="material-symbols-outlined text-4xl opacity-80">contactless</span>
            </div>
            
            <div className="relative z-10">
              <div className="text-2xl font-mono tracking-widest opacity-80 mb-6">•••• •••• •••• ••••</div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase tracking-tighter opacity-60 font-bold mb-1">Card Holder</div>
                  <div className="text-sm font-bold uppercase tracking-wider">Your Name Here</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-tighter opacity-60 font-bold mb-1">Expires</div>
                  <div className="text-sm font-bold">-- / --</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="bg-surface-container rounded-3xl p-8 space-y-6">
            <h3 className="font-headline font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">verified_user</span>
              Security Assurance
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-on-surface">SSL Encrypted</div>
                  <div className="text-xs text-on-surface-variant leading-relaxed">256-bit SSL encryption ensures your transaction data is protected.</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-on-surface">PCI-DSS Compliant</div>
                  <div className="text-xs text-on-surface-variant leading-relaxed">Adhering to global standards for secure credit card handling.</div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-center opacity-60">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                <span className="text-[8px] font-bold uppercase tracking-widest mt-1">SSL Secure</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-2xl">shield</span>
                <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Safe Pay</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-2xl">monitoring</span>
                <span className="text-[8px] font-bold uppercase tracking-widest mt-1">24/7 Monitoring</span>
              </div>
            </div>
          </div>

          {/* Support Note */}
          <div className="p-6 bg-tertiary-fixed rounded-3xl">
            <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed font-medium">
              <strong>Need help?</strong> Our support team is available 24/7 for payment-related inquiries. <a href="#" className="underline font-bold">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
