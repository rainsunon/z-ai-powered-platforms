// src/features/scheduling/components/AvailableSlots.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export const AvailableSlots: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-50 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                    Available Slots <span className="text-slate-300 dark:text-slate-600 font-bold text-xs ml-4 tracking-widest">Thursday, Oct 3</span>
                </h2>
                <div className="text-[10px] font-black text-primary dark:text-primary-400 uppercase tracking-widest border-b-2 border-primary dark:border-primary-400 pb-1 cursor-pointer">45 Min Session</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['09:00 AM', '10:30 AM', '11:15 AM', '01:45 PM', '03:00 PM', '04:30 PM'].map((time, i) => (
                    <button
                        key={time}
                        className={cn(
                            "py-5 px-6 rounded-2xl text-xs font-black transition-all border-2 uppercase tracking-widest",
                            i === 2 ? "border-primary dark:border-primary-400 bg-primary/5 dark:bg-primary-900/20 text-primary dark:text-primary-400 shadow-lg" :
                                i === 5 ? "bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-700 border-slate-50 dark:border-slate-800 cursor-not-allowed" : "bg-slate-50/50 dark:bg-slate-800/50 border-slate-50 dark:border-slate-800 text-slate-500 dark:text-slate-500 hover:border-primary/30 hover:text-primary dark:hover:text-primary-400"
                        )}
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
    );
};
