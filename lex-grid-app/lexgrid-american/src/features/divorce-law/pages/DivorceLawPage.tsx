import React, { useState, useMemo } from 'react';
import Layout from '../../../components/layout/Layout';
import { MOCK_BOOK } from '../data/mockBook';
import { Sidebar } from '../components/Sidebar';
import { ReaderHeader } from '../components/ReaderHeader';
import { ReaderContent } from '../components/ReaderContent';
import { ReaderFooter } from '../components/ReaderFooter';
import { FlattenedPage } from '../types';

interface DivorceLawPageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const DivorceLawPage: React.FC<DivorceLawPageProps> = ({ theme, toggleTheme }) => {
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [activePageIndex, setActivePageIndex] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Flat list of all pages for easy "Go To" and navigation
    const allPages = useMemo(() => {
        const pages: FlattenedPage[] = [];
        let count = 1;
        MOCK_BOOK.forEach((ch, chIdx) => {
            ch.sections.forEach((s, sIdx) => {
                s.pages.forEach((p, pIdx) => {
                    pages.push({
                        chapter: chIdx,
                        section: sIdx,
                        page: pIdx,
                        absolutePage: count++,
                        title: `${ch.title} > ${s.title}`,
                        content: p.content
                    });
                });
            });
        });
        return pages;
    }, []);

    const totalPages = allPages.length;
    const currentPageObj = allPages.find(p =>
        p.chapter === activeChapterIndex &&
        p.section === activeSectionIndex &&
        p.page === activePageIndex
    );

    const handleNext = () => {
        if (!currentPageObj || currentPageObj.absolutePage >= totalPages) return;
        const next = allPages[currentPageObj.absolutePage];
        setActiveChapterIndex(next.chapter);
        setActiveSectionIndex(next.section);
        setActivePageIndex(next.page);
    };

    const handlePrev = () => {
        if (!currentPageObj || currentPageObj.absolutePage <= 1) return;
        const prev = allPages[currentPageObj.absolutePage - 2];
        setActiveChapterIndex(prev.chapter);
        setActiveSectionIndex(prev.section);
        setActivePageIndex(prev.page);
    };

    const handleGoTo = (pageNum: number) => {
        const target = allPages[pageNum - 1];
        setActiveChapterIndex(target.chapter);
        setActiveSectionIndex(target.section);
        setActivePageIndex(target.page);
    };

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return allPages.filter(p =>
            p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allPages]);

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-white dark:bg-slate-950 transition-colors">

                <Sidebar
                    chapters={MOCK_BOOK}
                    activeChapterIndex={activeChapterIndex}
                    activeSectionIndex={activeSectionIndex}
                    onSelectChapter={(idx) => { setActiveChapterIndex(idx); setActiveSectionIndex(0); setActivePageIndex(0); }}
                    onSelectSection={(cIdx, sIdx) => { setActiveChapterIndex(cIdx); setActiveSectionIndex(sIdx); setActivePageIndex(0); }}
                />

                {/* Reader Area */}
                <div className="flex-1 flex flex-col relative">

                    <ReaderHeader
                        currentPageAbsolute={currentPageObj?.absolutePage || 1}
                        totalPages={totalPages}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        onGoTo={handleGoTo}
                        isSearchOpen={isSearchOpen}
                        setIsSearchOpen={setIsSearchOpen}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchResults={searchResults}
                        onSearchResultClick={(res) => {
                            setActiveChapterIndex(res.chapter);
                            setActiveSectionIndex(res.section);
                            setActivePageIndex(res.page);
                            setIsSearchOpen(false);
                        }}
                    />

                    <ReaderContent
                        chapterTitle={MOCK_BOOK[activeChapterIndex].title}
                        sectionTitle={MOCK_BOOK[activeChapterIndex].sections[activeSectionIndex].title}
                        pageContent={MOCK_BOOK[activeChapterIndex].sections[activeSectionIndex].pages[activePageIndex].content}
                    />

                    <ReaderFooter
                        onNext={handleNext}
                        onPrev={handlePrev}
                        hasNext={!!(currentPageObj && currentPageObj.absolutePage < totalPages)}
                        hasPrev={!!(currentPageObj && currentPageObj.absolutePage > 1)}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default DivorceLawPage;
