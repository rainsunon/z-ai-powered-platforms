import React from 'react';
import { useNavigate } from 'react-router-dom';

export function VerifySuccess() {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="bg-vitality min-h-screen flex flex-col font-body text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#f2fde9]/80 dark:bg-[#151e12]/80 backdrop-blur-lg flex items-center justify-between px-6 h-20 shadow-none">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-[#066e00] dark:text-[#9ff888] font-headline tracking-tight">NovaHealth</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#151e12]/60 dark:text-[#f2fde9]/60 hover:bg-[#ffffff]/50 dark:hover:bg-[#ffffff]/10 rounded-full transition-all active:scale-95 duration-200">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </nav>

      {/* Main Content: Luminous Sanctuary Success Screen */}
      <main className="flex-grow flex items-center justify-center p-6 mt-20">
        <div className="relative w-full max-w-lg">
          {/* Decorative Ambient Glows */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary-fixed opacity-30 blur-[80px] rounded-full"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary-fixed opacity-30 blur-[80px] rounded-full"></div>

          {/* Success Card */}
          <div className="bg-surface-container-lowest/90 glass-panel rounded-[1.5rem] p-10 md:p-14 shadow-[0px_20px_40px_rgba(21,30,18,0.06)] flex flex-col items-center text-center relative overflow-hidden">
            {/* Success Visual: Large Checkmark Container */}
            <div className="mb-10 relative">
              {/* Outer pulse rings */}
              <div className="absolute inset-0 animate-ping opacity-20 bg-secondary-fixed rounded-full"></div>
              <div className="w-32 h-32 md:w-40 md:h-40 success-gradient rounded-full flex items-center justify-center shadow-[0_12px_32px_rgba(6,110,0,0.25)] border-4 border-surface-container-lowest">
                <span className="material-symbols-outlined text-on-primary text-6xl md:text-7xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                  check_circle
                </span>
              </div>
            </div>

            {/* Text Content: Editorial Typography Hierarchy */}
            <div className="space-y-4 max-w-sm mx-auto">
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-background tracking-tight">
                Verification Successful
              </h1>
              <p className="text-on-surface-variant text-lg md:text-xl font-body leading-relaxed opacity-80">
                Your identity has been verified. You now have full access to your sanctuary.
              </p>
            </div>

            {/* Action Button: Primary Gradient CTA */}
            <div className="mt-12 w-full">
              <button 
                onClick={handleGoToDashboard}
                className="w-full success-gradient text-white py-5 px-8 rounded-full font-headline font-bold text-lg shadow-[0_8px_20px_rgba(6,110,0,0.2)] hover:shadow-[0_12px_28px_rgba(6,110,0,0.3)] transform hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3"
              >
                Go to Dashboard
                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
              </button>
            </div>

            {/* Branding Accent */}
            <div className="mt-8 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-xs font-body uppercase tracking-widest text-outline font-semibold">NovaHealth Security Protocols Active</span>
            </div>
          </div>

          {/* Background Texture Simulation */}
          <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern height="20" id="dots" patternUnits="userSpaceOnUse" width="20">
                  <circle cx="2" cy="2" fill="#151e12" r="1"></circle>
                </pattern>
              </defs>
              <rect fill="url(#dots)" height="100%" width="100%"></rect>
            </svg>
          </div>
        </div>
      </main>

      {/* Footer Security Indicator (Subtle) */}
      <footer className="p-8 text-center">
        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-white/10 glass-panel border border-white/10">
          <span className="material-symbols-outlined text-white text-sm">encrypted</span>
          <span className="text-white/80 text-xs font-medium tracking-wide">End-to-End Encrypted Session</span>
        </div>
      </footer>
    </div>
  );
}
