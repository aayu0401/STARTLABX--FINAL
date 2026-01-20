import { apiClient } from '@/lib/api-client';

export interface Startup {
    id: string;
    name: string;
    tagline?: string;
    description: string;
    industry: string;
    stage: string;
    equityOffered?: number;
    teamSize?: number;
    technologies: string[];
    logoUrl?: string;
    websiteUrl?: string;
    foundedDate?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    isSaved?: boolean;
}

export const startupService = {
    getAll: (params?: {
        page?: number;
        limit?: number;
        industry?: string;
        stage?: string;
        sort?: string;
    }) =>
        apiClient.get<{ startups: Startup[]; total: number }>('/api/startups', { params }),

    getById: (id: string) =>
        apiClient.get<Startup>(`/api/startups/${id}`),

    create: (data: Partial<Startup>) =>
        apiClient.post<Startup>('/api/startups', data),

    update: (id: string, data: Partial<Startup>) =>
        apiClient.put<Startup>(`/api/startups/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/api/startups/${id}`),

    search: (query: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ startups: Startup[] }>('/api/startups/search', { params: { q: query, ...params } }),

    getTrending: (params?: { limit?: number }) =>
        apiClient.get<{ startups: Startup[] }>('/api/startups/trending', { params }),

    save: (id: string) =>
        apiClient.post(`/api/startups/${id}/save`),

    unsave: (id: string) =>
        apiClient.delete(`/api/startups/${id}/save`),

    getSaved: () =>
        apiClient.get<{ startups: Startup[] }>('/api/startups/saved'),
};

export interface TalentProfile {
    id: string;
    userId: string;
    professionalTitle: string;
    bio: string;
    skills: string[];
    experienceYears: number;
    equityExpectation?: number;
    hourlyRate?: number;
    availability: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    visibility: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    isSaved?: boolean;
}

export const talentService = {
    getAll: (params?: {
        page?: number;
        limit?: number;
        skills?: string;
        experience?: string;
        availability?: string;
        sort?: string;
    }) =>
        apiClient.get<{ profiles: TalentProfile[]; total: number }>('/api/talent', { params }),

    getById: (id: string) =>
        apiClient.get<TalentProfile>(`/api/talent/${id}`),

    createProfile: (data: Partial<TalentProfile>) =>
        apiClient.post<TalentProfile>('/api/talent/profile', data),

    updateProfile: (id: string, data: Partial<TalentProfile>) =>
        apiClient.put<TalentProfile>(`/api/talent/${id}`, data),

    search: (query: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ profiles: TalentProfile[] }>('/api/talent/search', { params: { q: query, ...params } }),

    getTrending: (params?: { limit?: number }) =>
        apiClient.get<{ profiles: TalentProfile[] }>('/api/talent/trending', { params }),

    save: (id: string) =>
        apiClient.post(`/api/talent/${id}/save`),

    unsave: (id: string) =>
        apiClient.delete(`/api/talent/${id}/save`),

    getSaved: () =>
        apiClient.get<{ profiles: TalentProfile[] }>('/api/talent/saved'),
};
