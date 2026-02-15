import { apiClient } from '@/lib/api-client';

export interface SearchResult {
    type: 'user' | 'startup' | 'post' | 'community';
    id: string;
    title: string;
    description: string;
    image?: string;
    metadata?: Record<string, any>;
    relevance: number;
}

export interface SearchFilters {
    type?: ('user' | 'startup' | 'post' | 'community')[];
    dateRange?: {
        from?: string;
        to?: string;
    };
    location?: string;
    industry?: string[];
    skills?: string[];
    [key: string]: any;
}

export const searchService = {
    // Global search
    search: (query: string, params?: {
        page?: number;
        limit?: number;
        filters?: SearchFilters;
    }) =>
        apiClient.get<{ results: SearchResult[]; total: number; facets: any }>('/api/search', {
            params: { q: query, ...params },
        }),

    // Search by type
    searchByType: (type: 'user' | 'startup' | 'post' | 'community', query: string, params?: any) =>
        apiClient.get<{ results: SearchResult[]; total: number }>(`/api/search/${type}`, {
            params: { q: query, ...params },
        }),

    // Get search suggestions
    getSuggestions: (query: string, limit?: number) =>
        apiClient.get<string[]>('/api/search/suggestions', {
            params: { q: query, limit },
        }),

    // Get recent searches
    getRecentSearches: (limit?: number) =>
        apiClient.get<string[]>('/api/search/recent', { params: { limit } }),

    // Save search
    saveSearch: (query: string, filters?: SearchFilters) =>
        apiClient.post('/api/search/save', { query, filters }),

    // Get saved searches
    getSavedSearches: () =>
        apiClient.get<{ id: string; query: string; filters?: SearchFilters; createdAt: string }[]>('/api/search/saved'),

    // Delete saved search
    deleteSavedSearch: (id: string) =>
        apiClient.delete(`/api/search/saved/${id}`),

    // Get trending searches
    getTrendingSearches: (limit?: number) =>
        apiClient.get<{ query: string; count: number }[]>('/api/search/trending', { params: { limit } }),

    // Clear search history
    clearHistory: () =>
        apiClient.delete('/api/search/history'),
};
