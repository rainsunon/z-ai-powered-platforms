import React from 'react';
import { useNavigate } from 'react-router-dom';

export function AddBankAccount() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/billing/methods/verify-ach');
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-20">
      <div className="w-full max-w-2xl bg-surface-container-low rounded-[2rem] p-8 md:p-12 shadow-[0px_20px_40px_rgba(21,30,18,0.04)] relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container text-primary mb-6">
              <span className="material-symbols-outlined text-3xl">account_balance</span>
            </span>
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">Add Bank Account</h1>
            <p className="text-on-surface-variant font-body max-w-md mx-auto">Securely link your bank account via ACH for seamless medical payments and reimbursements.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Holder */}
            <div className="space-y-2">
              <label htmlFor="holder_name" className="block font-headline text-sm font-bold text-on-surface-variant px-2">Account Holder Name</label>
              <input 
                type="text" 
                id="holder_name" 
                className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-lowest focus:ring-2 focus:ring-primary-container text-on-surface font-body placeholder:text-outline/50 shadow-sm transition-all" 
                placeholder="Full Legal Name" 
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Routing Number */}
              <div className="space-y-2">
                <label htmlFor="routing_number" className="block font-headline text-sm font-bold text-on-surface-variant px-2">Routing Number</label>
                <input 
                  type="text" 
                  id="routing_number" 
                  className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-lowest focus:ring-2 focus:ring-primary-container text-on-surface font-body placeholder:text-outline/50 shadow-sm transition-all" 
                  placeholder="9-digit code" 
                  required
                />
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <label htmlFor="account_number" className="block font-headline text-sm font-bold text-on-surface-variant px-2">Account Number</label>
                <input 
                  type="text" 
                  id="account_number" 
                  className="w-full px-6 py-4 rounded-xl border-0 bg-surface-container-lowest focus:ring-2 focus:ring-primary-container text-on-surface font-body placeholder:text-outline/50 shadow-sm transition-all" 
                  placeholder="Up to 17 digits" 
                  required
                />
              </div>
            </div>

            {/* Verification Microcopy */}
            <div className="bg-surface-container-high rounded-2xl p-6 border border-outline-variant/10">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <div className="space-y-1">
                  <p className="font-headline text-sm font-bold text-primary">Verify account</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    To protect your sanctuary, we use instant verification. By continuing, you agree to securely link your institution. Alternatively, we can send two micro-deposits (under $0.99) to your account within 1-2 business days to verify ownership.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/billing/methods')}
                className="flex-1 px-8 py-4 bg-surface-container-highest text-primary font-headline font-bold rounded-full hover:bg-surface-dim transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-[2] px-8 py-4 primary-gradient text-white font-headline font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all order-1 sm:order-2"
              >
                Link Account Securely
              </button>
            </div>
          </form>

          {/* Trust Signals */}
          <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">256-BIT SSL</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">encrypted</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">HIPAA COMPLIANT</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">security</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">PCI DSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
