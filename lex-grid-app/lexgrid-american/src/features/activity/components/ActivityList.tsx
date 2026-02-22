// src/features/activity/components/ActivityList.tsx
import React from 'react';
import { ActivityItem, ActivityType } from '../types';

interface ActivityListProps {
    activities: ActivityItem[];
    onClearFilters: () => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onClearFilters }) => {
    const getIcon = (type: ActivityType) => {
        switch (type) {
            case 'chat': return 'smart_toy';
            case 'meeting': return 'videocam';
            case 'email': return 'alternate_email';
            case 'notification': return 'notifications';
            case 'payment': return 'payments';
            default: return 'history';
        }
    };

    const getStatusColor = (statusType?: string) => {
        switch (statusType) {
            case 'success': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            case 'warning': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'info': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activities.length > 0 ? (
                activities.map((item) => (
                    <div
                        key={item.id}
                        className="group bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] shadow-xl border border-slate-50 dark:border-slate-800 hover:shadow-2xl transition-all flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden"
                    >
                        {/* Visual Accent */}
                        <div className={`absolute top-0 left-0 w-2 h-full opacity-40 ${item.statusType === 'error' ? 'bg-red-500' :
                                item.statusType === 'warning' ? 'bg-amber-500' :
                                    'bg-primary'
                            }`}></div>

                        {/* Icon Circle */}
                        <div className="w-16 h-16 rounded-[24px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all flex-shrink-0 shadow-inner">
                            <span className="material-icons text-3xl">{getIcon(item.type)}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-grow space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{item.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(item.statusType)}`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.description}</p>
                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span className="material-icons text-sm">schedule</span>
                                    {item.timestamp}
                                </div>
                                {item.meta && (
                                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">
                                        <span className="material-icons text-sm">label</span>
                                        {item.meta}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-400 transition-all border border-slate-100 dark:border-slate-700">
                                <span className="material-icons text-xl">open_in_new</span>
                            </button>
                            <button className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-all border border-slate-100 dark:border-slate-700">
                                <span className="material-icons text-xl">more_vert</span>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <span className="material-icons text-6xl text-slate-200 dark:text-slate-800 mb-6">history_toggle_off</span>
                    <h3 className="text-2xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-tighter">No activity records found</h3>
                    <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs mt-2">Adjust your filters or try a different search term.</p>
                    <button
                        onClick={onClearFilters}
                        className="mt-8 px-10 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};
