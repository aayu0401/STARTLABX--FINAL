import apiClient from '../lib/api-client';

export interface Resource {
    id: string;
    userId: string;
    type: 'professional' | 'freelancer' | 'advisor';
    name: string;
    title: string;
    avatar?: string;
    skills: string[];
    experience: number;
    hourlyRate?: number;
    equityInterest: boolean;
    availability: 'immediate' | 'within_week' | 'within_month' | 'not_available';
    location: string;
    remote: boolean;
    bio: string;
    portfolio?: string[];
    rating: number;
    reviewCount: number;
    verified: boolean;
}

export interface HiringRequest {
    id: string;
    startupId: string;
    resourceId: string;
    type: 'hourly' | 'equity' | 'salary' | 'hybrid';
    role: string;
    description: string;
    compensation: {
        hourlyRate?: number;
        equityPercentage?: number;
        salary?: number;
        currency?: string;
    };
    duration?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'negotiating' | 'active' | 'completed';
    proposalMessage: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ResourceFilter {
    skills?: string[];
    type?: string[];
    availability?: string[];
    minRate?: number;
    maxRate?: number;
    equityOnly?: boolean;
    remote?: boolean;
    location?: string;
    verified?: boolean;
}

class ResourceMarketplaceService {
    private baseUrl = '/api/resources';

    /**
     * Search for resources/talent
     */
    async searchResources(filters?: ResourceFilter, page = 1, limit = 20): Promise<{
        resources: Resource[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const response = await apiClient.get(`${this.baseUrl}/search`, {
            params: { ...filters, page, limit }
        });
        return response.data;
    }

    /**
     * Get resource details
     */
    async getResource(resourceId: string): Promise<Resource> {
        const response = await apiClient.get(`${this.baseUrl}/${resourceId}`);
        return response.data;
    }

    /**
     * Get AI-matched resources for a startup
     */
    async getMatchedResources(startupId: string, role?: string): Promise<Resource[]> {
        const response = await apiClient.get(`${this.baseUrl}/matches/${startupId}`, {
            params: { role }
        });
        return response.data;
    }

    /**
     * Send hiring request
     */
    async sendHiringRequest(request: Omit<HiringRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<HiringRequest> {
        const response = await apiClient.post(`${this.baseUrl}/hire`, request);
        return response.data;
    }

    /**
     * Get hiring requests (sent or received)
     */
    async getHiringRequests(type: 'sent' | 'received', status?: string): Promise<HiringRequest[]> {
        const response = await apiClient.get(`${this.baseUrl}/hiring-requests`, {
            params: { type, status }
        });
        return response.data;
    }

    /**
     * Update hiring request status
     */
    async updateHiringRequest(requestId: string, status: string, message?: string): Promise<HiringRequest> {
        const response = await apiClient.put(`${this.baseUrl}/hiring-requests/${requestId}`, {
            status,
            message
        });
        return response.data;
    }

    /**
     * Get instant availability resources
     */
    async getInstantResources(skills: string[]): Promise<Resource[]> {
        const response = await apiClient.post(`${this.baseUrl}/instant`, { skills });
        return response.data;
    }
}

export const resourceMarketplaceService = new ResourceMarketplaceService();
export default resourceMarketplaceService;
