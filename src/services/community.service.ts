import { apiClient } from '@/lib/api-client';

export interface Community {
    id: string;
    name: string;
    description: string;
    coverImage?: string;
    avatar?: string;
    category: string;
    privacy: 'public' | 'private' | 'invite-only';
    memberCount: number;
    postCount: number;
    activityLevel: 'high' | 'medium' | 'low';
    tags: string[];
    isMember: boolean;
    isOwner: boolean;
    isTrending: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommunityMember {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    role: 'owner' | 'admin' | 'moderator' | 'member';
    joinedAt: string;
}

export interface CommunityPost {
    id: string;
    communityId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    title: string;
    content: string;
    type: 'discussion' | 'poll' | 'event' | 'resource';
    likes: number;
    comments: number;
    isPinned: boolean;
    createdAt: string;
}

export interface CommunityEvent {
    id: string;
    communityId: string;
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    location?: string;
    isVirtual: boolean;
    meetingLink?: string;
    attendeeCount: number;
    isAttending: boolean;
    createdAt: string;
}

export interface CommunityResource {
    id: string;
    communityId: string;
    title: string;
    description: string;
    type: 'link' | 'file' | 'document';
    url?: string;
    fileUrl?: string;
    uploadedBy: string;
    createdAt: string;
}

export interface CreateCommunityRequest {
    name: string;
    description: string;
    category: string;
    privacy: 'public' | 'private' | 'invite-only';
    tags?: string[];
    coverImage?: File;
    avatar?: File;
}

export const communityService = {
    // Get all communities
    getCommunities: async (params?: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
        filter?: 'discover' | 'my-communities' | 'trending';
    }) => {
        try {
            return await apiClient.get<{ communities: Community[]; total: number }>('/api/communities', { params });
        } catch (error) {
            console.warn("Community API failed, using mock data.", error);
            const mockCommunities: Community[] = [
                {
                    id: '1',
                    name: 'SaaS Founders',
                    description: 'A place for SaaS founders to share learnings.',
                    category: 'tech',
                    privacy: 'public',
                    memberCount: 1540,
                    postCount: 342,
                    activityLevel: 'high',
                    tags: ['saas', 'startup', 'tech'],
                    isMember: true,
                    isOwner: false,
                    isTrending: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
                },
                {
                    id: '2',
                    name: 'AI Innovators',
                    description: 'Discussing the latest in AI and ML.',
                    category: 'tech',
                    privacy: 'public',
                    memberCount: 890,
                    postCount: 120,
                    activityLevel: 'medium',
                    tags: ['ai', 'ml', 'future'],
                    isMember: false,
                    isOwner: false,
                    isTrending: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
                }
            ];
            return { data: { communities: mockCommunities, total: 2 } };
        }
    },

    // Get community by ID
    getCommunity: async (id: string) => {
        try {
            return await apiClient.get<Community>(`/api/communities/${id}`);
        } catch (error) {
            return {
                data: {
                    id: id,
                    name: 'SaaS Founders',
                    description: 'A place for SaaS founders to share learnings.',
                    category: 'tech',
                    privacy: 'public',
                    memberCount: 1540,
                    postCount: 342,
                    activityLevel: 'high',
                    tags: ['saas', 'startup', 'tech'],
                    isMember: true,
                    isOwner: false,
                    isTrending: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
                }
            };
        }
    },

    // Create community
    createCommunity: async (data: CreateCommunityRequest) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('category', data.category);
            formData.append('privacy', data.privacy);

            if (data.tags) {
                formData.append('tags', JSON.stringify(data.tags));
            }

            if (data.coverImage) {
                formData.append('coverImage', data.coverImage);
            }

            if (data.avatar) {
                formData.append('avatar', data.avatar);
            }

            return await apiClient.post<Community>('/api/communities', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error) {
            return {
                data: {
                    id: 'new-comm-' + Date.now(),
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    privacy: data.privacy,
                    memberCount: 1,
                    postCount: 0,
                    activityLevel: 'low',
                    tags: data.tags || [],
                    isMember: true,
                    isOwner: true,
                    isTrending: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            };
        }
    },

    // Update community
    updateCommunity: (id: string, data: Partial<CreateCommunityRequest>) =>
        apiClient.put<Community>(`/api/communities/${id}`, data),

    // Delete community
    deleteCommunity: (id: string) =>
        apiClient.delete(`/api/communities/${id}`),

    // Join community
    joinCommunity: (id: string) =>
        apiClient.post(`/api/communities/${id}/join`),

    // Leave community
    leaveCommunity: (id: string) =>
        apiClient.post(`/api/communities/${id}/leave`),

    // Get members
    getMembers: (id: string, params?: { page?: number; limit?: number; role?: string }) =>
        apiClient.get<{ members: CommunityMember[]; total: number }>(`/api/communities/${id}/members`, { params }),

    // Update member role
    updateMemberRole: (communityId: string, userId: string, role: 'admin' | 'moderator' | 'member') =>
        apiClient.put(`/api/communities/${communityId}/members/${userId}`, { role }),

    // Remove member
    removeMember: (communityId: string, userId: string) =>
        apiClient.delete(`/api/communities/${communityId}/members/${userId}`),

    // Get community posts
    getPosts: async (id: string, params?: { page?: number; limit?: number; type?: string }) => {
        try {
            return await apiClient.get<{ posts: CommunityPost[]; total: number }>(`/api/communities/${id}/posts`, { params });
        } catch (error) {
            return {
                data: {
                    posts: [
                        {
                            id: 'p1',
                            communityId: id,
                            userId: 'u2',
                            userName: 'Sarah Chen',
                            userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                            title: 'How do you handle churn?',
                            content: 'I have been experimenting with new retention strategies...',
                            type: 'discussion',
                            likes: 24,
                            comments: 12,
                            isPinned: false,
                            createdAt: new Date().toISOString()
                        }
                    ],
                    total: 1
                }
            }
        }
    },

    // Create community post
    createPost: async (communityId: string, data: { title: string; content: string; type: string }) => {
        try {
            return await apiClient.post<CommunityPost>(`/api/communities/${communityId}/posts`, data);
        } catch (error) {
            return {
                data: {
                    id: 'new-post-' + Date.now(),
                    communityId,
                    userId: 'demo-user-id',
                    userName: 'Demo User',
                    title: data.title,
                    content: data.content,
                    type: data.type as any,
                    likes: 0,
                    comments: 0,
                    isPinned: false,
                    createdAt: new Date().toISOString()
                }
            };
        }
    },

    // Get events
    getEvents: (id: string, params?: { page?: number; limit?: number; upcoming?: boolean }) =>
        apiClient.get<{ events: CommunityEvent[]; total: number }>(`/api/communities/${id}/events`, { params }),

    // Create event
    createEvent: (communityId: string, data: Omit<CommunityEvent, 'id' | 'communityId' | 'attendeeCount' | 'isAttending' | 'createdAt'>) =>
        apiClient.post<CommunityEvent>(`/api/communities/${communityId}/events`, data),

    // RSVP to event
    rsvpEvent: (communityId: string, eventId: string) =>
        apiClient.post(`/api/communities/${communityId}/events/${eventId}/rsvp`),

    // Get resources
    getResources: (id: string, params?: { page?: number; limit?: number; type?: string }) =>
        apiClient.get<{ resources: CommunityResource[]; total: number }>(`/api/communities/${id}/resources`, { params }),

    // Add resource
    addResource: async (communityId: string, data: { title: string; description: string; type: string; url?: string; file?: File }) => {
        if (data.file) {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('type', data.type);
            formData.append('file', data.file);

            return apiClient.post<CommunityResource>(`/api/communities/${communityId}/resources`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }

        return apiClient.post<CommunityResource>(`/api/communities/${communityId}/resources`, data);
    },

    // Search communities
    searchCommunities: (query: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ communities: Community[]; total: number }>('/api/communities/search', {
            params: { q: query, ...params },
        }),

    // Get trending communities
    getTrending: async () => {
        try {
            return await apiClient.get<Community[]>('/api/communities/trending');
        } catch (error) {
            return {
                data: [
                    {
                        id: '1',
                        name: 'SaaS Founders',
                        description: 'Top trending SaaS community.',
                        category: 'tech',
                        privacy: 'public',
                        memberCount: 1540,
                        postCount: 342,
                        activityLevel: 'high',
                        tags: ['trending'],
                        isMember: false,
                        isOwner: false,
                        isTrending: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
                    }
                ]
            };
        }
    },

    // Get user's communities
    getMyCommunities: async (params?: { page?: number; limit?: number }) => {
        try {
            return await apiClient.get<{ communities: Community[]; total: number }>('/api/communities/my', { params });
        } catch (error) {
            return {
                data: {
                    communities: [],
                    total: 0
                }
            }
        }
    }
};
