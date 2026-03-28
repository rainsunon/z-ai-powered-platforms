import React from 'react';
import { useNavigate } from 'react-router-dom';

export function BankLinkedSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
      {/* Asymmetric Layout Container */}
      <div className="max-w-4xl w-full grid md:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Success Message */}
        <div className="md:col-span-7 space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary-container opacity-20 blur-2xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary-container w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
              Bank Account <br/>Linked Successfully
            </h2>
            <p className="text-lg text-on-surface-variant max-w-md leading-relaxed">
              Your bank account has been securely verified and is now ready for use in your <span className="text-primary font-semibold">Luminous Sanctuary.</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-bold text-sm shadow-lg hover:shadow-primary-container/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Back to Dashboard
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            <button 
              onClick={() => navigate('/billing/methods')}
              className="px-8 py-4 bg-surface-container-high text-primary rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center"
            >
              View All Payment Methods
            </button>
          </div>
        </div>

        {/* Right Column: Details & Visual Polish */}
        <div className="md:col-span-5 relative">
          {/* Glassmorphism Detail Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0px_20px_40px_rgba(21,30,18,0.06)] border border-white/40 space-y-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="bg-surface-container p-3 rounded-2xl">
                <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
              </div>
              <span className="bg-secondary-fixed text-on-secondary-container text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Active</span>
            </div>
            
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Financial Institution</p>
              <h3 className="text-2xl font-black text-on-surface tracking-tight">CHASE BANK</h3>
            </div>
            
            <div className="pt-4 border-t border-outline-variant/20">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Account Number</p>
              <p className="text-xl font-medium text-on-surface flex items-center gap-1 tracking-widest">
                •••• •••• •••• 8812
              </p>
            </div>
            
            <div className="bg-surface-container-lowest/50 rounded-2xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container">verified_user</span>
              <span className="text-xs font-semibold text-on-surface-variant">Instant verification complete</span>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary-fixed opacity-20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-container opacity-10 blur-2xl rounded-full"></div>
        </div>
      </div>

      {/* Security Badges Footer Section */}
      <footer className="mt-20 w-full max-w-4xl border-t border-outline-variant/10 pt-10">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">lock</span>
            <span className="font-manrope font-bold text-xs tracking-widest uppercase">256-BIT SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">health_and_safety</span>
            <span className="font-manrope font-bold text-xs tracking-widest uppercase">HIPAA COMPLIANT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">credit_card</span>
            <span className="font-manrope font-bold text-xs tracking-widest uppercase">PCI DSS SECURE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
