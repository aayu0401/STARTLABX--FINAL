import { apiClient } from '@/lib/api-client';

export interface Startup {
    id: string;
    name: string;
    tagline: string;
    description: string;
    logo?: string;
    coverImage?: string;
    industry: string;
    stage: 'idea' | 'mvp' | 'early' | 'growth' | 'scale';
    fundingStage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c+';
    fundingRaised: number;
    teamSize: number;
    location: string;
    website?: string;
    founded: string;
    tags: string[];
    openPositions: number;
    matchScore?: number;
    isSaved: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Professional {
    id: string;
    name: string;
    title: string;
    bio: string;
    avatar?: string;
    coverImage?: string;
    skills: string[];
    experience: number;
    location: string;
    availability: 'available' | 'open-to-offers' | 'not-looking';
    compensationType: ('hourly' | 'equity' | 'salary' | 'hybrid')[];
    hourlyRate?: number;
    equityExpectation?: string;
    portfolio: {
        title: string;
        description: string;
        url?: string;
        image?: string;
    }[];
    workHistory: {
        company: string;
        role: string;
        duration: string;
        description: string;
    }[];
    education: {
        institution: string;
        degree: string;
        year: string;
    }[];
    rating: number;
    reviewCount: number;
    matchScore?: number;
    isSaved: boolean;
    createdAt: string;
}

export interface SearchFilters {
    query?: string;
    industry?: string[];
    stage?: string[];
    location?: string;
    skills?: string[];
    experience?: string;
    availability?: string;
    compensationType?: string[];
    minRate?: number;
    maxRate?: number;
    page?: number;
    limit?: number;
    sortBy?: 'relevance' | 'newest' | 'match-score' | 'rating';
}

export const startupService = {
    // Get all startups
    getStartups: async (filters?: SearchFilters) => {
        try {
            return await apiClient.get<{ startups: Startup[]; total: number }>('/api/startups', { params: filters });
        } catch (error) {
            console.warn("Startup API failed, using mock data.", error);
            const mockStartups: Startup[] = [
                {
                    id: '1',
                    name: 'Nebula AI',
                    tagline: 'AI for the masses',
                    description: 'Democratizing artificial intelligence for small businesses.',
                    industry: 'AI',
                    stage: 'early',
                    fundingStage: 'seed',
                    fundingRaised: 1500000,
                    teamSize: 12,
                    location: 'San Francisco, CA',
                    founded: '2023',
                    tags: ['ai', 'b2b', 'saas'],
                    openPositions: 3,
                    isSaved: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Nebula',
                    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80'
                },
                {
                    id: '2',
                    name: 'GreenEarth',
                    tagline: 'Sustainable energy solutions',
                    description: 'Renewable energy tracking on the blockchain.',
                    industry: 'CleanTech',
                    stage: 'growth',
                    fundingStage: 'series-a',
                    fundingRaised: 5000000,
                    teamSize: 25,
                    location: 'Berlin, Germany',
                    founded: '2022',
                    tags: ['cleantech', 'blockchain', 'energy'],
                    openPositions: 5,
                    isSaved: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Green',
                    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80'
                }
            ];
            return { data: { startups: mockStartups, total: 2 } };
        }
    },

    // Get startup by ID
    getStartup: async (id: string) => {
        try {
            return await apiClient.get<Startup>(`/api/startups/${id}`);
        } catch (error) {
            return {
                data: {
                    id: id,
                    name: 'Nebula AI',
                    tagline: 'AI for the masses',
                    description: 'Democratizing artificial intelligence for small businesses.',
                    industry: 'AI',
                    stage: 'early',
                    fundingStage: 'seed',
                    fundingRaised: 1500000,
                    teamSize: 12,
                    location: 'San Francisco, CA',
                    founded: '2023',
                    tags: ['ai', 'b2b', 'saas'],
                    openPositions: 3,
                    isSaved: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Nebula',
                    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80'
                }
            };
        }
    },

    // Create startup
    createStartup: async (data: Partial<Startup> & { logoFile?: File; coverFile?: File }) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'logoFile' || key === 'coverFile') {
                    if (value) formData.append(key, value as File);
                } else if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            return await apiClient.post<Startup>('/api/startups', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error) {
            return {
                data: {
                    id: 'new-startup-' + Date.now(),
                    ...data,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                } as Startup
            };
        }
    },

    // Update startup
    updateStartup: (id: string, data: Partial<Startup>) =>
        apiClient.put<Startup>(`/api/startups/${id}`, data),

    // Delete startup
    deleteStartup: (id: string) =>
        apiClient.delete(`/api/startups/${id}`),

    // Save/unsave startup
    saveStartup: (id: string) =>
        apiClient.post(`/api/startups/${id}/save`),

    unsaveStartup: (id: string) =>
        apiClient.delete(`/api/startups/${id}/save`),

    // Get saved startups
    getSavedStartups: (params?: { page?: number; limit?: number }) =>
        apiClient.get<{ startups: Startup[]; total: number }>('/api/startups/saved', { params }),

    // Search startups
    searchStartups: (query: string, filters?: SearchFilters) =>
        apiClient.get<{ startups: Startup[]; total: number }>('/api/startups/search', {
            params: { q: query, ...filters },
        }),

    // Get recommended startups
    getRecommended: (limit?: number) =>
        apiClient.get<Startup[]>('/api/startups/recommended', { params: { limit } }),

    // Get trending startups
    getTrending: async (limit?: number) => {
        try {
            return await apiClient.get<Startup[]>('/api/startups/trending', { params: { limit } });
        } catch (error) {
            return {
                data: [
                    {
                        id: '1',
                        name: 'Nebula AI',
                        tagline: 'AI for the masses',
                        description: 'Democratizing artificial intelligence for small businesses.',
                        industry: 'AI',
                        stage: 'early',
                        fundingStage: 'seed',
                        fundingRaised: 1500000,
                        teamSize: 12,
                        location: 'San Francisco, CA',
                        founded: '2023',
                        tags: ['ai', 'b2b', 'saas'],
                        openPositions: 3,
                        isSaved: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Nebula',
                        coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80'
                    }
                ]
            };
        }
    },
};


