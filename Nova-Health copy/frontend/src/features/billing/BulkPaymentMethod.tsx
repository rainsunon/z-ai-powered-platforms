import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function BulkPaymentMethod() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('full');

  const handlePay = () => {
    if (paymentMethod === 'full') {
      navigate('/billing/bulk-pay/success');
    } else {
      navigate('/billing/bulk-pay/schedule');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      {/* Stepper */}
      <div className="px-6 md:px-12 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Step 2 of 3: Payment</span>
            <span className="text-xs font-medium text-on-surface-variant">66% Complete</span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container w-2/3 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Dashboard-style Grid Layout */}
      <div className="px-6 md:px-12 py-8 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Payment Methods Selection */}
          <div className="lg:col-span-7 space-y-6">
            <section>
              <h3 className="text-lg font-bold font-headline mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">credit_card</span>
                Saved Cards
              </h3>

              {/* Stored Card: Selected State */}
              <div className="group relative p-6 rounded-3xl bg-surface-container-lowest border-2 border-primary shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-10 rounded-lg bg-on-surface/5 flex items-center justify-center">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy7bsGXeSzHcRS5_pkAO94xnaf2HKZnFzcv4LxyAaq3sxjaoC35hTesJstN5SajvbJk2v8doQChig2j4soyBT1nwah7P6JJoM6XDDdS4oyQ7gy3M8l3IlJkdqy9iMptzSy9lSWHgBKRGvFuavqsaheu58PosrDAvSDAKKvO3k7_7AK5FGIIbsdnKWtUYcSJv9caNEdhW0wPijJPPHL0O4Dtkl09XT_scQ6lIAdo_rP3X2IYyF8C5t2eJTYSa_KqELKH1HKWJA5uBI" alt="Visa" className="w-10 grayscale opacity-80" />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">Visa ending in 4242</p>
                      <p className="text-sm text-on-surface/50">Expires 08/26</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xs">check</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold font-headline mb-4">Other Options</h3>

              {/* Add New Card */}
              <div className="flex items-center justify-between p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center group-hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-primary">add_card</span>
                  </div>
                  <span className="font-semibold">Add new credit or debit card</span>
                </div>
                <span className="material-symbols-outlined text-on-surface/30">chevron_right</span>
              </div>

              {/* Bank Account */}
              <div className="flex items-center justify-between p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center group-hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-primary">account_balance</span>
                  </div>
                  <span className="font-semibold">Link a bank account (ACH)</span>
                </div>
                <span className="material-symbols-outlined text-on-surface/30">chevron_right</span>
              </div>
            </section>

            {/* Trust Device Checkbox */}
            <div className="p-6 rounded-3xl bg-secondary-container/20 flex items-start gap-4">
              <div className="mt-1">
                <input type="checkbox" id="trust-device" className="w-5 h-5 rounded border-outline text-primary focus:ring-primary-container transition-all" />
              </div>
              <label htmlFor="trust-device" className="cursor-pointer">
                <span className="block font-bold text-on-surface">Trust this device</span>
                <span className="block text-sm text-on-surface/60">Skip the 2-step verification code for future payments on this browser.</span>
              </label>
            </div>
          </div>

          {/* Right: Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 glass-panel rounded-[2.5rem] p-8 shadow-[0px_20px_40px_rgba(21,30,18,0.06)] border border-white/50">
              <h3 className="text-xl font-bold font-headline mb-6">Payment Summary</h3>
              
              <div className="space-y-3 mb-8">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Payment Options</p>
                <div className="grid grid-cols-1 gap-3">
                  {/* Pay in Full Option */}
                  <label className={`relative flex items-center p-4 cursor-pointer rounded-2xl transition-all ${paymentMethod === 'full' ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'}`}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="full" 
                      className="hidden" 
                      checked={paymentMethod === 'full'}
                      onChange={() => setPaymentMethod('full')}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-on-surface">Pay in Full</p>
                      <p className="text-xs text-on-surface-variant">One-time payment of $694.50</p>
                    </div>
                    {paymentMethod === 'full' ? (
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-outline-variant"></div>
                    )}
                  </label>

                  {/* Pay by Installments Option */}
                  <label className={`relative flex items-center p-4 cursor-pointer rounded-2xl transition-all ${paymentMethod === 'installments' ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'}`}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="installments" 
                      className="hidden" 
                      checked={paymentMethod === 'installments'}
                      onChange={() => setPaymentMethod('installments')}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-on-surface">Pay by Installments</p>
                        <span className="bg-secondary-container text-on-secondary-container text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase">0% APR</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">4 interest-free payments of $173.63</p>
                    </div>
                    {paymentMethod === 'installments' ? (
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-outline-variant"></div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-on-surface/70">
                  <span>General Consultation</span>
                  <span>$89.50</span>
                </div>
                <div className="flex justify-between text-on-surface/70">
                  <span>Specialized Lab Panel</span>
                  <span>$750.00</span>
                </div>
                <div className="flex justify-between text-on-surface/70">
                  <span>Insurance Coverage</span>
                  <span className="text-primary">-$145.00</span>
                </div>

                <div className="pt-4 border-t border-outline-variant/30">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-on-surface/40">Total Amount</p>
                      <p className="text-4xl font-extrabold font-headline text-primary">$694.50</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-on-surface/40 px-2 py-1 bg-surface-container rounded uppercase">USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={handlePay}
                className="w-full bg-gradient-to-br from-[#066e00] to-[#1dcc0d] text-white py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <span className="text-lg font-bold">Pay Now ($694.50)</span>
              </button>
              <p className="mt-6 text-center text-xs text-on-surface/50 leading-relaxed px-4">
                By clicking Pay Now, you authorize NovaHealth to charge your selected payment method. Your data is protected by bank-level encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
