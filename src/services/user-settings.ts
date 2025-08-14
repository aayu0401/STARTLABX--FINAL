import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { z } from 'zod';

// Settings schemas
const NotificationSettingsSchema = z.object({
  email: z.boolean().default(true),
  push: z.boolean().default(true),
  matches: z.boolean().default(true),
  messages: z.boolean().default(true),
  updates: z.boolean().default(false),
  marketing: z.boolean().default(false),
});

const PrivacySettingsSchema = z.object({
  profileVisibility: z.boolean().default(true),
  showEmail: z.boolean().default(false),
  showActivity: z.boolean().default(true),
  allowDirectMessages: z.boolean().default(true),
  showOnlineStatus: z.boolean().default(true),
});

const AppearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).default('MM/DD/YYYY'),
});

const SecuritySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  sessionTimeout: z.number().default(30), // minutes
  loginNotifications: z.boolean().default(true),
  deviceTracking: z.boolean().default(true),
});

const UserSettingsSchema = z.object({
  uid: z.string(),
  notifications: NotificationSettingsSchema,
  privacy: PrivacySettingsSchema,
  appearance: AppearanceSettingsSchema,
  security: SecuritySettingsSchema,
  lastUpdated: z.date(),
  createdAt: z.date(),
});

export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;
export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;
export type AppearanceSettings = z.infer<typeof AppearanceSettingsSchema>;
export type SecuritySettings = z.infer<typeof SecuritySettingsSchema>;
export type UserSettings = z.infer<typeof UserSettingsSchema>;

// Default settings for new users
const getDefaultSettings = (uid: string): UserSettings => ({
  uid,
  notifications: NotificationSettingsSchema.parse({}),
  privacy: PrivacySettingsSchema.parse({}),
  appearance: AppearanceSettingsSchema.parse({}),
  security: SecuritySettingsSchema.parse({}),
  lastUpdated: new Date(),
  createdAt: new Date(),
});

export async function getUserSettings(uid: string): Promise<UserSettings> {
  try {
    const settingsRef = doc(db, 'user_settings', uid);
    const settingsDoc = await getDoc(settingsRef);
    
    if (!settingsDoc.exists()) {
      // Create default settings for new user
      const defaultSettings = getDefaultSettings(uid);
      await setDoc(settingsRef, {
        ...defaultSettings,
        lastUpdated: new Date(),
        createdAt: new Date(),
      });
      return defaultSettings;
    }
    
    const data = settingsDoc.data();
    return UserSettingsSchema.parse({
      ...data,
      lastUpdated: data.lastUpdated?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return getDefaultSettings(uid);
  }
}

export async function updateUserSettings(
  uid: string, 
  updates: Partial<Omit<UserSettings, 'uid' | 'createdAt' | 'lastUpdated'>>
): Promise<void> {
  try {
    const settingsRef = doc(db, 'user_settings', uid);
    
    await updateDoc(settingsRef, {
      ...updates,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
}

export async function updateNotificationSettings(
  uid: string, 
  notifications: Partial<NotificationSettings>
): Promise<void> {
  try {
    const currentSettings = await getUserSettings(uid);
    await updateUserSettings(uid, {
      notifications: { ...currentSettings.notifications, ...notifications }
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
}

export async function updatePrivacySettings(
  uid: string, 
  privacy: Partial<PrivacySettings>
): Promise<void> {
  try {
    const currentSettings = await getUserSettings(uid);
    await updateUserSettings(uid, {
      privacy: { ...currentSettings.privacy, ...privacy }
    });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    throw error;
  }
}

export async function updateAppearanceSettings(
  uid: string, 
  appearance: Partial<AppearanceSettings>
): Promise<void> {
  try {
    const currentSettings = await getUserSettings(uid);
    await updateUserSettings(uid, {
      appearance: { ...currentSettings.appearance, ...appearance }
    });
  } catch (error) {
    console.error('Error updating appearance settings:', error);
    throw error;
  }
}

export async function updateSecuritySettings(
  uid: string, 
  security: Partial<SecuritySettings>
): Promise<void> {
  try {
    const currentSettings = await getUserSettings(uid);
    await updateUserSettings(uid, {
      security: { ...currentSettings.security, ...security }
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    throw error;
  }
}