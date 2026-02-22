// src/features/analysis/components/PredictionMetrics.tsx
import React from 'react';

export const PredictionMetrics: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-24">
            {/* Probability Circle */}
            <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200/50 transition-colors duration-300">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-10">Success Probability</p>
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle className="text-slate-100 dark:text-slate-800" cx="80" cy="80" fill="transparent" r="74" stroke="currentColor" strokeWidth="10"></circle>
                        <circle className="text-primary transition-all duration-1000" cx="80" cy="80" fill="transparent" r="74" stroke="currentColor" strokeDasharray="465" strokeDashoffset="130" strokeLinecap="round" strokeWidth="10"></circle>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">72%</span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mt-1">Moderate High</span>
                    </div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-10 leading-relaxed italic font-medium">Model calibrated to Delaware Chancery Court historical data.</p>
            </div>

            {/* Range Slider */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-10 shadow-xl shadow-slate-200/50 transition-colors duration-300">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Predicted Settlement Range</h3>
                    <span className="material-icons text-slate-300 dark:text-slate-600 cursor-help text-lg">info</span>
                </div>
                <div className="space-y-12">
                    <div className="flex items-end justify-between px-4">
                        <div className="text-center">
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Low</span>
                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">$125K</p>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] font-black text-primary dark:text-primary-400 uppercase tracking-widest bg-primary/10 dark:bg-primary-900/30 px-3 py-1 rounded-full mb-2 inline-block border border-primary/20 dark:border-primary-800">Projected</span>
                            <p className="text-4xl font-black text-primary dark:text-primary-400 tracking-tighter">$450K - $620K</p>
                        </div>
                        <div className="text-center">
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ceiling</span>
                            <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">$1.2M</p>
                        </div>
                    </div>
                    <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                        <div className="w-1/4 h-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="w-2/4 h-full bg-gradient-to-r from-primary to-emerald-500 shadow-lg relative">
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                        </div>
                        <div className="w-1/4 h-full bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl transition-colors duration-300">
                            <p className="text-[9px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">Risk Factor</p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold uppercase tracking-tighter">Unclear severance clause in Section 4.2</p>
                        </div>
                        <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl transition-colors duration-300">
                            <p className="text-[9px] font-black text-primary dark:text-primary-400 uppercase tracking-widest mb-1">Leverage</p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold uppercase tracking-tighter">Strong precedent in Smith vs. TechCorp (2022)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
