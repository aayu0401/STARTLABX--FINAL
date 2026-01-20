import { apiClient } from '@/lib/api-client';

export interface UserDashboard {
    userId: string;
    profileViews: {
        total: number;
        thisWeek: number;
        thisMonth: number;
        trend: number;
    };
    connections: {
        total: number;
        pending: number;
        accepted: number;
        thisWeek: number;
    };
    engagement: {
        postsCreated: number;
        commentsReceived: number;
        likesReceived: number;
        sharesReceived: number;
    };
    opportunities: {
        applied: number;
        shortlisted: number;
        interviews: number;
        offers: number;
    };
    updatedAt: string;
}

export interface StartupDashboard {
    startupId: string;
    overview: {
        totalApplications: number;
        activeProjects: number;
        teamSize: number;
        fundingProgress: number;
    };
    applications: {
        total: number;
        pending: number;
        reviewed: number;
        accepted: number;
        rejected: number;
    };
    team: {
        fullTime: number;
        partTime: number;
        freelance: number;
        equity: number;
    };
    engagement: {
        profileViews: number;
        saves: number;
        shares: number;
        inquiries: number;
    };
    growth: {
        weekOverWeek: number;
        monthOverMonth: number;
        quarterOverQuarter: number;
    };
    updatedAt: string;
}

export interface ActivityEvent {
    id: string;
    userId: string;
    entityType: 'startup' | 'professional' | 'project' | 'post' | 'community';
    entityId: string;
    eventType: 'view' | 'like' | 'comment' | 'share' | 'apply' | 'save';
    metadata: any;
    timestamp: string;
}

export interface Insight {
    id: string;
    userId: string;
    type: 'recommendation' | 'alert' | 'achievement' | 'trend';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    actionable: boolean;
    actionUrl?: string;
    createdAt: string;
    readAt?: string;
}

export const dashboardService = {
    // User Dashboard
    getUserDashboard: (userId: string) =>
        apiClient.get<UserDashboard>(`/api/dashboard/user/${userId}`),

    getUserStats: (userId: string) =>
        apiClient.get(`/api/dashboard/user/${userId}/stats`),

    getUserActivity: (userId: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ activities: ActivityEvent[] }>(`/api/dashboard/user/${userId}/activity`, { params }),

    getUserInsights: (userId: string) =>
        apiClient.get<{ insights: Insight[] }>(`/api/dashboard/user/${userId}/insights`),

    // Startup Dashboard
    getStartupDashboard: (startupId: string) =>
        apiClient.get<StartupDashboard>(`/api/dashboard/startup/${startupId}`),

    getStartupMetrics: (startupId: string) =>
        apiClient.get(`/api/dashboard/startup/${startupId}/metrics`),

    getStartupTeam: (startupId: string) =>
        apiClient.get(`/api/dashboard/startup/${startupId}/team`),

    getStartupApplications: (startupId: string) =>
        apiClient.get(`/api/dashboard/startup/${startupId}/applications`),

    getStartupGrowth: (startupId: string, params?: { period?: string }) =>
        apiClient.get(`/api/dashboard/startup/${startupId}/growth`, { params }),

    // Professional Dashboard
    getProfessionalDashboard: (userId: string) =>
        apiClient.get(`/api/dashboard/professional/${userId}`),

    getPortfolioAnalytics: (userId: string) =>
        apiClient.get(`/api/dashboard/professional/${userId}/portfolio`),

    getSkillsAnalytics: (userId: string) =>
        apiClient.get(`/api/dashboard/professional/${userId}/skills`),

    getOpportunities: (userId: string) =>
        apiClient.get(`/api/dashboard/professional/${userId}/opportunities`),

    // Analytics
    getOverview: () =>
        apiClient.get('/api/dashboard/analytics/overview'),

    getTrends: (params?: { period?: string }) =>
        apiClient.get('/api/dashboard/analytics/trends', { params }),

    getComparisons: (params?: { type?: string }) =>
        apiClient.get('/api/dashboard/analytics/comparisons', { params }),

    generateCustomReport: (data: any) =>
        apiClient.post('/api/dashboard/analytics/custom', data),

    // Event Tracking
    trackEvent: (data: {
        entityType: string;
        entityId: string;
        eventType: string;
        metadata?: any;
    }) =>
        apiClient.post('/api/dashboard/events/track', data),

    trackPageView: (data: { page: string; metadata?: any }) =>
        apiClient.post('/api/dashboard/events/page-view', data),

    trackInteraction: (data: {
        interactionType: string;
        targetId: string;
        metadata?: any;
    }) =>
        apiClient.post('/api/dashboard/events/interaction', data),
};
