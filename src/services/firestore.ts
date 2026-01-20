// Firestore service - Replaced with backend API (no Firebase)
import { apiClient } from '@/lib/api-client';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  accountType: 'startup' | 'professional';
  createdAt: string;
  avatar?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  company?: string;
  position?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

// Get user profile from backend
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const response = await apiClient.get(`/api/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

// Create user profile
export async function createUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const response = await apiClient.post(`/api/users/${userId}/profile`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to create user profile:', error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  try {
    await apiClient.patch(`/api/users/${userId}/profile`, data);
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
}

// Delete user profile
export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    await apiClient.delete(`/api/users/${userId}/profile`);
  } catch (error) {
    console.error('Failed to delete user profile:', error);
    throw error;
  }
}
