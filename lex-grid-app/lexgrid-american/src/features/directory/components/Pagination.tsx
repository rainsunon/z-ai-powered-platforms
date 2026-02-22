// src/features/directory/components/Pagination.tsx
import React from 'react';

export const Pagination: React.FC = () => {
    return (
        <div className="flex items-center justify-center gap-4 pt-10">
            <button className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-lg">
                <span className="material-icons text-slate-400 dark:text-slate-500">chevron_left</span>
            </button>
            <button className="w-14 h-14 rounded-2xl bg-primary text-white font-black shadow-2xl shadow-primary/20 scale-110">1</button>
            <button className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 font-black text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-400 transition-all shadow-lg">2</button>
            <button className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 font-black text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-400 transition-all shadow-lg">3</button>
            <span className="px-4 text-slate-300 dark:text-slate-700 font-black tracking-widest">...</span>
            <button className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-lg">
                <span className="material-icons text-slate-400 dark:text-slate-500">chevron_right</span>
            </button>
        </div>
    );
};
