import { apiClient } from '@/lib/api-client';

export interface Resource {
    id: string;
    title: string;
    description: string;
    category: 'tool' | 'service' | 'template' | 'guide' | 'course' | 'other' | 'talent'; // Added talent
    type: 'free' | 'freemium' | 'paid' | 'hourly' | 'equity' | 'hybrid'; // Added talent types
    price?: number;
    currency?: string;
    url?: string; // Made optional
    imageUrl?: string;
    provider?: string; // Made optional
    rating: number; // Component expects this
    reviewCount: number; // Component expects this
    tags: string[];
    featured?: boolean;
    createdAt: Date;
    // Talent fields
    name?: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
    verified?: boolean;
    location?: string;
    hourlyRate?: number;
    availability?: string;
    equityInterest?: boolean;
}

export interface ResourceFilter {
    category?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    search?: string;
    featured?: boolean;
    // Talent filters
    availability?: string[];
    equityOnly?: boolean;
    remote?: boolean;
    verified?: boolean;
}

class ResourceMarketplaceService {
    async getResources(filter?: ResourceFilter): Promise<Resource[]> {
        try {
            const response = await apiClient.get('/api/marketplace/resources', {
                params: filter,
            });
            return response.data;
        } catch (error) {
            console.error('Error getting resources:', error);
            throw error;
        }
    }

    async getResource(id: string): Promise<Resource> {
        try {
            const response = await apiClient.get(`/api/marketplace/resources/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting resource:', error);
            throw error;
        }
    }

    async getFeaturedResources(): Promise<Resource[]> {
        try {
            const response = await apiClient.get('/api/marketplace/resources/featured');
            return response.data;
        } catch (error) {
            console.error('Error getting featured resources:', error);
            throw error;
        }
    }

    async searchResources(query: string): Promise<Resource[]> {
        try {
            const response = await apiClient.get('/api/marketplace/resources/search', {
                params: { q: query },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching resources:', error);
            throw error;
        }
    }

    async getResourcesByCategory(category: string): Promise<Resource[]> {
        try {
            const response = await apiClient.get(`/api/marketplace/resources/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('Error getting resources by category:', error);
            throw error;
        }
    }

    async saveResource(resourceId: string): Promise<void> {
        try {
            await apiClient.post(`/api/marketplace/resources/${resourceId}/save`);
        } catch (error) {
            console.error('Error saving resource:', error);
            throw error;
        }
    }

    async unsaveResource(resourceId: string): Promise<void> {
        try {
            await apiClient.delete(`/api/marketplace/resources/${resourceId}/save`);
        } catch (error) {
            console.error('Error unsaving resource:', error);
            throw error;
        }
    }

    async sendHiringRequest(data: {
        startupId: string;
        resourceId: string;
        type: string;
        role: string;
        description: string;
        compensation: {
            hourlyRate?: number;
            equityPercentage?: number;
            salary?: number;
            currency: string;
        };
        duration: string;
        proposalMessage: string;
    }): Promise<void> {
        try {
            await apiClient.post('/api/marketplace/hire', data);
        } catch (error) {
            console.error('Error sending hiring request:', error);
            throw error;
        }
    }

    async getSavedResources(): Promise<Resource[]> {
        try {
            const response = await apiClient.get('/api/marketplace/resources/saved');
            return response.data;
        } catch (error) {
            console.error('Error getting saved resources:', error);
            throw error;
        }
    }
}

const resourceMarketplaceService = new ResourceMarketplaceService();
export default resourceMarketplaceService;
