import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function VerifyMethod() {
  const navigate = useNavigate();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/verify-code');
  };

  return (
    <div className="bg-primary-container min-h-screen flex flex-col font-body text-on-surface">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#f2fde9]/80 backdrop-blur-lg flex items-center justify-between px-6 h-20 shadow-none">
        <div className="text-xl font-extrabold text-[#066e00] font-headline tracking-tight">
          NovaHealth
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#066e00] hover:bg-[#ffffff]/50 rounded-full transition-all active:scale-95 duration-200">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </nav>

      {/* Main Content: Centered Transactional Screen */}
      <main className="flex-grow flex items-center justify-center px-6 pt-20 pb-12">
        <div className="relative w-full max-w-md">
          {/* Decorative Elements (Asymmetry & Luminous Energy) */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-secondary-fixed/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>

          {/* Verification Card */}
          <div className="glass-panel relative z-10 p-8 md:p-10 rounded-3xl shadow-[0px_20px_40px_rgba(21,30,18,0.06)] border border-white/20">
            {/* Branding/Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-16 h-16 bg-secondary-container rounded-3xl flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
              </div>
            </div>

            {/* Typography: Editorial Scale */}
            <header className="text-center mb-10">
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-3">
                Secure Your Sanctuary
              </h1>
              <p className="text-on-surface-variant leading-relaxed px-4">
                To keep your health data protected, please select a method to receive your security code.
              </p>
            </header>

            <form onSubmit={handleSendCode}>
              {/* Selection Options */}
              <div className="space-y-4 mb-10">
                {/* Option 1: SMS */}
                <label className="group relative flex items-center p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer border border-transparent active:scale-[0.98] duration-200">
                  <input defaultChecked className="hidden peer" name="auth_method" type="radio" value="sms" />
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-primary mr-4 shadow-sm peer-checked:bg-primary peer-checked:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">sms</span>
                  </div>
                  <div className="flex-grow">
                    <span className="block font-semibold text-on-surface leading-tight">Receive Code via SMS (OTP)</span>
                    <span className="block text-sm text-on-surface-variant mt-1">Sent to •••• ••89</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                  </div>
                </label>

                {/* Option 2: Email */}
                <label className="group relative flex items-center p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high transition-all cursor-pointer border border-transparent active:scale-[0.98] duration-200">
                  <input className="hidden peer" name="auth_method" type="radio" value="email" />
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-primary mr-4 shadow-sm peer-checked:bg-primary peer-checked:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">mail</span>
                  </div>
                  <div className="flex-grow">
                    <span className="block font-semibold text-on-surface leading-tight">Receive Code via Registered Email</span>
                    <span className="block text-sm text-on-surface-variant mt-1">m********y@domain.com</span>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                  </div>
                </label>
              </div>

              <div className="mb-8 px-2 flex items-center gap-3 group cursor-pointer">
                <label className="relative flex items-center cursor-pointer group">
                  <input defaultChecked className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-outline-variant bg-surface-container-low transition-all checked:bg-primary checked:border-primary hover:bg-surface-container-high" type="checkbox" />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="h-3.5 w-3.5" fill="currentColor" stroke="currentColor" strokeWidth="1" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                    </svg>
                  </span>
                </label>
                <span className="text-sm font-semibold text-on-surface select-none">Trust this device for 30 days</span>
              </div>

              {/* Primary Action */}
              <div className="space-y-4">
                <button type="submit" className="w-full bg-vibrant-gradient text-on-primary font-headline font-bold py-5 rounded-3xl shadow-lg shadow-primary/20 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                  <span>Send Code</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
                {/* Secondary Action: Trouble receiving the code? */}
                <div className="text-center">
                  <button type="button" className="text-primary font-semibold text-sm hover:underline decoration-2 underline-offset-4">
                    Trouble receiving the code?
                  </button>
                </div>
              </div>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center">
              <button type="button" className="text-on-surface-variant font-medium text-xs hover:text-primary transition-colors">
                Trouble accessing your account?
              </button>
            </div>
          </div>

          {/* Additional Contextual Content (Editorial Asymmetry) */}
          <div className="mt-8 px-6">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary/60 mt-0.5">verified_user</span>
              <p className="text-xs text-on-surface-variant/80 font-medium">
                Your privacy is our priority. NovaHealth uses end-to-end encryption for all verification requests.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Space */}
      <footer className="py-8 text-center">
        <p className="text-[10px] uppercase tracking-widest text-on-primary/60 font-bold">
          © 2024 NovaHealth Sanctuary. All Data Protected.
        </p>
      </footer>
    </div>
  );
}
