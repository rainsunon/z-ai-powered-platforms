// src/features/scheduling/components/SchedulingHeader.tsx
import React from 'react';

export const SchedulingHeader: React.FC = () => {
    return (
        <header className="flex justify-between items-center mb-12">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">Meeting Schedule</h1>
                <p className="text-slate-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-widest text-[11px]">Manage your North American legal consultations.</p>
            </div>
            <div className="flex gap-4">
                <button className="px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 flex items-center gap-3 hover:border-primary dark:hover:border-primary-400 hover:text-primary dark:hover:text-primary-400 transition-all shadow-sm">
                    <span className="material-icons text-lg">language</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">GMT-7 (PST)</span>
                </button>
                <button className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-xl transition-colors duration-300">
                    <span className="material-icons text-slate-400 dark:text-slate-500">notifications</span>
                </button>
            </div>
        </header>
    );
};
