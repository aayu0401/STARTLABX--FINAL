import { apiClient } from '@/lib/api-client';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    coverImage?: string;
    bio?: string;
    title?: string;
    location?: string;
    website?: string;
    accountType: 'startup' | 'professional';

    // Professional fields
    skills?: string[];
    experience?: number;
    hourlyRate?: number;
    availability?: 'available' | 'open-to-offers' | 'not-looking';

    // Startup fields
    companyName?: string;
    companySize?: number;
    industry?: string;

    // Social
    followers: number;
    following: number;
    connections: number;

    // Stats
    profileViews: number;
    postCount: number;

    isFollowing?: boolean;
    isConnected?: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileRequest {
    name?: string;
    bio?: string;
    title?: string;
    location?: string;
    website?: string;
    skills?: string[];
    experience?: number;
    hourlyRate?: number;
    availability?: string;
    companyName?: string;
    companySize?: number;
    industry?: string;
}

export interface Connection {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    userTitle?: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
}

export const userService = {
    // Get current user profile
    getProfile: async () => {
        try {
            return await apiClient.get<UserProfile>('/api/users/me');
        } catch (error) {
            console.warn("User Profile API failed, using mock data.", error);
            return {
                data: {
                    id: 'demo-user-id',
                    name: 'Demo Founder',
                    email: 'demo@startlabx.com',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
                    bio: 'Passionate about building the future of AI. Serial entrepreneur and tech enthusiast.',
                    title: 'Founder & CEO',
                    location: 'San Francisco, CA',
                    website: 'https://startlabx.com',
                    accountType: 'startup',
                    companyName: 'Future Inc.',
                    companySize: 10,
                    industry: 'AI',
                    followers: 120,
                    following: 45,
                    connections: 300,
                    profileViews: 1540,
                    postCount: 12,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };
        }
    },

    // Get user by ID
    getUser: async (id: string) => {
        try {
            return await apiClient.get<UserProfile>(`/api/users/${id}`);
        } catch (error) {
            return {
                data: {
                    id: id,
                    name: 'Sarah Chen',
                    email: 'sarah@example.com',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                    bio: 'Lead Developer at TechCorp.',
                    title: 'Senior Developer',
                    accountType: 'professional',
                    followers: 50,
                    following: 20,
                    connections: 100,
                    profileViews: 500,
                    postCount: 5,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };
        }
    },

    // Update profile
    updateProfile: async (data: UpdateProfileRequest & { avatarFile?: File; coverFile?: File }) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'avatarFile' || key === 'coverFile') {
                    if (value) formData.append(key, value as File);
                } else if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });

            return await apiClient.put<UserProfile>('/api/users/me', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error) {
            return { data: { ...data, id: 'demo-user-id' } as any };
        }
    },

    // Follow/unfollow user
    followUser: (id: string) =>
        apiClient.post(`/api/users/${id}/follow`),

    unfollowUser: (id: string) =>
        apiClient.delete(`/api/users/${id}/follow`),

    // Get followers
    getFollowers: async (id: string, params?: { page?: number; limit?: number }) => {
        try {
            return await apiClient.get<{ users: UserProfile[]; total: number }>(`/api/users/${id}/followers`, { params });
        } catch (error) {
            return {
                data: {
                    users: [
                        {
                            id: 'u2',
                            name: 'Sarah Chen',
                            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                            title: 'Developer',
                            accountType: 'professional',
                            followers: 0,
                            following: 0,
                            connections: 0,
                            profileViews: 0,
                            postCount: 0,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            email: 'sarah@example.com'
                        }
                    ],
                    total: 1
                }
            }
        }
    },

    // Get following
    getFollowing: async (id: string, params?: { page?: number; limit?: number }) => {
        try {
            return await apiClient.get<{ users: UserProfile[]; total: number }>(`/api/users/${id}/following`, { params });
        } catch (error) {
            return {
                data: {
                    users: [],
                    total: 0
                }
            }
        }
    },

    // Connection requests
    sendConnectionRequest: (id: string, message?: string) =>
        apiClient.post(`/api/users/${id}/connect`, { message }),

    acceptConnectionRequest: (id: string) =>
        apiClient.post(`/api/users/connections/${id}/accept`),

    declineConnectionRequest: (id: string) =>
        apiClient.post(`/api/users/connections/${id}/decline`),

    removeConnection: (id: string) =>
        apiClient.delete(`/api/users/connections/${id}`),

    // Get connections
    getConnections: (params?: { page?: number; limit?: number; status?: string }) =>
        apiClient.get<{ connections: Connection[]; total: number }>('/api/users/connections', { params }),

    // Get suggested connections
    getSuggestedConnections: (limit?: number) =>
        apiClient.get<UserProfile[]>('/api/users/suggested', { params: { limit } }),

    // Search users
    searchUsers: (query: string, params?: { page?: number; limit?: number; accountType?: string }) =>
        apiClient.get<{ users: UserProfile[]; total: number }>('/api/users/search', {
            params: { q: query, ...params },
        }),

    // Get user activity
    getActivity: (id: string, params?: { page?: number; limit?: number }) =>
        apiClient.get('/api/users/${id}/activity', { params }),

    // Update settings
    updateSettings: (settings: any) =>
        apiClient.put('/api/users/settings', settings),

    // Get settings
    getSettings: () =>
        apiClient.get('/api/users/settings'),

    // Delete account
    deleteAccount: () =>
        apiClient.delete('/api/users/me'),

    // Export data
    exportData: () =>
        apiClient.get('/api/users/export', { responseType: 'blob' }),
};
