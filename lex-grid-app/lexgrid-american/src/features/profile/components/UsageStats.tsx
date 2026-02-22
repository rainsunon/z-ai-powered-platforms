// src/features/profile/components/UsageStats.tsx
import React from 'react';

export const UsageStats: React.FC = () => {
    return (
        <aside className="space-y-6">
            <div className="bg-primary p-8 rounded-[32px] text-white shadow-2xl shadow-primary/30">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-8">Account Usage</p>
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                            <span>AI Queries</span>
                            <span>84%</span>
                        </div>
                        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-white h-full w-[84%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                            <span>File Storage</span>
                            <span>12.4 GB / 50 GB</span>
                        </div>
                        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-white h-full w-1/4"></div>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Upgrade Plan
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-50 dark:border-slate-800 shadow-xl space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</h4>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span className="material-icons text-slate-400 text-sm">login</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Login from NYC</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5 tracking-widest uppercase">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span className="material-icons text-slate-400 text-sm">settings</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Profile Updated</p>
                            <p className="text-[9px] text-slate-400 font-bold mt-0.5 tracking-widest uppercase">Yesterday</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
