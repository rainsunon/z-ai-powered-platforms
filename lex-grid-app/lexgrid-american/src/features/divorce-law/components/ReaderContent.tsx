import React from 'react';

interface ReaderContentProps {
    chapterTitle: string;
    sectionTitle: string;
    pageContent: string;
}

export const ReaderContent: React.FC<ReaderContentProps> = ({
    chapterTitle,
    sectionTitle,
    pageContent,
}) => {
    return (
        <main className="flex-1 overflow-y-auto custom-scrollbar p-16 bg-slate-50/30 dark:bg-slate-950 transition-colors">
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-16 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 min-h-full animate-in fade-in zoom-in-95 duration-500">
                <div className="space-y-12">
                    <div className="pb-8 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">
                            {chapterTitle}
                        </p>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                            {sectionTitle}
                        </h2>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg leading-loose text-slate-700 dark:text-slate-300 font-serif font-medium tracking-wide">
                            {pageContent}
                        </p>

                        {/* Decorative element for long text */}
                        <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <span className="material-icons text-sm">sticky_note_2</span> Practitioner's Note
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed">
                                "Always cross-reference Section 12 with provincial guidelines if filing in Ontario or British Columbia, as jurisdictional conflicts often arise in multi-property division."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
