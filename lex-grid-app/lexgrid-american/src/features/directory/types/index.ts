export type ViewMode = 'grid' | 'list';
export type Jurisdiction = 'Canada' | 'USA';

export interface Lawyer {
    id: number;
    name: string;
    specialty: string;
    match: string;
    rating: number;
    reviews: number;
    exp: number;
    loc: string;
    jurisdiction: Jurisdiction;
    bio: string;
    level: string;
}
