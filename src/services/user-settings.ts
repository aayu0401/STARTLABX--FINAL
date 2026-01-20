// User settings service - Backend API integration (no Firebase)
import { apiClient } from '@/lib/api-client';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  updates: boolean;
  mentions: boolean;
  comments: boolean;
  likes: boolean;
}

export interface PrivacySettings {
  profileVisibility: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowMessages: boolean;
  allowConnections: boolean;
}

export interface UserSettings {
  userId: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  updatedAt: string;
}

// Default settings
const defaultNotificationSettings: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
  marketing: false,
  updates: true,
  mentions: true,
  comments: true,
  likes: false,
};

const defaultPrivacySettings: PrivacySettings = {
  profileVisibility: true,
  showEmail: false,
  showPhone: false,
  showLocation: true,
  allowMessages: true,
  allowConnections: true,
};

// Get user settings from backend
export async function getUserSettings(userId: string): Promise<UserSettings> {
  try {
    const response = await apiClient.get(`/api/users/${userId}/settings`);
    return response.data;
  } catch (error) {
    console.log('Using default settings:', error);
    // Return default settings if backend not available
    return {
      userId,
      notifications: defaultNotificationSettings,
      privacy: defaultPrivacySettings,
      updatedAt: new Date().toISOString(),
    };
  }
}

// Update notification settings
export async function updateNotificationSettings(
  userId: string,
  settings: Partial<NotificationSettings>
): Promise<void> {
  try {
    await apiClient.patch(`/api/users/${userId}/settings/notifications`, settings);
  } catch (error) {
    console.error('Failed to update notification settings:', error);
    throw error;
  }
}

// Update privacy settings
export async function updatePrivacySettings(
  userId: string,
  settings: Partial<PrivacySettings>
): Promise<void> {
  try {
    await apiClient.patch(`/api/users/${userId}/settings/privacy`, settings);
  } catch (error) {
    console.error('Failed to update privacy settings:', error);
    throw error;
  }
}

// Update all settings
export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> {
  try {
    await apiClient.put(`/api/users/${userId}/settings`, settings);
  } catch (error) {
    console.error('Failed to update user settings:', error);
    throw error;
  }
}