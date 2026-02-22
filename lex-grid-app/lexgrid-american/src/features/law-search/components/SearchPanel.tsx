// src/features/law-search/components/SearchPanel.tsx
import React from 'react';

interface SearchPanelProps {
    jurisdiction: 'USA' | 'Canada';
    setJurisdiction: (j: 'USA' | 'Canada') => void;
    searchQuery: string;
    setSearchQuery: (s: string) => void;
    handleSearch: (e?: React.FormEvent) => void;
    history: string[];
    loading: boolean;
    error: string | null;
    results: any[];
    selectedLawId: string | null;
    setSelectedLawId: (id: string) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
    jurisdiction,
    setJurisdiction,
    searchQuery,
    setSearchQuery,
    handleSearch,
    history,
    loading,
    error,
    results,
    selectedLawId,
    setSelectedLawId
}) => {
    return (
        <div className="w-1/3 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
                <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Global Law Search</h2>

                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setJurisdiction('USA')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${jurisdiction === 'USA' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
                    >
                        USA
                    </button>
                    <button
                        onClick={() => setJurisdiction('Canada')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${jurisdiction === 'Canada' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
                    >
                        Canada
                    </button>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input
                        type="text"
                        placeholder="Search statutes, codes..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 placeholder-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" hidden></button>
                </form>

                {history.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {history.slice(0, 3).map((term, i) => (
                            <button
                                key={i}
                                onClick={() => { setSearchQuery(term); handleSearch(); }}
                                className="text-[9px] font-black uppercase text-slate-400 hover:text-primary transition-colors"
                            >
                                #{term}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full p-10 text-center animate-pulse">
                        <span className="material-icons text-primary text-4xl mb-4 animate-spin">auto_awesome</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI is researching statutes...</p>
                    </div>
                ) : results.length > 0 ? (
                    results.map((law) => (
                        <button
                            key={law.id}
                            onClick={() => setSelectedLawId(law.id)}
                            className={`w-full text-left p-6 border-b border-slate-50 dark:border-slate-800 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group ${selectedLawId === law.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                        >
                            <p className="text-[10px] font-black text-primary dark:text-primary-400 uppercase tracking-widest mb-1">{law.code}</p>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-primary transition-colors">{law.title}</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{law.summary}</p>
                        </button>
                    ))
                ) : (
                    <div className="p-10 text-center text-slate-400">
                        <span className="material-icons text-4xl mb-2">find_in_page</span>
                        <p className="text-[10px] font-black uppercase tracking-widest">Search to discover statutes</p>
                        {error && <p className="text-red-400 text-[9px] mt-2 font-bold uppercase">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};
