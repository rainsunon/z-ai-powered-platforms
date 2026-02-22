// src/features/scheduling/components/CameraPreview.tsx
import React from 'react';

export const CameraPreview: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-50 dark:border-slate-800 transition-colors duration-300">
            <h2 className="text-lg font-black mb-8 flex items-center gap-3 text-slate-900 dark:text-white uppercase tracking-tighter">
                <span className="material-icons text-primary dark:text-primary-400">videocam</span> Camera & Audio Preview
            </h2>
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 mb-8 border border-slate-100 dark:border-slate-800 shadow-2xl group cursor-pointer">
                <img src="https://picsum.photos/id/30/800/450" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Preview" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                    {['mic', 'videocam', 'settings'].map(icon => (
                        <button key={icon} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-2xl flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/10 shadow-xl">
                            <span className="material-icons">{icon}</span>
                        </button>
                    ))}
                </div>
                <div className="absolute top-6 right-6 bg-emerald-500 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse"></div>
            </div>
            <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    <span>Microphone Integrity</span>
                    <span className="text-slate-900 dark:text-slate-200">Built-in Mic (Optimal)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-primary dark:bg-primary-500 h-full w-2/3 shadow-[0_0_10px_rgba(32,132,104,0.4)]"></div>
                </div>
            </div>
        </div>
    );
};
