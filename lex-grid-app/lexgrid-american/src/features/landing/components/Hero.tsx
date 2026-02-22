// src/features/landing/components/Hero.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
    return (
        <header className="relative pt-40 pb-24 px-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        Now available in Canada & USA
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-white">
                        Legal Intelligence, <span className="text-primary underline decoration-white/20 underline-offset-8">Redefined.</span>
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                        LexGrid empowers legal professionals across North America with precision AI-driven insights, deep case analysis, and instant jurisdictional consultations.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link to="/login" className="w-full sm:w-auto bg-primary hover:scale-[1.02] active:scale-[0.98] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl">
                            Start Your Free Trial
                        </Link>
                        <button className="w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all">
                            Book a Demo
                        </button>
                    </div>
                    <div className="flex items-center gap-8 pt-4 text-white/60">
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-xl">account_balance</span>
                            <span className="text-sm font-bold uppercase tracking-wider">ABA Member</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-xl">verified_user</span>
                            <span className="text-sm font-bold uppercase tracking-wider">SOC2 Type II</span>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2">
                    <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-white/10 shadow-3xl">
                        <img
                            alt="Legal Dashboard"
                            className="w-full opacity-40 mix-blend-overlay"
                            src="https://picsum.photos/id/20/800/600"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand/80 via-transparent to-primary/20"></div>
                        <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-2xl animate-bounce-slow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                    <span className="material-icons text-sm text-white">auto_awesome</span>
                                </div>
                                <h4 className="text-sm font-black uppercase text-slate-800 tracking-tighter">AI Case Summary</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                                <div className="h-2 w-4/6 bg-slate-100 rounded"></div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">74% Success Probability</span>
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                                    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
