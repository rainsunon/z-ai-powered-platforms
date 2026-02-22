// src/features/analysis/components/ShareModal.tsx
import React from 'react';

interface ShareModalProps {
    onClose: () => void;
    onCopy: (text: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose, onCopy }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md p-10 shadow-3xl border border-slate-100 dark:border-slate-800 space-y-8 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Share Analysis</h3>
                    <button onClick={onClose} className="material-icons text-slate-400 hover:text-slate-600">close</button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Share this secure analysis with your legal team or stakeholders. Links are valid for 24 hours.</p>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-900 dark:text-white truncate max-w-[200px]">lexgrid.ai/secure/analysis/3882-xa2...</p>
                        <button
                            onClick={() => onCopy('https://lexgrid.ai/secure/analysis/3882-xa2-991')}
                            className="px-4 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl"
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
};
