// Startup listings service - Backend API integration (no Firebase)
import { apiClient } from '@/lib/api-client';

export interface StartupListing {
  id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  location: string;
  website?: string;
  logo?: string;
  foundedDate?: string;
  teamSize?: number;
  fundingRaised?: number;
  lookingFor: string[];
  equity: {
    min: number;
    max: number;
  };
  skills: string[];
  ownerId: string;
  status: 'active' | 'paused' | 'closed';
  createdAt: string;
  updatedAt: string;
}

// Get all startup listings
export async function getStartupListings(filters?: {
  industry?: string;
  stage?: string;
  location?: string;
  skills?: string[];
}): Promise<StartupListing[]> {
  try {
    const response = await apiClient.get('/api/startups', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Failed to get startup listings:', error);
    return [];
  }
}

// Get single startup listing
export async function getStartupListing(id: string): Promise<StartupListing | null> {
  try {
    const response = await apiClient.get(`/api/startups/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get startup listing:', error);
    return null;
  }
}

// Create startup listing
export async function createStartupListing(data: Omit<StartupListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<StartupListing> {
  try {
    const response = await apiClient.post('/api/startups', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create startup listing:', error);
    throw error;
  }
}

// Update startup listing
export async function updateStartupListing(id: string, data: Partial<StartupListing>): Promise<void> {
  try {
    await apiClient.patch(`/api/startups/${id}`, data);
  } catch (error) {
    console.error('Failed to update startup listing:', error);
    throw error;
  }
}

// Delete startup listing
export async function deleteStartupListing(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/startups/${id}`);
  } catch (error) {
    console.error('Failed to delete startup listing:', error);
    throw error;
  }
}

// Get user's startup listings
export async function getUserStartupListings(userId: string): Promise<StartupListing[]> {
  try {
    const response = await apiClient.get(`/api/users/${userId}/startups`);
    return response.data;
  } catch (error) {
    console.error('Failed to get user startup listings:', error);
    return [];
  }
}