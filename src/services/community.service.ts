import { apiClient } from '@/lib/api-client';

export interface Community {
    id: string;
    name: string;
    description: string;
    avatarUrl?: string;
    coverImageUrl?: string;
    type: 'STARTUP' | 'INDUSTRY' | 'SKILL' | 'INTEREST' | 'LOCATION';
    visibility: 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
    joinPolicy: 'OPEN' | 'REQUEST' | 'INVITE_ONLY';
    tags: string[];
    rules: string[];
    ownerId: string;
    membersCount: number;
    postsCount: number;
    eventsCount: number;
    createdAt: string;
    isMember?: boolean;
    memberRole?: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
}

export interface CommunityEvent {
    id: string;
    communityId: string;
    title: string;
    description: string;
    type: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
    location?: string;
    meetingLink?: string;
    startTime: string;
    endTime: string;
    maxAttendees?: number;
    attendeesCount: number;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    isAttending?: boolean;
}

export interface Discussion {
    id: string;
    communityId: string;
    authorId: string;
    title: string;
    content: string;
    status: 'OPEN' | 'CLOSED' | 'PINNED' | 'LOCKED';
    tags: string[];
    repliesCount: number;
    viewsCount: number;
    likesCount: number;
    lastReplyAt?: string;
    createdAt: string;
}

export interface Poll {
    id: string;
    communityId: string;
    question: string;
    options: Array<{
        id: string;
        text: string;
        votesCount: number;
    }>;
    type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
    allowAnonymous: boolean;
    showResults: boolean;
    expiresAt?: string;
    totalVotes: number;
    hasVoted?: boolean;
    createdAt: string;
}

export const communityService = {
    // Communities
    getAll: (params?: { page?: number; limit?: number; type?: string; search?: string }) =>
        apiClient.get<{ communities: Community[]; total: number }>('/api/communities', { params }),

    getById: (id: string) =>
        apiClient.get<Community>(`/api/communities/${id}`),

    create: (data: Partial<Community>) =>
        apiClient.post<Community>('/api/communities', data),

    update: (id: string, data: Partial<Community>) =>
        apiClient.put<Community>(`/api/communities/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/api/communities/${id}`),

    search: (query: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ communities: Community[] }>('/api/communities/search', { params: { q: query, ...params } }),

    getTrending: (params?: { limit?: number }) =>
        apiClient.get<{ communities: Community[] }>('/api/communities/trending', { params }),

    getRecommended: (params?: { limit?: number }) =>
        apiClient.get<{ communities: Community[] }>('/api/communities/recommended', { params }),

    getMyCommunities: () =>
        apiClient.get<{ communities: Community[] }>('/api/communities/my-communities'),

    // Membership
    join: (id: string) =>
        apiClient.post(`/api/communities/${id}/join`),

    leave: (id: string) =>
        apiClient.post(`/api/communities/${id}/leave`),

    getMembers: (id: string, params?: { page?: number; limit?: number }) =>
        apiClient.get(`/api/communities/${id}/members`, { params }),

    inviteMembers: (id: string, userIds: string[]) =>
        apiClient.post(`/api/communities/${id}/invite`, { userIds }),

    removeMember: (id: string, userId: string) =>
        apiClient.post(`/api/communities/${id}/members/${userId}/remove`),

    updateMemberRole: (id: string, userId: string, role: string) =>
        apiClient.put(`/api/communities/${id}/members/${userId}/role`, { role }),

    // Content
    getPosts: (id: string, params?: { page?: number; limit?: number }) =>
        apiClient.get(`/api/communities/${id}/posts`, { params }),

    createPost: (id: string, data: any) =>
        apiClient.post(`/api/communities/${id}/posts`, data),

    // Events
    getEvents: (id: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ events: CommunityEvent[] }>(`/api/communities/${id}/events`, { params }),

    createEvent: (id: string, data: Partial<CommunityEvent>) =>
        apiClient.post<CommunityEvent>(`/api/communities/${id}/events`, data),

    attendEvent: (communityId: string, eventId: string) =>
        apiClient.post(`/api/communities/${communityId}/events/${eventId}/attend`),

    // Resources
    getResources: (id: string, params?: { page?: number; limit?: number }) =>
        apiClient.get(`/api/communities/${id}/resources`, { params }),

    addResource: (id: string, data: any) =>
        apiClient.post(`/api/communities/${id}/resources`, data),

    // Discussions
    getDiscussions: (id: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ discussions: Discussion[] }>(`/api/communities/${id}/discussions`, { params }),

    createDiscussion: (id: string, data: Partial<Discussion>) =>
        apiClient.post<Discussion>(`/api/communities/${id}/discussions`, data),

    // Polls
    getPolls: (id: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ polls: Poll[] }>(`/api/communities/${id}/polls`, { params }),

    createPoll: (id: string, data: Partial<Poll>) =>
        apiClient.post<Poll>(`/api/communities/${id}/polls`, data),

    votePoll: (communityId: string, pollId: string, optionIds: string[]) =>
        apiClient.post(`/api/communities/${communityId}/polls/${pollId}/vote`, { optionIds }),

    getPollResults: (communityId: string, pollId: string) =>
        apiClient.get(`/api/communities/${communityId}/polls/${pollId}/results`),

    // Moderation
    reportContent: (id: string, data: { contentType: string; contentId: string; reason: string }) =>
        apiClient.post(`/api/communities/${id}/reports`, data),

    getReports: (id: string) =>
        apiClient.get(`/api/communities/${id}/reports`),

    moderateContent: (id: string, data: any) =>
        apiClient.post(`/api/communities/${id}/moderate`, data),

    // Analytics
    getAnalytics: (id: string) =>
        apiClient.get(`/api/communities/${id}/analytics`),

    getInsights: (id: string) =>
        apiClient.get(`/api/communities/${id}/insights`),
};
