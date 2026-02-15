import { apiClient } from '@/lib/api-client';

export interface AnalyticsEvent {
    event: string;
    properties?: Record<string, any>;
    timestamp?: string;
}

export interface PageView {
    page: string;
    referrer?: string;
    duration?: number;
}

export const analyticsService = {
    // Track event
    trackEvent: (event: string, properties?: Record<string, any>) =>
        apiClient.post('/api/analytics/events', {
            event,
            properties,
            timestamp: new Date().toISOString(),
        }),

    // Track login
    trackLogin: (success: boolean, type: string = 'email') =>
        apiClient.post('/api/analytics/events', {
            event: 'login',
            properties: { success, type },
            timestamp: new Date().toISOString()
        }),

    // Track page view
    trackPageView: (page: string, referrer?: string) =>
        apiClient.post('/api/analytics/pageviews', {
            page,
            referrer,
            timestamp: new Date().toISOString(),
        }),

    // Track click
    trackClick: (element: string, properties?: Record<string, any>) =>
        apiClient.post('/api/analytics/clicks', {
            element,
            properties,
            timestamp: new Date().toISOString(),
        }),

    // Batch track events
    trackBatch: (events: AnalyticsEvent[]) =>
        apiClient.post('/api/analytics/batch', { events }),

    // Get user analytics
    getUserAnalytics: (timeRange?: '7d' | '30d' | '90d' | '1y') =>
        apiClient.get('/api/analytics/user', { params: { timeRange } }),

    // Get content analytics
    getContentAnalytics: (contentId: string, contentType: 'post' | 'startup' | 'profile') =>
        apiClient.get(`/api/analytics/content/${contentType}/${contentId}`),

    // Additional helper methods
    track: (event: string, properties?: Record<string, any>) =>
        apiClient.post('/api/analytics/events', {
            event,
            properties,
            timestamp: new Date().toISOString()
        }),

    trackButtonClick: (buttonName: string, properties?: Record<string, any>) =>
        apiClient.post('/api/analytics/clicks', {
            element: buttonName,
            properties,
            timestamp: new Date().toISOString()
        }),

    trackFormInteraction: (formName: string, action: string, properties?: Record<string, any>) =>
        apiClient.post('/api/analytics/events', {
            event: `form_${action}`,
            properties: { form: formName, ...properties },
            timestamp: new Date().toISOString()
        }),

    setUser: (userId: string, properties?: Record<string, any>) =>
        apiClient.post('/api/analytics/user/identify', { userId, properties }),

    trackSignUp: (accountType: string, success: boolean) =>
        apiClient.post('/api/analytics/events', {
            event: 'signup',
            properties: { accountType, success },
            timestamp: new Date().toISOString()
        }),

    trackError: (errorType: string, errorMessage: string, context?: string) =>
        apiClient.post('/api/analytics/events', {
            event: 'error',
            properties: { errorType, errorMessage, context },
            timestamp: new Date().toISOString()
        }),
};
