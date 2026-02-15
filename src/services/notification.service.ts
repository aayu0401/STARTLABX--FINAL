import { apiClient } from '@/lib/api-client';

export interface Notification {
    id: string;
    type: 'mention' | 'like' | 'comment' | 'share' | 'follow' | 'message' | 'connection' | 'invite' | 'system';
    title: string;
    message: string;
    icon?: string;
    avatar?: string;
    link?: string;
    isRead: boolean;
    actionable: boolean;
    actions?: {
        label: string;
        action: 'accept' | 'decline' | 'view' | 'dismiss';
        url?: string;
    }[];
    createdAt: string;
}

export interface NotificationPreferences {
    email: {
        mentions: boolean;
        likes: boolean;
        comments: boolean;
        follows: boolean;
        messages: boolean;
        connections: boolean;
        invites: boolean;
        digest: boolean;
    };
    push: {
        mentions: boolean;
        likes: boolean;
        comments: boolean;
        follows: boolean;
        messages: boolean;
        connections: boolean;
        invites: boolean;
    };
    inApp: {
        mentions: boolean;
        likes: boolean;
        comments: boolean;
        follows: boolean;
        messages: boolean;
        connections: boolean;
        invites: boolean;
    };
}

export const notificationService = {
    // Get notifications
    getNotifications: (params?: {
        page?: number;
        limit?: number;
        type?: string;
        unreadOnly?: boolean;
    }) =>
        apiClient.get<{ notifications: Notification[]; total: number; unreadCount: number }>('/api/notifications', { params }),

    // Get unread count
    getUnreadCount: () =>
        apiClient.get<{ count: number }>('/api/notifications/unread-count'),

    // Mark as read
    markAsRead: (id: string) =>
        apiClient.put(`/api/notifications/${id}/read`),

    // Mark all as read
    markAllAsRead: () =>
        apiClient.put('/api/notifications/read-all'),

    // Delete notification
    deleteNotification: (id: string) =>
        apiClient.delete(`/api/notifications/${id}`),

    // Delete all notifications
    deleteAll: () =>
        apiClient.delete('/api/notifications'),

    // Get preferences
    getPreferences: () =>
        apiClient.get<NotificationPreferences>('/api/notifications/preferences'),

    // Update preferences
    updatePreferences: (preferences: Partial<NotificationPreferences>) =>
        apiClient.put<NotificationPreferences>('/api/notifications/preferences', preferences),

    // Subscribe to push notifications
    subscribePush: (subscription: PushSubscription) =>
        apiClient.post('/api/notifications/push/subscribe', subscription),

    // Unsubscribe from push notifications
    unsubscribePush: () =>
        apiClient.post('/api/notifications/push/unsubscribe'),

    // Perform notification action
    performAction: (id: string, action: 'accept' | 'decline' | 'view' | 'dismiss') =>
        apiClient.post(`/api/notifications/${id}/action`, { action }),
};
