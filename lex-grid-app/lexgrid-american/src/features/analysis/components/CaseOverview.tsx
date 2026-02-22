// src/features/analysis/components/CaseOverview.tsx
import React from 'react';

export const CaseOverview: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 transition-colors duration-300">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary dark:text-primary-400 mb-6">Case Overview</h3>
            <div className="space-y-6">
                <div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-1">Matter Type</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Wrongful Termination / IP</p>
                </div>
                <div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-1">Jurisdiction</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg">🇺🇸</span>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Delaware, USA</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
