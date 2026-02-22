// src/features/scheduling/components/CalendarWidget.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export const CalendarWidget: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-50 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Select Consultation Date</h2>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 dark:text-slate-500 hover:text-primary"><span className="material-icons">chevron_left</span></button>
                    <span className="font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300">October 2024</span>
                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 dark:text-slate-500 hover:text-primary"><span className="material-icons">chevron_right</span></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-4 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-[0.3em]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day}>{day}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <button
                        key={i}
                        className={cn(
                            "aspect-square flex items-center justify-center rounded-2xl text-xs font-black transition-all",
                            i === 4 ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-110" :
                                i < 2 ? "text-slate-200 dark:text-slate-800 cursor-default" : "hover:bg-primary/5 dark:hover:bg-primary/20 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-400"
                        )}
                    >
                        {i + 28 > 31 ? i - 3 : i + 28}
                    </button>
                ))}
            </div>
        </div>
    );
};
