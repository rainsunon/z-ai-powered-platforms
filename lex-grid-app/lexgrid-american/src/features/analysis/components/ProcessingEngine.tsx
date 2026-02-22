// src/features/analysis/components/ProcessingEngine.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ProcessingEngineProps {
    extractionProgress: number;
    isExtracting: boolean;
}

export const ProcessingEngine: React.FC<ProcessingEngineProps> = ({ extractionProgress, isExtracting }) => {
    return (
        <div className="bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 shadow-xl relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800 dark:text-white uppercase tracking-tighter">
                        AI Processing Engine <span className="text-primary dark:text-primary-400 text-[10px] px-3 py-1 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20 font-black tracking-[0.2em]">LIVE</span>
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic mt-1">Analyzing 4,200 legal precedents and internal risk factors...</p>
                </div>
                <p className="text-lg font-black text-primary dark:text-primary-400 tracking-tighter">{extractionProgress}% Complete</p>
            </div>
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative z-10">
                <div
                    className="h-full bg-primary relative transition-all duration-300"
                    style={{ width: `${extractionProgress}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
            </div>
            <div className="flex gap-10 mt-8 relative z-10">
                {[
                    { label: 'Entity Extraction', done: extractionProgress > 30 },
                    { label: 'Precedent Search', done: extractionProgress > 60 },
                    { label: 'Clause Conflict Analysis', done: extractionProgress === 100 }
                ].map((task, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        <span className={cn("material-icons text-sm", task.done ? 'text-primary' : (isExtracting ? 'animate-spin' : 'text-slate-300'))}>
                            {task.done ? 'check_circle' : 'sync'}
                        </span>
                        {task.label}
                    </div>
                ))}
            </div>
        </div>
    );
};
