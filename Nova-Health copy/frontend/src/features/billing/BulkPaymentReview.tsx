import React from 'react';
import { useNavigate } from 'react-router-dom';

export function BulkPaymentReview() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      {/* Stepper */}
      <div className="px-6 md:px-12 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Step 1 of 3: Review</span>
            <span className="text-xs font-medium text-on-surface-variant">33% Complete</span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container w-1/3 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Dashboard-style Grid Layout */}
      <div className="px-6 md:px-12 py-8 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Invoice List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                Selected Invoices
                <span className="text-sm font-medium bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">2</span>
              </h2>
              <button className="text-sm font-bold text-primary hover:underline">Edit Selection</button>
            </div>

            {/* Bento-ish Cards for Invoices */}
            <div className="space-y-4">
              {/* Invoice Item 1 */}
              <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-[0px_10px_30px_rgba(21,30,18,0.03)] flex items-center justify-between group hover:translate-y-[-2px] transition-all border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl">description</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">#NH-2024-8721</p>
                    <h3 className="text-lg font-bold text-on-surface">General Consultation</h3>
                    <p className="text-sm text-on-surface-variant">Service Date: Oct 12, 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-on-surface">$89.50</p>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Pending</span>
                </div>
              </div>

              {/* Invoice Item 2 */}
              <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-[0px_10px_30px_rgba(21,30,18,0.03)] flex items-center justify-between group hover:translate-y-[-2px] transition-all border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-3xl">biotech</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">#NH-2024-8231</p>
                    <h3 className="text-lg font-bold text-on-surface">Specialized Lab Panel</h3>
                    <p className="text-sm text-on-surface-variant">Service Date: Sep 28, 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-on-surface">$750.00</p>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Pending</span>
                </div>
              </div>
            </div>

            {/* Glassmorphism Promotion/Note Card */}
            <div className="bg-surface-container/40 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] flex items-center gap-6">
              <div className="p-4 bg-white/60 rounded-full text-tertiary">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-on-surface">Insurance Verified</h4>
                <p className="text-sm text-on-surface-variant max-w-sm">We've automatically applied your Lumina Premium coverage to these items. Your maximum out-of-pocket benefits are active.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Summary Card */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-[0px_20px_60px_rgba(21,30,18,0.08)] border border-outline-variant/10">
                <h2 className="text-2xl font-bold text-on-surface mb-8">Payment Summary</h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="font-medium">Subtotal (2 Invoices)</span>
                    <span className="font-bold text-on-surface">$839.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">Insurance Coverage</span>
                      <span className="material-symbols-outlined text-sm text-primary">info</span>
                    </div>
                    <span className="font-bold text-primary">-$145.00</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="font-medium">Processing Fee</span>
                    <span className="font-bold text-on-surface">$0.00</span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-surface-container-highest"></div>

                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Due</p>
                      <h3 className="text-4xl font-black text-on-surface tracking-tighter">$694.50</h3>
                    </div>
                    <div className="bg-secondary-container/50 text-on-secondary-container px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase">
                      Save $145.00
                    </div>
                  </div>

                  <div className="pt-8">
                    <button 
                      onClick={() => navigate('/billing/bulk-pay/method')}
                      className="w-full py-5 bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl font-bold shadow-xl shadow-primary/25 text-lg hover:scale-[1.02] active:scale-95 transition-all mb-4"
                    >
                      Confirm & Continue to Payment
                    </button>
                    <p className="text-center text-[11px] text-on-surface-variant font-medium px-4">
                      By clicking "Confirm & Continue", you agree to the NovaHealth Terms of Service regarding automatic payment processing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Info Card */}
              <div className="mt-6 px-6 py-4 bg-surface-container-low rounded-[1.5rem] flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                <p className="text-xs font-semibold text-on-surface-variant">Secure SSL Encrypted Payment Environment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
