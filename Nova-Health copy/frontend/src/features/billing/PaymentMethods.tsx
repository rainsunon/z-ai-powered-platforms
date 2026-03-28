import React from 'react';
import { useNavigate } from 'react-router-dom';

export function PaymentMethods() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-12 mt-4 pb-20">
      {/* Bento Layout Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Active Payment Methods List (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-headline text-xl font-bold text-on-surface">Stored Methods</h3>
            <span className="text-xs font-bold text-primary bg-secondary-container px-3 py-1 rounded-full">3 Active Methods</span>
          </div>

          {/* Payment Card 1: Primary */}
          <div className="bg-surface-container-lowest p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-500 group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-12 bg-surface-container-high rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-[#1a1f71]">credit_card</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-headline font-bold text-on-surface">Visa ending in 4242</p>
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-primary text-white px-2 py-0.5 rounded">Primary</span>
                </div>
                <p className="text-on-surface-variant text-sm font-medium">Expires 12/26</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 rounded-full bg-surface-container-high text-primary font-bold text-sm hover:bg-surface-container-highest transition-colors">Edit</button>
              <button className="p-2.5 rounded-full text-on-surface-variant hover:bg-error-container hover:text-error transition-colors">
                <span className="material-symbols-outlined">delete_outline</span>
              </button>
            </div>
          </div>

          {/* Payment Card 2: Expiring Soon */}
          <div className="bg-surface-container-lowest p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-500 border border-transparent hover:border-outline-variant/20">
            <div className="flex items-center gap-6">
              <div className="w-16 h-12 bg-surface-container-low rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-[#ff5f00]">account_balance</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-headline font-bold text-on-surface">Chase Checking Account</p>
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded">Expiring Soon</span>
                </div>
                <p className="text-on-surface-variant text-sm font-medium">Account ending in ••••8812</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 rounded-full bg-surface-container-high text-primary font-bold text-sm hover:bg-surface-container-highest transition-colors">Edit</button>
              <button className="p-2.5 rounded-full text-on-surface-variant hover:bg-error-container hover:text-error transition-colors">
                <span className="material-symbols-outlined">delete_outline</span>
              </button>
            </div>
          </div>

          {/* Payment Card 3: Expired */}
          <div className="bg-surface-container-low/50 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-60 border border-dashed border-outline-variant">
            <div className="flex items-center gap-6">
              <div className="w-16 h-12 bg-surface-variant rounded-xl flex items-center justify-center grayscale">
                <span className="material-symbols-outlined text-3xl">payment</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-headline font-bold text-on-surface line-through">Mastercard ending in 0019</p>
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-error-container text-error px-2 py-0.5 rounded">Expired</span>
                </div>
                <p className="text-on-surface-variant text-sm font-medium">Expired 08/23</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-full text-on-surface-variant hover:bg-error-container hover:text-error transition-colors">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Sidebar / Summary */}
        <div className="space-y-8">
          <div className="bg-primary-container/10 p-8 rounded-[2.5rem] border-2 border-primary-container/20 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-headline font-extrabold text-2xl text-primary leading-tight mb-4">Add New<br/>Method</h4>
              <p className="text-on-primary-container text-sm leading-relaxed opacity-80 mb-8">Securely link your bank account or credit card for automatic billing.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/billing/methods/add-card')}
                  className="w-full primary-gradient text-white rounded-[1.5rem] py-4 font-headline font-extrabold shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group"
                >
                  <span className="material-symbols-outlined">add_card</span>
                  Add Credit Card
                </button>
                <button 
                  onClick={() => navigate('/billing/methods/add-bank')}
                  className="w-full bg-surface-container-highest text-on-surface rounded-[1.5rem] py-4 font-headline font-extrabold flex items-center justify-center gap-3 group hover:bg-surface-dim transition-colors"
                >
                  <span className="material-symbols-outlined">account_balance</span>
                  Link Bank Account
                </button>
              </div>
            </div>
            {/* Abstract Background Decoration */}
            <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-[2.5rem]">
            <h4 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              Billing Security
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">All transactions are encrypted with 256-bit SSL protocols.</p>
              </li>
              <li className="flex gap-4">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">PCI DSS Level 1 compliant infrastructure.</p>
              </li>
              <li className="flex gap-4">
                <div className="mt-1">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">NovaHealth does not store full card numbers on our servers.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transactions / History Preview (Asymmetric Layout) */}
      <section className="mt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">Recent Invoices</h3>
            <p className="text-on-surface-variant text-sm">Download PDFs of your latest medical service billings.</p>
          </div>
          <button 
            onClick={() => navigate('/billing')}
            className="text-primary font-bold text-sm flex items-center gap-2 hover:underline decoration-2 underline-offset-4"
          >
            View All Billing History
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container p-6 rounded-[2rem] flex items-center justify-between group hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-surface-container-lowest rounded-2xl text-primary">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div>
                <p className="font-headline font-bold text-on-surface text-sm">Consultation - Oct 12</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Paid via Visa ****4242</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-headline font-black text-on-surface">$120.00</p>
              <button className="text-[10px] font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-xs">download</span>
                PDF
              </button>
            </div>
          </div>

          <div className="bg-surface-container p-6 rounded-[2rem] flex items-center justify-between group hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-surface-container-lowest rounded-2xl text-primary">
                <span className="material-symbols-outlined">lab_research</span>
              </div>
              <div>
                <p className="font-headline font-bold text-on-surface text-sm">Lab Results - Sep 28</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Paid via Chase ****8812</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-headline font-black text-on-surface">$45.00</p>
              <button className="text-[10px] font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-xs">download</span>
                PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
