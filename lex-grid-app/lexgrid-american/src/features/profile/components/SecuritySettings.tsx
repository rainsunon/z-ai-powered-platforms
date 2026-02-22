// src/features/profile/components/SecuritySettings.tsx
import React from 'react';

export const SecuritySettings: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl border border-slate-50 dark:border-slate-800 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <div className="flex items-center gap-4">
                        <span className="material-icons text-emerald-600">verified_user</span>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">MFA is currently active</p>
                    </div>
                    <button className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest">Disable</button>
                </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Jurisdiction Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-4">
                        <span className="text-2xl">🇺🇸</span>
                        <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">USA Federal & State</p>
                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">Active</p>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center gap-4">
                        <span className="text-2xl">🇨🇦</span>
                        <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Canada Provincial</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">Read-Only</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
