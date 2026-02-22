// src/features/dashboard/components/ActionGrid.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const ActionGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden bg-primary rounded-3xl p-8 shadow-2xl shadow-primary/30 cursor-pointer hover:-translate-y-2 transition-all">
                <div className="absolute -right-6 -top-6 opacity-20 group-hover:scale-110 transition-transform text-white">
                    <span className="material-icons text-[140px]">psychology</span>
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/30">
                            <span className="material-icons text-white text-3xl">bolt</span>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Start AI Chat</h3>
                        <p className="text-white/80 text-sm mt-3 font-medium leading-relaxed">Instant legal analysis and document summarization powered by Gemini Pro.</p>
                    </div>
                    <Link to="/chat" className="mt-8 w-full py-4 bg-white text-primary font-black rounded-xl hover:bg-slate-50 transition-colors shadow-xl text-center uppercase tracking-widest text-xs">
                        Launch Assistant
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all transition-colors duration-300">
                <div>
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <span className="material-icons text-primary text-3xl">upload_file</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Analyze File</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-3 font-medium leading-relaxed">Securely upload evidence, contracts, or court filings for deep extraction.</p>
                </div>
                <Link to="/analysis" className="mt-8 w-full py-4 bg-primary text-white font-black rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20 text-center uppercase tracking-widest text-xs">
                    Add Assets
                </Link>
            </div>

            <div className="bg-slate-500 dark:bg-slate-700 rounded-3xl p-8 flex flex-col justify-between shadow-2xl hover:-translate-y-2 transition-all">
                <div>
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                        <span className="material-icons text-white text-3xl">videocam</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">View Meetings</h3>
                    <p className="text-white/70 text-sm mt-3 font-medium leading-relaxed">Connect with your legal council via encrypted HIPAA-compliant video.</p>
                </div>
                <Link to="/scheduling" className="mt-8 w-full py-4 bg-white text-slate-600 font-black rounded-xl hover:bg-white/90 transition-all shadow-xl text-center uppercase tracking-widest text-xs">
                    Join Call
                </Link>
            </div>
        </div>
    );
};
