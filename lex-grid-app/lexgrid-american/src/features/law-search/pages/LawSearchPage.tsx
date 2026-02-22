// src/features/law-search/pages/LawSearchPage.tsx
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleGenAI, Type } from "@google/genai";
import Layout from '../../../components/layout/Layout';
import { RootState, setLoading, setResults, setError, addToHistory } from '../../../../store';
import { SearchPanel } from '../components/SearchPanel';
import { LawDetail } from '../components/LawDetail';
import { LawItem } from '../types';

interface LawSearchPageProps {
    theme?: string;
    toggleTheme?: () => void;
}

const LawSearchPage: React.FC<LawSearchPageProps> = ({ theme, toggleTheme }) => {
    const dispatch = useDispatch();
    const { results, loading, error, history } = useSelector((state: RootState) => state.lawSearch);

    const [searchQuery, setSearchQuery] = useState('');
    const [jurisdiction, setJurisdiction] = useState<'USA' | 'Canada'>('USA');
    const [selectedLawId, setSelectedLawId] = useState<string | null>(null);

    const selectedLaw = useMemo(() => {
        return results.find((l: LawItem) => l.id === selectedLawId) || null;
    }, [results, selectedLawId]);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        dispatch(setLoading(true));
        dispatch(setError(null));
        dispatch(addToHistory(searchQuery));

        try {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error("GEMINI_API_KEY is not set");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const prompt = `Search for primary laws, statutes, or codes in ${jurisdiction} related to "${searchQuery}". 
                   Return at least 3 relevant results. For each result, provide:
                   1. Formal title
                   2. Legal code/citation
                   3. A 2-sentence summary
                   4. A "Plain Language" explanation for a non-lawyer
                   5. 3 tags
                   6. 2 related court cases (title and citation).`;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                title: { type: Type.STRING },
                                code: { type: Type.STRING },
                                summary: { type: Type.STRING },
                                explanation: { type: Type.STRING },
                                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                                relatedCases: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            title: { type: Type.STRING },
                                            citation: { type: Type.STRING }
                                        },
                                        required: ["title", "citation"]
                                    }
                                }
                            },
                            required: ["title", "code", "summary", "explanation", "tags", "relatedCases"]
                        }
                    }
                },
            });

            const parsedResults = JSON.parse(response.text || "[]");

            // Extract grounding sources
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            const sources = groundingChunks?.map((chunk: any) => ({
                uri: chunk.web?.uri,
                title: chunk.web?.title
            })).filter((s: any) => s.uri) || [];

            const resultsWithJurisdiction = parsedResults.map((item: any, idx: number) => ({
                ...item,
                id: item.id || `law-${idx}-${Date.now()}`,
                jurisdiction,
                sources
            }));

            dispatch(setResults(resultsWithJurisdiction));
            if (resultsWithJurisdiction.length > 0) {
                setSelectedLawId(resultsWithJurisdiction[0].id);
            }
        } catch (err: any) {
            console.error("Search failed:", err);
            dispatch(setError("Failed to retrieve legal data. Please try again."));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                <SearchPanel
                    jurisdiction={jurisdiction}
                    setJurisdiction={setJurisdiction}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                    history={history}
                    loading={loading}
                    error={error}
                    results={results}
                    selectedLawId={selectedLawId}
                    setSelectedLawId={setSelectedLawId}
                />

                <div className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto custom-scrollbar p-10 transition-colors duration-300">
                    <LawDetail selectedLaw={selectedLaw} />
                </div>
            </div>
        </Layout>
    );
};

export default LawSearchPage;
