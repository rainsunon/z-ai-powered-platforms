export interface Page {
    id: number;
    content: string;
}

export interface Section {
    id: string;
    title: string;
    pages: Page[];
}

export interface Chapter {
    id: string;
    title: string;
    sections: Section[];
}

export interface FlattenedPage {
    chapter: number;
    section: number;
    page: number;
    absolutePage: number;
    title: string;
    content: string;
}

