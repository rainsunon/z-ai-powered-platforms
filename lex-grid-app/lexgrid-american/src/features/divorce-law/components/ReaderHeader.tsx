import React from 'react';
import { cn } from '../../../../lib/utils';
import { FlattenedPage } from '../types';

interface ReaderHeaderProps {
    currentPageAbsolute: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
    onGoTo: (page: number) => void;
    isSearchOpen: boolean;
    setIsSearchOpen: (open: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: FlattenedPage[];
    onSearchResultClick: (result: FlattenedPage) => void;
}

export const ReaderHeader: React.FC<ReaderHeaderProps> = ({
    currentPageAbsolute,
    totalPages,
    onNext,
    onPrev,
    onGoTo,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    onSearchResultClick,
}) => {
    const [gotoValue, setGotoValue] = React.useState('');

    const handleGoToSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pageNum = parseInt(gotoValue);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            onGoTo(pageNum);
            setGotoValue('');
        } else {
            alert('Invalid page number');
        }
    };

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <button onClick={onPrev} disabled={currentPageAbsolute === 1} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30">
                        <span className="material-icons text-lg">chevron_left</span>
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Page <span className="text-slate-900 dark:text-white">{currentPageAbsolute}</span> of {totalPages}
                    </span>
                    <button onClick={onNext} disabled={currentPageAbsolute === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30">
                        <span className="material-icons text-lg">chevron_right</span>
                    </button>
                </div>
                <form onSubmit={handleGoToSubmit} className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Go To:</span>
                    <input
                        type="text"
                        className="w-12 h-8 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-black text-center text-slate-900 dark:text-white focus:ring-1 focus:ring-primary focus:outline-none"
                        placeholder="0"
                        value={gotoValue}
                        onChange={(e) => setGotoValue(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            isSearchOpen ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary'
                        )}
                    >
                        <span className="material-icons text-lg">search</span>
                    </button>

                    {/* Search Dropdown */}
                    {isSearchOpen && (
                        <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-3xl border border-slate-200 dark:border-slate-800 p-4 animate-in fade-in slide-in-from-top-2 z-50">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search within book..."
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="mt-4 max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                                {searchQuery ? (
                                    searchResults.length > 0 ? (
                                        searchResults.map((res, i) => (
                                            <button
                                                key={i}
                                                onClick={() => onSearchResultClick(res)}
                                                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                            >
                                                <p className="text-[9px] font-black text-primary uppercase mb-1">Page {res.absolutePage}</p>
                                                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2 italic">"...{res.content.substring(0, 80)}..."</p>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-center py-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">No results found</p>
                                    )
                                ) : (
                                    <p className="text-center py-4 text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Type to search</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:text-primary transition-colors">
                    <span className="material-icons text-lg">bookmark_border</span>
                </button>
                <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center hover:text-primary transition-colors">
                    <span className="material-icons text-lg">print</span>
                </button>
            </div>
        </header>
    );
};
