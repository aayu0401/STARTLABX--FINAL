import { apiClient } from '@/lib/api-client';

export interface Notification {
    id: string;
    userId: string;
    type: 'message' | 'connection' | 'opportunity' | 'post' | 'community' | 'system';
    title: string;
    body: string;
    data?: any;
    read: boolean;
    actionUrl?: string;
    createdAt: string;
}

export const notificationService = {
    getAll: (params?: { page?: number; limit?: number; type?: string; unreadOnly?: boolean }) =>
        apiClient.get<{ notifications: Notification[]; total: number; unreadCount: number }>('/api/notifications', { params }),

    getUnreadCount: () =>
        apiClient.get<{ count: number }>('/api/notifications/unread-count'),

    markAsRead: (id: string) =>
        apiClient.put(`/api/notifications/${id}/read`),

    markAllAsRead: () =>
        apiClient.put('/api/notifications/mark-all-read'),

    delete: (id: string) =>
        apiClient.delete(`/api/notifications/${id}`),

    deleteAll: () =>
        apiClient.delete('/api/notifications/delete-all'),

    // Push notification subscription
    subscribe: (subscription: any) =>
        apiClient.post('/api/notifications/subscribe', subscription),

    unsubscribe: () =>
        apiClient.post('/api/notifications/unsubscribe'),

    // Notification preferences
    getPreferences: () =>
        apiClient.get('/api/notifications/preferences'),

    updatePreferences: (preferences: any) =>
        apiClient.put('/api/notifications/preferences', preferences),
};

export const storageService = {
    upload: (file: File, folder?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (folder) {
            formData.append('folder', folder);
        }
        return apiClient.post<{ url: string; thumbnailUrl?: string; fileName: string; fileSize: number }>(
            '/api/storage/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    },

    delete: (fileUrl: string) =>
        apiClient.delete('/api/storage/delete', { data: { fileUrl } }),

    getSignedUrl: (fileUrl: string) =>
        apiClient.get<{ signedUrl: string }>('/api/storage/signed-url', { params: { fileUrl } }),
};
