
import { apiClient } from '@/lib/api-client';

export interface User {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
}

export interface MediaItem {
    type: 'IMAGE' | 'VIDEO' | 'FILE';
    url: string;
}

export interface Post {
    id: string;
    user: User;
    content: string;
    title?: string;
    type: 'UPDATE' | 'OPPORTUNITY' | 'INSIGHT' | 'QUESTION' | 'ACHIEVEMENT' | 'LAUNCH' | 'text' | 'image' | 'video' | 'poll' | 'article';
    media?: MediaItem[];
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    viewsCount: number;
    isLiked: boolean;
    isSaved: boolean;
    hashtags: string[];
    mentions?: string[];
    createdAt: string;
    updatedAt?: string;
    projectUrl?: string; // New field for launch link
}

export interface CreatePostRequest {
    content: string;
    title?: string;
    type: Post['type'];
    media?: File[];
    hashtags?: string[];
    mentions?: string[];
    visibility?: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    projectUrl?: string;
}

export interface Comment {
    id: string;
    postId: string;
    user: User;
    content: string;
    likes: number;
    createdAt: string;
}

// MOCK LAUNCH DATA GENERATOR
const generateMockLaunches = (): Post[] => [
    {
        id: 'launch-1',
        user: { id: 'u1', name: 'Elena R.', title: 'AI Researcher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
        type: 'LAUNCH',
        title: '🚀 Introducing MediScan AI',
        content: 'After 3 weeks of incubation in StartLabX, we are live! MediScan uses Computer Vision to detect early skin anomalies. Built with PyTorch and React Native.',
        hashtags: ['HealthTech', 'AI', 'Launch'],
        likesCount: 342,
        commentsCount: 56,
        sharesCount: 12,
        viewsCount: 1205,
        isLiked: false,
        isSaved: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        projectUrl: 'https://mediscan.ai'
    },
    {
        id: 'launch-2',
        user: { id: 'u2', name: 'Marcus Chen', title: 'Serial Founder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
        type: 'LAUNCH',
        title: '🚀 FinFlow - Automate your taxes',
        content: 'Tired of spreadsheets? FinFlow connects to your bank and categorizes expenses using LLMs. Looking for beta testers!',
        hashtags: ['FinTech', 'SaaS', 'Beta'],
        likesCount: 89,
        commentsCount: 23,
        sharesCount: 5,
        viewsCount: 450,
        isLiked: true,
        isSaved: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        projectUrl: 'https://finflow.io'
    }
];

export const postService = {
    // Get feed posts
    getFeed: (params?: { page?: number; limit?: number; filter?: 'all' | 'following' | 'trending' | 'launches' }) => {
        if (params?.filter === 'launches') {
            // Return mock launches for now
            return Promise.resolve({ data: { posts: generateMockLaunches(), total: 2 } });
        }
        return apiClient.get<{ posts: Post[]; total: number }>('/api/posts/feed', { params });
    },

    // Get trending posts
    getTrending: () =>
        apiClient.get<Post[]>('/api/posts/trending'),

    // Create a new post
    create: (data: CreatePostRequest) => {
        const formData = new FormData();
        formData.append('content', data.content);
        if (data.title) formData.append('title', data.title);
        formData.append('type', data.type);
        if (data.media) {
            data.media.forEach((file) => formData.append('media', file));
        }
        if (data.hashtags) formData.append('hashtags', JSON.stringify(data.hashtags));
        if (data.mentions) formData.append('mentions', JSON.stringify(data.mentions));
        if (data.visibility) formData.append('visibility', data.visibility);
        if (data.projectUrl) formData.append('projectUrl', data.projectUrl);

        return apiClient.post<Post>('/api/posts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // Like a post
    like: (postId: string) =>
        apiClient.post(`/api/posts/${postId}/like`),

    // Comment on a post
    comment: (postId: string, content: string) =>
        apiClient.post<Comment>(`/api/posts/${postId}/comments`, { content }),

    // Share a post
    share: (postId: string) =>
        apiClient.post(`/api/posts/${postId}/share`),

    // Save a post
    save: (postId: string) =>
        apiClient.post(`/api/posts/${postId}/save`),
};
