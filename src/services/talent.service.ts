import { apiClient } from '@/lib/api-client';

export interface Talent {
    id: string;
    name: string;
    avatar?: string;
    title: string;
    bio: string;
    skills: string[];
    location?: string;
    experience?: number;
    availability?: string;
    hourlyRate?: number;
    rating?: number;
    reviewCount?: number;
    createdAt?: string;
}

export const talentService = {
    getAll: (params?: { page?: number; limit?: number; search?: string; skill?: string; location?: string }) =>
        apiClient.get<{ professionals: Talent[]; total: number }>('/api/talent', { params })
};
