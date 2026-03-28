import React from 'react';
import { useNavigate } from 'react-router-dom';

export function MilestoneAchieved() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6 max-w-4xl mx-auto pb-20">
      {/* Ambient Background Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary-fixed/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="w-full space-y-12 text-center">
        {/* Hero Badge Display */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative" style={{ filter: 'drop-shadow(0 0 30px rgba(29, 204, 13, 0.4))' }}>
            <div className="mx-auto w-48 h-48 md:w-64 md:h-64 primary-gradient rounded-[3rem] rotate-12 flex items-center justify-center shadow-xl shadow-primary/20">
              <div className="w-[90%] h-[90%] border-4 border-white/20 rounded-[2.8rem] flex flex-col items-center justify-center -rotate-12 bg-white/10 backdrop-blur-sm relative">
                <span className="material-symbols-outlined text-white text-7xl md:text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                <span className="material-symbols-outlined text-white/40 absolute top-4 right-4" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
            </div>
          </div>
        </div>

        {/* Headline & Details */}
        <div className="space-y-4">
          <h1 className="font-headline font-extrabold text-4xl md:text-6xl text-on-surface tracking-tight leading-tight">
            Milestone Achieved!
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            You've conquered <span className="text-primary font-bold">50,000 Steps Together</span> with your health tribe. That's pure momentum.
          </p>
        </div>

        {/* Summary Stats Bento */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-outline-variant/15 text-left">
            <p className="text-on-surface-variant text-sm font-medium mb-1">Time Period</p>
            <p className="font-headline font-bold text-xl text-primary">7 Days</p>
          </div>
          <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-outline-variant/15 text-left">
            <p className="text-on-surface-variant text-sm font-medium mb-1">Effort Rank</p>
            <p className="font-headline font-bold text-xl text-primary">Top 1%</p>
          </div>
        </div>

        {/* Share Actions Cluster */}
        <div className="space-y-6 pt-8">
          <p className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant/70">Celebrate with the world</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-3 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-2xl text-on-secondary-container font-semibold">
              <span className="material-symbols-outlined">chat</span>
              WhatsApp
            </button>
            <button className="flex items-center gap-3 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-2xl text-on-secondary-container font-semibold">
              <span className="material-symbols-outlined">camera</span>
              Instagram
            </button>
            <button className="flex items-center gap-3 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-2xl text-on-secondary-container font-semibold">
              <span className="material-symbols-outlined">link</span>
              Copy Link
            </button>
          </div>
        </div>

        {/* Primary Action */}
        <div className="pt-8">
          <button
            onClick={() => navigate('/')}
            className="w-full max-w-sm px-8 py-5 primary-gradient text-white font-headline font-bold text-lg rounded-[2rem] shadow-lg shadow-primary/20 transform hover:scale-[1.02] transition-all active:scale-95"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
