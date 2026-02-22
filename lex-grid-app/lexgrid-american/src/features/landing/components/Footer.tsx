// src/features/landing/components/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                                <span className="material-icons text-sm">gavel</span>
                            </div>
                            <span className="text-xl font-black tracking-tight text-white uppercase">LexGrid</span>
                        </div>
                        <p className="text-sm max-w-xs leading-relaxed">Redefining legal research through sovereign-grade artificial intelligence for the North American market.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Product</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><a className="hover:text-primary transition-colors" href="#">AI Research</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Analysis</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Directory</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Trust Center</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Legal</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">SOC2</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
                    <p>© 2024 LexGrid Technologies Inc.</p>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1 text-primary"><span className="material-icons text-[10px]">lock</span> HIPAA Compliant</span>
                        <span className="flex items-center gap-1 text-primary"><span className="material-icons text-[10px]">verified</span> ABA Verified</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
