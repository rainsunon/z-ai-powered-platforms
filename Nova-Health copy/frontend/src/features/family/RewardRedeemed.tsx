import React from 'react';
import { useNavigate } from 'react-router-dom';

export function RewardRedeemed() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 max-w-2xl mx-auto w-full pb-20">
      <div className="w-full space-y-8">
        {/* Success Message Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full mb-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-on-surface">Reward Successfully Redeemed!</h1>
          <p className="text-on-surface-variant text-lg max-w-md mx-auto leading-relaxed">
            Sarah, your family's hard work paid off. Enjoy your wellness reward!
          </p>
        </div>

        {/* Main Visual Card */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary-container/20 blur-3xl rounded-full opacity-50"></div>
          <div className="relative overflow-hidden bg-surface-container-lowest rounded-[2.5rem] shadow-xl">
            {/* Image Section */}
            <div className="aspect-[4/3] w-full relative bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[120px] text-primary/15">spa</span>
              {/* Redeemed Badge Overlay */}
              <div className="absolute top-6 right-6">
                <div className="bg-primary px-6 py-2 rounded-full shadow-lg transform rotate-3">
                  <span className="text-on-primary font-headline font-black text-sm tracking-widest">REDEEMED</span>
                </div>
              </div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                <h3 className="text-white font-headline text-2xl font-bold">Signature Spa Retreat</h3>
                <p className="text-white/80 text-sm">Valid for 6 months • Premium Access</p>
              </div>
            </div>
            {/* Tonal Stats Section */}
            <div className="bg-surface-container-low p-8 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[11px] font-headline font-semibold uppercase tracking-widest text-on-surface-variant/70">Points Spent</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">token</span>
                  <span className="text-xl font-headline font-extrabold text-on-surface">4,500</span>
                </div>
              </div>
              <div className="space-y-1 border-l border-outline-variant/30 pl-6">
                <p className="text-[11px] font-headline font-semibold uppercase tracking-widest text-on-surface-variant/70">Balance Remaining</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                  <span className="text-xl font-headline font-extrabold text-on-surface">7,950</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sharing Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 space-y-6 text-center">
          <h4 className="text-sm font-headline font-bold text-on-surface-variant uppercase tracking-[0.2em]">Share with the World</h4>
          <div className="flex justify-center items-center gap-6">
            <button className="group flex flex-col items-center gap-2">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-2xl">chat</span>
              </div>
              <span className="text-xs font-medium text-on-surface-variant">WhatsApp</span>
            </button>
            <button className="group flex flex-col items-center gap-2">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#E4405F]/10 text-[#E4405F] group-hover:bg-[#E4405F] group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-2xl">photo_camera</span>
              </div>
              <span className="text-xs font-medium text-on-surface-variant">Instagram</span>
            </button>
            <button className="group flex flex-col items-center gap-2">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-surface-container-highest text-on-surface group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                <span className="material-symbols-outlined text-2xl">content_copy</span>
              </div>
              <span className="text-xs font-medium text-on-surface-variant">Copy Link</span>
            </button>
          </div>
        </div>

        {/* Primary Action */}
        <div className="pt-4">
          <button
            onClick={() => navigate('/family/rewards')}
            className="w-full primary-gradient text-on-primary font-headline font-bold py-5 rounded-[1.5rem] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Rewards
          </button>
        </div>
      </div>
    </div>
  );
}
