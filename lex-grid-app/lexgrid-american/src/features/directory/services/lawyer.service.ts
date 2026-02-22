import { apiClient } from '@/lib/api-client';

export interface Lawyer {
    id: string;
    name: string;
    specialty: string;
    jurisdiction: 'USA' | 'Canada';
    location: string;
    rating: string | null;
    reviewCount: number;
    experience: number | null;
    level: string | null;
    barNumber: string | null;
    profileImage: string | null;
    bio: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface LawyerFilters {
    jurisdiction?: 'USA' | 'Canada';
    specialty?: string;
    location?: string;
    minRating?: number;
}

export const lawyerService = {
    async getLawyers(filters?: LawyerFilters): Promise<Lawyer[]> {
        const response = await apiClient.get('/api/lawyers', { params: filters });
        return response.data.data;
    },

    async getLawyerById(id: string): Promise<Lawyer> {
        const response = await apiClient.get(`/api/lawyers/${id}`);
        return response.data.data;
    },
};
