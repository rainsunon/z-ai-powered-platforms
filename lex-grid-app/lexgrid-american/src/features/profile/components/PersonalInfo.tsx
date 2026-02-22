// src/features/profile/components/PersonalInfo.tsx
import React from 'react';

export const PersonalInfo: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl border border-slate-50 dark:border-slate-800 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-8">
                <div className="relative group">
                    <img
                        src="https://picsum.photos/id/64/200/200"
                        className="w-32 h-32 rounded-[32px] object-cover border-4 border-slate-50 dark:border-slate-800 shadow-xl group-hover:brightness-75 transition-all"
                        alt="Profile"
                    />
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons text-white">camera_alt</span>
                    </button>
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Marcus Sterling</h3>
                    <p className="text-primary font-black text-xs uppercase tracking-widest">Senior Partner • Criminal Defense</p>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">Verified Professional</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input type="text" defaultValue="Marcus Sterling" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Bar Number</label>
                    <input type="text" defaultValue="USA-NY-992384" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Work Email</label>
                    <input type="email" defaultValue="m.sterling@lexgrid-legal.com" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 009-2234" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white" />
                </div>
            </div>

            <div className="pt-6">
                <button className="bg-primary text-white font-black text-[10px] uppercase tracking-widest py-4 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    Save Changes
                </button>
            </div>
        </div>
    );
};
