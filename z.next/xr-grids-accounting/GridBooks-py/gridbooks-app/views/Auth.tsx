import React, { useState } from 'react';
import { Button, Input } from '../components/ui';
import { Mail, Eye, Check, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [view, setView] = useState<'login' | 'signup' | 'verify'>('login');

  if (view === 'login') {
    return (
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f6f8f8]">
        {/* Left Side: Image */}
        <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80')" }}></div>
          <div className="absolute inset-0 bg-[#13b6ec]/20 mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 p-16 w-full text-white z-10">
            <h2 className="text-4xl font-bold leading-tight mb-4">Simplify your accounting.<br/>Amplify your growth.</h2>
            <p className="text-lg text-gray-200 max-w-lg leading-relaxed">"GridBooks gave us the clarity we needed to scale from a local shop to a national brand."</p>
          </div>
        </div>
        
        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 bg-white relative">
          <div className="w-full max-w-[440px] mx-auto flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="size-9 rounded-lg bg-[#13b6ec] text-white flex items-center justify-center font-bold">GB</div>
                 <span className="text-2xl font-black text-slate-900">GridBooks</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900">Welcome back</h1>
              <p className="text-slate-500 mt-2">Please enter your details to access your dashboard.</p>
            </div>
            
            <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
               <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-900">Email Address</span>
                  <div className="relative">
                     <Mail className="absolute left-3.5 top-3 text-slate-400" size={20} />
                     <Input placeholder="name@company.com" className="pl-11 h-12" />
                  </div>
               </label>
               <label className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-slate-900">Password</span>
                    <a href="#" className="text-sm font-semibold text-[#13b6ec]">Forgot Password?</a>
                  </div>
                  <div className="relative">
                     <Input type="password" placeholder="Enter your password" className="h-12" />
                     <Eye className="absolute right-3.5 top-3 text-slate-400 cursor-pointer" size={20} />
                  </div>
               </label>
               <Button size="lg" className="w-full text-base font-bold">Sign In</Button>
            </form>

            <div className="text-center pt-2">
               <p className="text-slate-500 text-sm">
                  New to GridBooks? <button onClick={() => setView('signup')} className="text-[#13b6ec] font-bold hover:underline">Create Account</button>
               </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'signup') {
    return (
      <div className="min-h-screen bg-[#f6f8f8] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
              <div className="flex justify-between items-center mb-2">
                 <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step 1 of 4</p>
                 <p className="text-xs font-medium text-slate-500">Account Creation</p>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-[#13b6ec] w-1/4 rounded-full"></div>
              </div>
           </div>
           
           <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                 <h1 className="text-2xl font-bold text-slate-900 mb-3">Start managing your finances today</h1>
                 <p className="text-slate-600">Create your free GridBooks account. No credit card required.</p>
              </div>
              
              <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setView('verify'); }}>
                 <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-900">Full Name</label>
                    <Input placeholder="e.g. Jane Doe" className="h-12" />
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-900">Business Email</label>
                    <Input placeholder="name@company.com" className="h-12" />
                 </div>
                 <Button size="lg" className="w-full mt-4 font-bold flex items-center justify-center gap-2">
                    Create Account <ArrowRight size={18} />
                 </Button>
              </form>
           </div>
           
           <div className="bg-slate-50 py-4 px-8 border-t border-slate-200 flex justify-center items-center gap-2">
              <span className="text-slate-500 text-xs font-medium">Already have an account? <button onClick={() => setView('login')} className="text-[#13b6ec] font-bold hover:underline">Log in</button></span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f8] flex flex-col items-center justify-center p-4">
       <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="w-full h-48 bg-[#13b6ec]/10 flex items-center justify-center relative overflow-hidden">
             <div className="size-32 bg-[#13b6ec]/20 rounded-full flex items-center justify-center">
                <Mail size={48} className="text-[#13b6ec]" />
             </div>
          </div>
          <div className="px-8 pt-8 pb-10 flex flex-col items-center text-center">
             <h1 className="text-2xl font-bold text-slate-900 mb-3">Verify your email</h1>
             <p className="text-slate-600 text-sm mb-8">We've sent a verification link to <span className="font-bold text-slate-900">user@example.com</span>.</p>
             <Button className="w-full" onClick={onLogin}>Resend Verification Email</Button>
             <button onClick={() => setView('login')} className="mt-6 text-sm text-[#13b6ec] font-medium hover:underline">Back to Login</button>
          </div>
       </div>
    </div>
  );
}
