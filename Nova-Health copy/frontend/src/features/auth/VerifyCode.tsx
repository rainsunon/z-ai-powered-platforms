import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function VerifyCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/verify-success');
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="bg-primary-container min-h-screen flex flex-col font-body text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopNavBar Suppression: Page is Transactional (Verification) */}
      <main className="flex-grow flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Decorative Ambient Light Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-fixed/20 blur-[120px]"></div>

        {/* Verification Card */}
        <div className="w-full max-w-lg glass-panel rounded-[2rem] p-8 md:p-12 shadow-[0px_20px_40px_rgba(21,30,18,0.08)] relative z-10">
          {/* Branding Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
            </div>
            <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight text-center">
              Enter Verification Code
            </h1>
            <p className="mt-4 text-on-surface-variant text-center max-w-[280px] leading-relaxed">
              We've sent a 6-digit code to your chosen method
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerify} className="space-y-10">
            {/* 6-Digit Input Grid */}
            <div className="flex justify-between gap-2 md:gap-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  placeholder="•"
                  className="w-full h-14 md:h-16 text-center text-2xl font-bold rounded-xl border-none bg-surface-container text-on-surface focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-200 outline-none"
                />
              ))}
            </div>

            {/* Trust Device Checkbox */}
            <div className="flex items-center justify-center">
              <label className="inline-flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" id="trust-device" className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-outline bg-transparent transition-all checked:border-primary checked:bg-primary hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" />
                  <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-sm opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                </div>
                <span className="ml-3 text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors select-none">
                  Trust this device for 30 days
                </span>
              </label>
            </div>

            {/* Action Section */}
            <div className="space-y-6">
              <button type="submit" className="w-full py-5 px-6 primary-gradient text-white font-headline font-bold text-lg rounded-full shadow-[0px_8px_20px_rgba(6,110,0,0.25)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3">
                Verify
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  Resend code in <span className="text-primary font-bold">01:54</span>
                </div>
                <button type="button" className="text-primary font-bold text-sm hover:underline underline-offset-4 opacity-50 cursor-not-allowed">
                  Resend Code
                </button>
                <a href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4 mt-1">Trouble receiving the code?</a>
              </div>
            </div>
          </form>

          {/* Footer Help Link */}
          <div className="mt-12 pt-8 border-t border-outline-variant/15 text-center">
            <a href="#" className="inline-flex items-center gap-2 text-on-surface-variant text-sm hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">help_outline</span>
              Having trouble? Contact support
            </a>
          </div>
        </div>

        {/* Semantic Back Anchor */}
        <Link to="/login" className="absolute top-10 left-10 hidden md:flex items-center gap-2 text-white font-semibold hover:translate-x-[-4px] transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to login
        </Link>
      </main>

      {/* Content-only canvas: Nav and FAB suppressed for focus/transactional security */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs font-medium tracking-widest uppercase">
        NovaHealth Secure Verification
      </div>
    </div>
  );
}
