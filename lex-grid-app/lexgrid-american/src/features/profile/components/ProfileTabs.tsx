// src/features/profile/components/ProfileTabs.tsx
import React from 'react';

interface ProfileTabsProps {
    activeTab: 'info' | 'payment' | 'security';
    setActiveTab: (tab: 'info' | 'payment' | 'security') => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-1">
            {(['info', 'payment', 'security'] as const).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab
                            ? 'text-primary'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                >
                    {tab === 'info' ? 'Account Details' : tab === 'payment' ? 'Payment Methods' : 'Security & Juris'}
                    {activeTab === tab && <div className="absolute bottom-[-4px] left-0 right-0 h-1 bg-primary rounded-full"></div>}
                </button>
            ))}
        </div>
    );
};
