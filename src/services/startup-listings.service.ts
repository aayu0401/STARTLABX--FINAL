import { apiClient } from '@/lib/api-client';

export interface StartupListingData {
    name: string;
    tagline: string;
    industry: string;
    location: string;
    stage: string;
    lookingFor: string[];
    workArrangement: string;
    timeCommitment: string;
    equityRange: {
        min: number;
        max: number;
    };
    description?: string;
    problemSolving?: string;
    targetMarket?: string;
    competitiveAdvantage?: string;
    traction?: string;
    fundingStatus?: string;
    fundingAmount?: number;
    teamSize?: number;
    website?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
}

export const createStartupListing = async (
    userId: string,
    data: StartupListingData
): Promise<string> => {
    try {
        const response = await apiClient.post('/api/startups', data);
        return response.data.id || response.data._id;
    } catch (error) {
        console.error('Error creating startup listing:', error);
        throw error;
    }
};

export const updateStartupListing = async (
    listingId: string,
    data: Partial<StartupListingData>
): Promise<void> => {
    try {
        await apiClient.put(`/api/startups/${listingId}`, data);
    } catch (error) {
        console.error('Error updating startup listing:', error);
        throw error;
    }
};

export const deleteStartupListing = async (listingId: string): Promise<void> => {
    try {
        await apiClient.delete(`/api/startups/${listingId}`);
    } catch (error) {
        console.error('Error deleting startup listing:', error);
        throw error;
    }
};
