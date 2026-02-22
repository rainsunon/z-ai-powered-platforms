// src/features/directory/pages/DirectoryPage.tsx
import React, { useState, useMemo } from 'react';
import Layout from '../../../components/layout/Layout';
import { ALL_LAWYERS } from '../data/lawyers';
import { Jurisdiction, ViewMode } from '../types';
import { DirectoryFilters } from '../components/DirectoryFilters';
import { DirectoryHeader } from '../components/DirectoryHeader';
import { LawyerCard } from '../components/LawyerCard';
import { Pagination } from '../components/Pagination';

interface DirectoryPageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const DirectoryPage: React.FC<DirectoryPageProps> = ({ theme, toggleTheme }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [activeJurisdiction, setActiveJurisdiction] = useState<Jurisdiction>('Canada');
    const [specialty, setSpecialty] = useState('All Specialties');
    const [minRating, setMinRating] = useState(4.0);
    const [expLevels, setExpLevels] = useState<string[]>(['Senior (15+ yrs)', 'Mid-Level (5-15 yrs)']);
    const [schedulingStatus, setSchedulingStatus] = useState<{ name: string, active: boolean } | null>(null);

    const filteredLawyers = useMemo(() => {
        return ALL_LAWYERS.filter(lawyer => {
            const matchJuris = lawyer.jurisdiction === activeJurisdiction;
            const matchSpecialty = specialty === 'All Specialties' || lawyer.specialty === specialty;
            const matchRating = lawyer.rating >= minRating;
            const matchExp = expLevels.length === 0 || expLevels.includes(lawyer.level);
            return matchJuris && matchSpecialty && matchRating && matchExp;
        });
    }, [activeJurisdiction, specialty, minRating, expLevels]);

    const resetFilters = () => {
        setActiveJurisdiction('Canada');
        setSpecialty('All Specialties');
        setMinRating(4.0);
        setExpLevels(['Senior (15+ yrs)', 'Mid-Level (5-15 yrs)']);
    };

    const toggleExpLevel = (level: string) => {
        setExpLevels(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };

    const handleSchedule = (lawyerName: string) => {
        setSchedulingStatus({ name: lawyerName, active: true });
        setTimeout(() => {
            setSchedulingStatus(null);
            alert(`Consultation request sent to ${lawyerName}. They will confirm within 2 hours.`);
        }, 1000);
    };

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="p-10 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-10 font-sans">
                {/* Filters */}
                <DirectoryFilters
                    activeJurisdiction={activeJurisdiction}
                    setActiveJurisdiction={setActiveJurisdiction}
                    specialty={specialty}
                    setSpecialty={setSpecialty}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    expLevels={expLevels}
                    toggleExpLevel={toggleExpLevel}
                    resetFilters={resetFilters}
                />

                {/* List Content */}
                <section className="flex-grow space-y-10">
                    <DirectoryHeader
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        activeJurisdiction={activeJurisdiction}
                    />

                    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8' : 'flex flex-col gap-6'}`}>
                        {filteredLawyers.map((lawyer) => (
                            <LawyerCard
                                key={lawyer.id}
                                lawyer={lawyer}
                                viewMode={viewMode}
                                schedulingStatus={schedulingStatus}
                                onSchedule={handleSchedule}
                            />
                        ))}

                        {filteredLawyers.length === 0 && (
                            <div className="py-24 text-center bg-white/40 dark:bg-slate-900/40 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 w-full animate-in fade-in duration-500">
                                <span className="material-icons text-6xl text-slate-200 dark:text-slate-800 mb-6">search_off</span>
                                <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">No results matching your filters</h3>
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mt-2">Try adjusting your rating or experience requirements.</p>
                                <button
                                    onClick={resetFilters}
                                    className="mt-8 px-8 py-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all"
                                >
                                    Clear all active filters
                                </button>
                            </div>
                        )}
                    </div>

                    <Pagination />
                </section>
            </div>
        </Layout>
    );
};

export default DirectoryPage;
