// src/features/dashboard/components/StatsOverview.tsx
import React from 'react';

export const StatsOverview: React.FC = () => {
    return (
        <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex items-center gap-6 border border-slate-50 dark:border-slate-800 transition-colors duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                        <span className="material-icons text-3xl">gavel</span>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">03</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Active Cases</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex items-center gap-6 border border-slate-50 dark:border-slate-800 transition-colors duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
                        <span className="material-icons text-3xl">schedule</span>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">12</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Days to Deadline</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-50 dark:border-slate-800 transition-colors duration-300">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Active Progress: Sterling vs. OmniCorp</h3>
                    <span className="text-[10px] bg-primary/10 text-primary dark:text-primary-400 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-primary/10">In Discovery</span>
                </div>
                <div className="p-8">
                    <div className="flex justify-between text-sm mb-4">
                        <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest">Preparation Complete</span>
                        <span className="text-primary dark:text-primary-400 font-black">65%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[65%] rounded-full shadow-[0_0_15px_rgba(32,132,104,0.3)] transition-all duration-1000"></div>
                    </div>
                    <div className="mt-10 flex gap-6 items-center">
                        <div className="flex -space-x-3">
                            <img className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 object-cover" src="https://picsum.photos/id/1/100/100" alt="L1" />
                            <img className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 object-cover" src="https://picsum.photos/id/2/100/100" alt="L2" />
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-400">+2</div>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Legal team assigned to this case</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
