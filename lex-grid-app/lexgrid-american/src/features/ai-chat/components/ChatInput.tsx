// src/features/ai-chat/components/ChatInput.tsx
import React from 'react';

export const ChatInput: React.FC = () => {
    return (
        <div className="p-10 pt-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 dark:bg-slate-800 backdrop-blur-md border border-white/20 dark:border-slate-700 text-white dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 dark:hover:bg-slate-700 transition-all">
                        <span className="material-icons text-sm">description</span> Analyze Asset
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20">
                        <span className="material-icons text-sm">insights</span> Predict Court Result
                    </button>
                </div>
                <div className="relative flex items-end gap-3 bg-white dark:bg-slate-800 rounded-3xl p-3 shadow-3xl border-2 border-transparent focus-within:border-primary/30 transition-all">
                    <button className="p-3 text-slate-300 dark:text-slate-500 hover:text-primary transition-colors">
                        <span className="material-icons text-2xl">attach_file</span>
                    </button>
                    <textarea
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3.5 px-2 resize-none custom-scrollbar text-slate-800 dark:text-slate-200 font-medium placeholder-slate-400 focus:outline-none"
                        placeholder="Ask LexGrid about statutes, case law, or document clauses..."
                        rows={1}
                    ></textarea>
                    <button className="p-4 bg-primary text-white rounded-2xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center">
                        <span className="material-icons">send</span>
                    </button>
                </div>
                <p className="text-[10px] text-center text-white/60 dark:text-slate-600 font-black uppercase tracking-[0.2em]">
                    LexGrid AI provides legal information and analysis, not legal advice.
                </p>
            </div>
        </div>
    );
};
