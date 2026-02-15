import { apiClient } from '@/lib/api-client';

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    matches: boolean;
    messages: boolean;
    updates: boolean;
}

export interface PrivacySettings {
    profileVisibility: boolean;
    showEmail: boolean;
    showActivity: boolean;
}

export interface UserSettings {
    notifications: NotificationSettings;
    privacy: PrivacySettings;
}

export const userSettingsService = {
    getSettings: () =>
        apiClient.get<UserSettings>('/api/user/settings').then(res => res.data),

    updateNotifications: (updates: Partial<NotificationSettings>) =>
        apiClient.patch<NotificationSettings>('/api/user/settings/notifications', updates).then(res => res.data),

    updatePrivacy: (updates: Partial<PrivacySettings>) =>
        apiClient.patch<PrivacySettings>('/api/user/settings/privacy', updates).then(res => res.data),
};

export default userSettingsService;
