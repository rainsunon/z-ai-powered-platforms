import React from 'react';
import { useNavigate } from 'react-router-dom';

export function InstallmentSchedule() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
      {/* Progress Stepper */}
      <div className="px-6 md:px-12 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest font-label">Step 2.5 of 3</span>
            <span className="text-sm font-medium text-on-surface-variant">75% Complete</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full w-3/4"></div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Summary & Schedule */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">Payment Plan Schedule</h1>
              <p className="text-on-surface-variant text-lg leading-relaxed">Review your installment breakdown before confirming your healthcare plan subscription.</p>
            </div>

            {/* Summary Card */}
            <div className="bg-surface-container-low p-8 rounded-[2rem] relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-on-surface-variant font-medium mb-1">Total Bill Amount</p>
                  <h2 className="text-5xl font-extrabold text-primary tracking-tighter">$694.50</h2>
                </div>
                <div className="bg-secondary-container text-on-secondary-container px-6 py-4 rounded-2xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider opacity-80">Payment Plan</p>
                    <p className="font-bold text-lg">4 Interest-free payments</p>
                  </div>
                </div>
              </div>
              {/* Aesthetic Background Shape */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            {/* Detailed Schedule List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold px-2">Upcoming Payments</h3>

              {/* Payment Item 1 */}
              <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] flex flex-wrap md:flex-nowrap items-center justify-between gap-4 transition-all hover:translate-y-[-2px] hover:shadow-[0px_20px_40px_rgba(21,30,18,0.06)]">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center text-primary font-bold text-lg">1</div>
                  <div>
                    <p className="font-bold text-on-surface">Payment 1</p>
                    <p className="text-sm text-on-surface-variant">Due Today, Oct 24</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <p className="text-lg font-bold text-on-surface">$173.63</p>
                  <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Due Today</span>
                </div>
              </div>

              {/* Payment Item 2 */}
              <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] flex flex-wrap md:flex-nowrap items-center justify-between gap-4 transition-all hover:translate-y-[-2px] hover:shadow-[0px_20px_40px_rgba(21,30,18,0.06)]">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant font-bold text-lg">2</div>
                  <div>
                    <p className="font-bold text-on-surface">Payment 2</p>
                    <p className="text-sm text-on-surface-variant">Nov 24, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <p className="text-lg font-bold text-on-surface">$173.63</p>
                  <span className="bg-surface-container text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Upcoming</span>
                </div>
              </div>

              {/* Payment Item 3 */}
              <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] flex flex-wrap md:flex-nowrap items-center justify-between gap-4 transition-all hover:translate-y-[-2px] hover:shadow-[0px_20px_40px_rgba(21,30,18,0.06)]">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant font-bold text-lg">3</div>
                  <div>
                    <p className="font-bold text-on-surface">Payment 3</p>
                    <p className="text-sm text-on-surface-variant">Dec 24, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <p className="text-lg font-bold text-on-surface">$173.63</p>
                  <span className="bg-surface-container text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Upcoming</span>
                </div>
              </div>

              {/* Payment Item 4 */}
              <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] flex flex-wrap md:flex-nowrap items-center justify-between gap-4 transition-all hover:translate-y-[-2px] hover:shadow-[0px_20px_40px_rgba(21,30,18,0.06)]">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant font-bold text-lg">4</div>
                  <div>
                    <p className="font-bold text-on-surface">Payment 4</p>
                    <p className="text-sm text-on-surface-variant">Jan 24, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <p className="text-lg font-bold text-on-surface">$173.61</p>
                  <span className="bg-surface-container text-on-surface-variant px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Upcoming</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Method & Actions */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Payment Method Card */}
            <div className="bg-surface-container p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm">
              <h3 className="text-lg font-bold text-on-surface mb-6">Payment Method</h3>
              <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl">
                <div className="w-12 h-8 bg-on-background rounded flex items-center justify-center text-[10px] text-white font-bold italic tracking-tighter">VISA</div>
                <div className="flex-1">
                  <p className="font-bold text-on-surface">Visa ending in 4242</p>
                  <p className="text-xs text-on-surface-variant">Expires 12/26</p>
                </div>
                <span className="material-symbols-outlined text-primary">check_circle</span>
              </div>
              <button 
                onClick={() => navigate('/billing/bulk-pay/method')}
                className="w-full mt-4 text-sm font-semibold text-primary hover:underline transition-all"
              >
                Change Method
              </button>

              <div className="mt-8 p-4 bg-surface-variant/30 rounded-2xl border border-primary-container/20">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary shrink-0">info</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    You'll be charged <span className="font-bold text-on-surface">$173.63</span> immediately upon confirmation. Subsequent payments will be automated monthly.
                  </p>
                </div>
              </div>
            </div>

            {/* Main CTA Actions */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate('/billing/payment-confirmed')}
                className="w-full py-5 px-8 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-lg shadow-[0px_10px_20px_rgba(6,110,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                Confirm & Set Up Plan
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="w-full py-4 px-8 rounded-full border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-highest transition-all"
              >
                Go Back
              </button>
            </div>

            {/* Secure Shield Info */}
            <div className="flex items-center justify-center gap-2 text-on-surface-variant text-xs font-medium uppercase tracking-widest">
              <span className="material-symbols-outlined text-base">verified_user</span>
              256-bit Secure Encryption
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
