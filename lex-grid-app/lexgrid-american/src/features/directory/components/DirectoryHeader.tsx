// src/features/directory/components/DirectoryHeader.tsx
import React from 'react';
import { ViewMode, Jurisdiction } from '../types';
import { cn } from '@/lib/utils';

interface DirectoryHeaderProps {
    viewMode: ViewMode;
    setViewMode: (v: ViewMode) => void;
    activeJurisdiction: Jurisdiction;
}

export const DirectoryHeader: React.FC<DirectoryHeaderProps> = ({ viewMode, setViewMode, activeJurisdiction }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-10 rounded-[40px] border border-white/20 dark:border-white/10 shadow-xl shadow-slate-200/20 transition-colors duration-300">
            <div>
                <h1 className="text-4xl font-black mb-3 text-slate-900 dark:text-white tracking-tighter uppercase">Legal Experts</h1>
                <p className="text-slate-400 dark:text-slate-500 max-w-xl font-bold uppercase tracking-widest text-[11px]">Vetted top-tier legal professionals powered by LexGrid Match™ technology in {activeJurisdiction}.</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl transition-colors duration-300">
                <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                        "px-6 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest",
                        viewMode === 'grid' ? "bg-white dark:bg-slate-900 text-primary dark:text-primary-400 shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-primary"
                    )}
                >
                    Grid View
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                        "px-6 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest",
                        viewMode === 'list' ? "bg-white dark:bg-slate-900 text-primary dark:text-primary-400 shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-primary"
                    )}
                >
                    List View
                </button>
            </div>
        </div>
    );
};
