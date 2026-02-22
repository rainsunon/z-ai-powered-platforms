// src/features/directory/components/DirectoryFilters.tsx
import React from 'react';
import { Jurisdiction } from '../types';
import { cn } from '@/lib/utils';

interface DirectoryFiltersProps {
    activeJurisdiction: Jurisdiction;
    setActiveJurisdiction: (j: Jurisdiction) => void;
    specialty: string;
    setSpecialty: (s: string) => void;
    minRating: number;
    setMinRating: (r: number) => void;
    expLevels: string[];
    toggleExpLevel: (l: string) => void;
    resetFilters: () => void;
}

export const DirectoryFilters: React.FC<DirectoryFiltersProps> = ({
    activeJurisdiction,
    setActiveJurisdiction,
    specialty,
    setSpecialty,
    minRating,
    setMinRating,
    expLevels,
    toggleExpLevel,
    resetFilters
}) => {
    return (
        <aside className="w-full xl:w-80 flex-shrink-0 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 dark:border-slate-800 transition-colors duration-300">
                <h3 className="text-sm font-black mb-8 flex items-center gap-3 text-primary dark:text-primary-400 uppercase tracking-[0.2em]">
                    <span className="material-icons">filter_list</span> Search Filters
                </h3>

                <div className="space-y-4 mb-10">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Jurisdiction</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <button
                            onClick={() => setActiveJurisdiction('Canada')}
                            className={cn(
                                "text-[10px] font-black py-3 rounded-xl transition-all uppercase tracking-widest",
                                activeJurisdiction === 'Canada' ? "bg-primary text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-primary"
                            )}
                        >
                            Canada
                        </button>
                        <button
                            onClick={() => setActiveJurisdiction('USA')}
                            className={cn(
                                "text-[10px] font-black py-3 rounded-xl transition-all uppercase tracking-widest",
                                activeJurisdiction === 'USA' ? "bg-primary text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-primary"
                            )}
                        >
                            USA
                        </button>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Legal Specialty</label>
                    <div className="relative">
                        <select
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-5 text-xs focus:ring-primary focus:border-primary appearance-none font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 transition-colors duration-300 outline-none"
                        >
                            <option>All Specialties</option>
                            <option>Corporate Law</option>
                            <option>Criminal Defense</option>
                            <option>Intellectual Property</option>
                            <option>Immigration Law</option>
                            <option>Tax Law</option>
                            <option>Real Estate Law</option>
                            <option>Civil Litigation</option>
                        </select>
                        <span className="material-icons absolute right-4 top-4 text-slate-400 dark:text-slate-600 pointer-events-none">expand_more</span>
                    </div>
                </div>

                <div className="space-y-4 mb-10">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 flex justify-between">
                        Min. Rating <span className="text-primary dark:text-primary-400 tracking-widest">{minRating.toFixed(1)}+ Stars</span>
                    </label>
                    <input
                        className="w-full accent-primary bg-slate-100 dark:bg-slate-800 h-2 rounded-full appearance-none cursor-pointer"
                        type="range"
                        max="5"
                        min="1"
                        step="0.1"
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    />
                </div>

                <div className="space-y-4 mb-10">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Experience</label>
                    <div className="space-y-3">
                        {['Senior (15+ yrs)', 'Mid-Level (5-15 yrs)', 'Junior (1-5 yrs)'].map((lvl) => (
                            <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-700 text-primary dark:bg-slate-800 focus:ring-primary"
                                    checked={expLevels.includes(lvl)}
                                    onChange={() => toggleExpLevel(lvl)}
                                />
                                <span className={cn(
                                    "text-xs font-bold transition-colors uppercase tracking-widest",
                                    expLevels.includes(lvl) ? "text-primary" : "text-slate-600 dark:text-slate-400 group-hover:text-primary"
                                )}>
                                    {lvl}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    onClick={resetFilters}
                    className="w-full py-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-primary dark:text-primary-400 font-black rounded-2xl border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                >
                    Reset All Filters
                </button>
            </div>
            <div className="bg-brand/20 dark:bg-brand/10 backdrop-blur-xl p-8 rounded-3xl border-2 border-brand/20 dark:border-brand/30 text-brand group cursor-help relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-icons text-brand">auto_awesome</span>
                    <span className="font-black text-[10px] uppercase tracking-[0.3em]">LexGrid AI Matching</span>
                </div>
                <p className="text-xs text-brand leading-relaxed font-bold italic">
                    Based on your case "IP Law in {activeJurisdiction === 'Canada' ? 'Toronto' : 'New York'}", we've prioritized high-match candidates with active litigation history.
                </p>
            </div>
        </aside>
    );
};
