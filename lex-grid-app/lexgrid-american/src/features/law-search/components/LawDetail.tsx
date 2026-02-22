// src/features/law-search/components/LawDetail.tsx
import React from 'react';
import { LawItem } from '../types';

interface LawDetailProps {
    selectedLaw: LawItem | null;
}

export const LawDetail: React.FC<LawDetailProps> = ({ selectedLaw }) => {
    if (!selectedLaw) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <span className="material-icons text-6xl">balance</span>
                </div>
                <div className="max-w-md">
                    <h2 className="text-2xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-tighter">Global Statute Repository</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4 leading-relaxed">
                        Enter a query to research laws, acts, and regulations across North America. LexGrid AI will provide summarized insights and relevant court precedents.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedLaw.jurisdiction === 'USA' ? '🇺🇸' : '🇨🇦'}</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{selectedLaw.jurisdiction} Statutory Authority</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">{selectedLaw.title}</h1>
                <p className="text-lg font-bold text-slate-500 dark:text-slate-400 italic">{selectedLaw.code}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-icons text-sm">description</span> Statutory Summary
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                        {selectedLaw.summary}
                    </p>
                </div>

                <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-[32px] border-2 border-primary/20 dark:border-primary-400/20 space-y-6">
                    <h4 className="text-[10px] font-black text-primary dark:text-primary-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-icons text-sm text-primary">auto_awesome</span> AI Plain-Language Explain
                    </h4>
                    <p className="text-sm text-primary dark:text-primary-300 leading-relaxed font-bold italic">
                        "{selectedLaw.explanation}"
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 space-y-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precedent & Related Case Law</h4>
                <div className="space-y-4">
                    {selectedLaw.relatedCases.map((c, i) => (
                        <div key={i} className="group p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-primary transition-all cursor-pointer">
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{c.title}</p>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1 italic">{c.citation}</p>
                            </div>
                            <span className="material-icons text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                        </div>
                    ))}
                </div>
            </div>

            {selectedLaw.sources && selectedLaw.sources.length > 0 && (
                <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-[32px] space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grounding Sources</h4>
                    <div className="flex flex-wrap gap-4">
                        {selectedLaw.sources.map((source, i) => (
                            <a
                                key={i}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-primary hover:scale-105 transition-all shadow-sm"
                            >
                                <span className="material-icons text-sm">link</span>
                                {source.title || "External Reference"}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <button className="flex-1 py-5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                    <span className="material-icons text-lg">bookmark_add</span> Save to Case Files
                </button>
                <button className="flex-1 py-5 bg-white dark:bg-slate-900 text-slate-500 font-black text-xs uppercase tracking-widest rounded-3xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <span className="material-icons text-lg">content_copy</span> Copy Citation
                </button>
            </div>
        </div>
    );
};
