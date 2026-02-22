import React from 'react';
import { cn } from '../../../../lib/utils';
import { Chapter } from '../types';

interface SidebarProps {
    chapters: Chapter[];
    activeChapterIndex: number;
    activeSectionIndex: number;
    onSelectChapter: (index: number) => void;
    onSelectSection: (chapterIndex: number, sectionIndex: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    chapters,
    activeChapterIndex,
    activeSectionIndex,
    onSelectChapter,
    onSelectSection,
}) => {
    return (
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-900/50">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Legal Manual</h2>
                <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">Cross-Border Dissolution: A Practitioner's Manual</h1>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {chapters.map((chapter, chIdx) => (
                    <div key={chapter.id} className="space-y-1">
                        <button
                            onClick={() => onSelectChapter(chIdx)}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-xs font-black uppercase tracking-tight transition-colors",
                                activeChapterIndex === chIdx
                                    ? 'bg-primary text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                            )}
                        >
                            {chapter.title}
                        </button>
                        <div className="ml-4 border-l-2 border-slate-200 dark:border-slate-800 pl-4 space-y-1 mt-1">
                            {chapter.sections.map((section, sIdx) => (
                                <button
                                    key={section.id}
                                    onClick={() => onSelectSection(chIdx, sIdx)}
                                    className={cn(
                                        "w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors",
                                        activeChapterIndex === chIdx && activeSectionIndex === sIdx
                                            ? 'text-primary'
                                            : 'text-slate-400 dark:text-slate-500 hover:text-primary'
                                    )}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};
