// src/features/auth/components/MfaForm.tsx
import React from 'react';

interface MfaFormProps {
    onVerify: () => void;
    onBack: () => void;
}

export const MfaForm: React.FC<MfaFormProps> = ({ onVerify, onBack }) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-slate-400 hover:text-primary transition-colors mb-10 group"
            >
                <span className="material-icons text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Back to login</span>
            </button>
            <div className="mb-10">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                    <span className="material-icons text-3xl">vibration</span>
                </div>
                <h2 className="text-3xl font-black mb-2 text-slate-900">Two-Factor Auth</h2>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    A 6-digit code has been sent to your device ending in <span className="text-slate-900 font-bold">••42</span>.
                </p>
            </div>
            <div className="space-y-10">
                <div className="flex justify-between gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <input
                            key={i}
                            className="w-full h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-black focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                            maxLength={1}
                            type="text"
                        />
                    ))}
                </div>
                <div className="space-y-4">
                    <button
                        onClick={onVerify}
                        className="w-full bg-primary hover:brightness-110 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs"
                    >
                        Verify & Complete Login
                    </button>
                    <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-black py-4 rounded-xl transition-all border border-slate-200 uppercase tracking-widest text-xs">
                        Resend Code
                    </button>
                </div>
            </div>
        </div>
    );
};
