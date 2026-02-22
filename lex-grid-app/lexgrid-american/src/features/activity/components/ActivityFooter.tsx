// src/features/activity/components/ActivityFooter.tsx
import React from 'react';

export const ActivityFooter: React.FC = () => {
    return (
        <footer className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <p>Sovereign Audit Trail: LX-TRAIL-2024-88A</p>
            <div className="flex gap-6">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ledger Verified</span>
                <span className="flex items-center gap-1.5"><span className="material-icons text-sm">lock</span> E2E Encrypted</span>
            </div>
        </footer>
    );
};
