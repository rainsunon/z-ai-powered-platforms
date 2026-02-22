// src/features/ai-chat/components/ChatHeader.tsx
import React from 'react';

export const ChatHeader: React.FC = () => {
    return (
        <header className="h-14 flex items-center justify-between px-8 bg-white/10 dark:bg-slate-900/50 backdrop-blur-xl border-b border-white/10 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <h2 className="text-[10px] font-black text-white/60 dark:text-slate-400 uppercase tracking-widest">Current Session:</h2>
                <span className="text-xs font-black text-white dark:text-slate-200 uppercase tracking-tighter">Ontario Tenancy Dispute (Case #4492)</span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 dark:bg-slate-800 text-white dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-white/30 dark:hover:bg-slate-700 transition-colors">
                <span className="material-icons text-xs">share</span> Export Session
            </button>
        </header>
    );
};
