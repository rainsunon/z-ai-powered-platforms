// src/features/profile/components/ProfileHeader.tsx
import React from 'react';

export const ProfileHeader: React.FC = () => {
    return (
        <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">User Profile</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">Manage your professional identity and financial preferences.</p>
        </header>
    );
};
