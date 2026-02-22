// src/features/law-search/types/index.ts
export interface LawItem {
    id: string;
    title: string;
    code: string;
    jurisdiction: string;
    summary: string;
    explanation: string;
    tags: string[];
    relatedCases: { title: string; citation: string }[];
    sources?: { uri: string; title: string }[];
}
