// src/features/auth/components/AuthLayout.tsx
import React, { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-brand bg-opacity-95 font-sans">
            <main className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-3xl overflow-hidden min-h-[650px]">
                {/* Left Side: Branding/Hero */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-50 border-r border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-12">
                            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white">
                                <span className="material-icons">gavel</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">LexGrid</span>
                        </div>
                        <h1 className="text-4xl font-extrabold leading-tight mb-6 text-slate-900">
                            Intelligence for the <br />
                            <span className="text-primary italic">Legal Frontier.</span>
                        </h1>
                        <p className="text-slate-500 text-lg mb-10 max-w-sm leading-relaxed">
                            Access your secure workspace for AI-powered legal research and case management across North America.
                        </p>
                        <div className="space-y-5">
                            <div className="flex items-center gap-4 text-slate-700">
                                <span className="material-icons text-primary text-sm">check_circle</span>
                                <span className="text-sm font-bold uppercase tracking-wider">SOC2 Type II Infrastructure</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-700">
                                <span className="material-icons text-primary text-sm">check_circle</span>
                                <span className="text-sm font-bold uppercase tracking-wider">Multi-jurisdictional AI</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <img
                                alt="Lawyer"
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                                src="https://picsum.photos/id/177/100/100"
                            />
                            <div>
                                <p className="text-sm font-black text-slate-900">Jonathan Vance</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Senior Partner, Vance & Assoc.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Forms */}
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    {children}
                </div>
            </main>
            <footer className="fixed bottom-8 w-full text-center px-6">
                <p className="text-[10px] text-white font-black uppercase tracking-[0.3em] opacity-80">
                    LexGrid © 2024 • North American Legal Standards Compliant
                </p>
            </footer>
        </div>
    );
};
