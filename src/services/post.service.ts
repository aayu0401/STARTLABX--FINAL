import { apiClient } from '@/lib/api-client';

export interface Post {
    id: string;
    userId: string;
    type: 'UPDATE' | 'OPPORTUNITY' | 'INSIGHT' | 'QUESTION' | 'ACHIEVEMENT';
    title?: string;
    content: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    visibility: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    hashtags: string[];
    mentions: string[];
    media: PostMedia[];
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    viewsCount: number;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        avatar?: string;
        title?: string;
    };
    isLiked?: boolean;
    isSaved?: boolean;
}

export interface PostMedia {
    id: string;
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LINK';
    url: string;
    thumbnailUrl?: string;
    fileName?: string;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    likesCount: number;
    repliesCount: number;
    createdAt: string;
    user?: {
        id: string;
        name: string;
        avatar?: string;
    };
}

export interface CreatePostRequest {
    type: Post['type'];
    title?: string;
    content: string;
    visibility?: Post['visibility'];
    hashtags?: string[];
    mentions?: string[];
    scheduledAt?: string;
}

export const postService = {
    // Feed
    getFeed: (params?: { page?: number; limit?: number; filter?: string }) =>
        apiClient.get<{ posts: Post[]; total: number }>('/api/posts/feed', { params }),

    getTrending: (params?: { limit?: number }) =>
        apiClient.get<{ posts: Post[] }>('/api/posts/feed/trending', { params }),

    getFollowing: (params?: { page?: number; limit?: number }) =>
        apiClient.get<{ posts: Post[] }>('/api/posts/feed/following', { params }),

    // Posts
    getById: (id: string) =>
        apiClient.get<Post>(`/api/posts/${id}`),

    create: (data: CreatePostRequest) =>
        apiClient.post<Post>('/api/posts', data),

    update: (id: string, data: Partial<CreatePostRequest>) =>
        apiClient.put<Post>(`/api/posts/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/api/posts/${id}`),

    publish: (id: string) =>
        apiClient.post(`/api/posts/${id}/publish`),

    // Engagement
    like: (postId: string) =>
        apiClient.post(`/api/posts/${postId}/like`),

    unlike: (postId: string) =>
        apiClient.delete(`/api/posts/${postId}/like`),

    share: (postId: string) =>
        apiClient.post(`/api/posts/${postId}/share`),

    save: (postId: string) =>
        apiClient.post(`/api/posts/${postId}/save`),

    unsave: (postId: string) =>
        apiClient.delete(`/api/posts/${postId}/save`),

    // Comments
    getComments: (postId: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ comments: Comment[]; total: number }>(`/api/posts/${postId}/comments`, { params }),

    addComment: (postId: string, content: string) =>
        apiClient.post<Comment>(`/api/posts/${postId}/comment`, { content }),

    updateComment: (postId: string, commentId: string, content: string) =>
        apiClient.put(`/api/posts/${postId}/comments/${commentId}`, { content }),

    deleteComment: (postId: string, commentId: string) =>
        apiClient.delete(`/api/posts/${postId}/comments/${commentId}`),

    // User posts
    getUserPosts: (userId: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ posts: Post[] }>(`/api/posts/user/${userId}`, { params }),

    getDrafts: () =>
        apiClient.get<{ posts: Post[] }>('/api/posts/drafts'),

    getSaved: () =>
        apiClient.get<{ posts: Post[] }>('/api/posts/saved'),

    // Search
    search: (query: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ posts: Post[] }>('/api/posts/search', { params: { q: query, ...params } }),

    // Hashtags
    getTrendingHashtags: () =>
        apiClient.get<{ hashtags: Array<{ tag: string; count: number }> }>('/api/posts/hashtags/trending'),

    getPostsByHashtag: (tag: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ posts: Post[] }>(`/api/posts/hashtags/${tag}/posts`, { params }),

    // Analytics
    getAnalytics: (postId: string) =>
        apiClient.get(`/api/posts/${postId}/analytics`),

    // Media upload
    uploadMedia: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<{ url: string; thumbnailUrl?: string }>('/api/posts/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
