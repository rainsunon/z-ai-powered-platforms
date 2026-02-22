// src/features/activity/components/ActivityFilters.tsx
import React from 'react';
import { ActivityType } from '../types';

interface ActivityFiltersProps {
    filter: ActivityType;
    setFilter: (f: ActivityType) => void;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({ filter, setFilter }) => {
    return (
        <div className="flex flex-wrap gap-4 border-b border-slate-200 dark:border-slate-800 pb-1">
            {([
                { id: 'all', label: 'All History', icon: 'history' },
                { id: 'chat', label: 'AI Chats', icon: 'smart_toy' },
                { id: 'meeting', label: 'Meetings', icon: 'videocam' },
                { id: 'email', label: 'Emails', icon: 'alternate_email' },
                { id: 'notification', label: 'Alerts', icon: 'notifications' },
                { id: 'payment', label: 'Payments', icon: 'payments' }
            ] as const).map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${filter === cat.id
                            ? 'text-primary'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                >
                    <span className="material-icons text-lg">{cat.icon}</span>
                    {cat.label}
                    {filter === cat.id && <div className="absolute bottom-[-4px] left-0 right-0 h-1 bg-primary rounded-full"></div>}
                </button>
            ))}
        </div>
    );
};
