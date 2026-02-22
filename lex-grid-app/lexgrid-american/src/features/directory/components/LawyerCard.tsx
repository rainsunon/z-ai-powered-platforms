// src/features/directory/components/LawyerCard.tsx
import React from 'react';
import { Lawyer, ViewMode } from '../types';
import { cn } from '@/lib/utils';

interface LawyerCardProps {
    lawyer: Lawyer;
    viewMode: ViewMode;
    schedulingStatus: { name: string; active: boolean } | null;
    onSchedule: (name: string) => void;
}

export const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer, viewMode, schedulingStatus, onSchedule }) => {
    return (
        <div
            className={cn(
                "group bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-3xl transition-all duration-500 border border-slate-50 dark:border-slate-800 flex",
                viewMode === 'grid' ? "flex-col justify-between hover:-translate-y-2" : "flex-row items-center gap-10 hover:translate-x-2"
            )}
        >
            <div className={cn(viewMode === 'list' && "flex items-center gap-10 flex-grow")}>
                <div className="flex justify-between items-start mb-8 flex-shrink-0">
                    <div className="relative">
                        <img
                            src={`https://picsum.photos/id/${lawyer.id + 20}/200/200`}
                            className={cn(
                                "rounded-3xl object-cover border-4 border-slate-50 dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform",
                                viewMode === 'grid' ? "w-24 h-24" : "w-32 h-32"
                            )}
                            alt={lawyer.name}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 shadow-lg animate-pulse"></div>
                    </div>
                </div>

                <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">{lawyer.name}</h2>
                            <p className="text-xs font-black text-primary dark:text-primary-400 uppercase tracking-widest">{lawyer.specialty}</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-primary/10 dark:bg-primary-900/30 text-primary dark:text-primary-400 text-[9px] font-black px-3 py-1.5 rounded-full border border-primary/10 dark:border-primary-800 inline-block mb-3 tracking-widest uppercase">{lawyer.match} MATCH</div>
                            <div className="flex items-center justify-end text-amber-500 gap-1">
                                <span className="material-icons text-lg">star</span>
                                <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">{lawyer.rating}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 uppercase tracking-widest">{lawyer.loc}</span>
                        <span className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 uppercase tracking-widest">{lawyer.exp} Yrs Exp.</span>
                    </div>

                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold leading-relaxed line-clamp-2 uppercase tracking-tighter italic">{lawyer.bio}</p>
                </div>
            </div>

            <button
                onClick={() => onSchedule(lawyer.name)}
                disabled={schedulingStatus?.name === lawyer.name}
                className={cn(
                    "py-5 bg-primary hover:brightness-110 text-white font-black rounded-3xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-widest text-[10px] disabled:opacity-50 disabled:cursor-not-allowed",
                    viewMode === 'grid' ? "w-full mt-10" : "w-64"
                )}
            >
                <span className={cn("material-icons text-xl", schedulingStatus?.name === lawyer.name && "animate-spin")}>
                    {schedulingStatus?.name === lawyer.name ? 'sync' : 'calendar_today'}
                </span>
                {schedulingStatus?.name === lawyer.name ? 'Processing...' : 'Schedule Consultation'}
            </button>
        </div>
    );
};
