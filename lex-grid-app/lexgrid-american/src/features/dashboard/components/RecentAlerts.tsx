// src/features/dashboard/components/RecentAlerts.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const RecentAlerts: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Recent Alerts</h3>
                <button className="text-[10px] text-primary dark:text-primary-400 font-black hover:underline uppercase tracking-widest">Mark all read</button>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 divide-y divide-slate-50 dark:divide-slate-800 overflow-hidden border border-slate-50 dark:border-slate-800 transition-colors duration-300">
                {[
                    { type: 'msg', title: 'Lawyer Message', time: '2m ago', desc: 'Please review the updated retainer agreement for Case #402 before tomorrow\'s filing.', urgent: true },
                    { type: 'ai', title: 'AI System Alert', time: '1h ago', desc: 'AI analysis of the Prosecution\'s Motion is complete. 4 inconsistencies found.' },
                    { type: 'cal', title: 'New Meeting', time: '4h ago', desc: 'Video consultation scheduled with Sarah Parker for June 12th.' }
                ].map((note, i) => (
                    <div key={i} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                        <div className="flex gap-4">
                            <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${note.urgent ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors'}`}>
                                <span className="material-icons text-xl">{note.urgent ? 'priority_high' : note.type === 'ai' ? 'auto_awesome' : 'calendar_today'}</span>
                            </div>
                            <div>
                                <div className="flex justify-between items-start gap-4">
                                    <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-400 transition-colors uppercase tracking-tighter">{note.title}</p>
                                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{note.time}</span>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 leading-relaxed font-medium line-clamp-2">{note.desc}</p>
                                {note.urgent && (
                                    <div className="mt-3">
                                        <span className="px-3 py-1 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Urgent Action</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Link
                to="/activity"
                className="w-full py-4 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 text-[10px] font-black rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
                View All Activity
                <span className="material-icons text-sm">open_in_new</span>
            </Link>
        </div>
    );
};
