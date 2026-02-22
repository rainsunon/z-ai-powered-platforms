// src/features/dashboard/components/WelcomeHeader.tsx
import React from 'react';

export const WelcomeHeader: React.FC = () => {
    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back, Marcus</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">You have 3 active legal proceedings and 1 pending document review.</p>
        </div>
    );
};
