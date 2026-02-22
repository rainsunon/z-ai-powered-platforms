// src/features/ai-chat/components/IntelligenceSidebar.tsx
import React from 'react';

export const IntelligenceSidebar: React.FC = () => {
    return (
        <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 hidden xl:flex flex-col p-8 z-20 shadow-2xl overflow-y-auto custom-scrollbar transition-colors duration-300">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-10">Case Intelligence</h3>

            <div className="space-y-10">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-3">Success Probability</p>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl font-black text-primary dark:text-primary-400 tracking-tighter">74%</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">+2.4% / wk</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary dark:bg-primary-500 h-full w-[74%] shadow-[0_0_10px_rgba(32,132,104,0.3)]"></div>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Relevant Statutes</p>
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4 group cursor-pointer">
                            <span className="material-icons text-primary dark:text-primary-400 text-lg mt-1 group-hover:scale-110 transition-transform">bookmark</span>
                            <div>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter">RTA Section 48</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Notice by Landlord at End of Term</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 group cursor-pointer">
                            <span className="material-icons text-primary dark:text-primary-400 text-lg mt-1 group-hover:scale-110 transition-transform">bookmark</span>
                            <div>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter">RTA Section 202</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Good Faith Requirements</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="mt-auto pt-10">
                    <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-3xl border-2 border-primary/20 dark:border-primary/40 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
                        <p className="text-[9px] font-black text-primary dark:text-primary-400 uppercase tracking-widest mb-3">Upcoming Deadline</p>
                        <p className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-tighter">LTB Hearing Filing</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1">Oct 24, 2024 (4 days left)</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
