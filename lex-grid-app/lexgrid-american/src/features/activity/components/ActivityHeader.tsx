// src/features/activity/components/ActivityHeader.tsx
import React from 'react';

interface ActivityHeaderProps {
    search: string;
    setSearch: (s: string) => void;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({ search, setSearch }) => {
    return (
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Activity Intelligence</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium italic">A complete audit log of your legal workflow across the LexGrid network.</p>
            </div>
            <div className="relative w-full md:w-80">
                <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input
                    type="text"
                    placeholder="Filter by keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold text-slate-800 dark:text-white focus:border-primary transition-all outline-none shadow-sm"
                />
            </div>
        </header>
    );
};
