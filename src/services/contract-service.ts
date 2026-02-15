import { apiClient } from '@/lib/api-client';

export interface Contract {
    id: string;
    title: string;
    type: string;
    content: string;
    parties: Array<{
        id: string;
        name: string;
        role: string;
        email?: string;
        signed?: boolean;
    }>;
    status: 'draft' | 'pending' | 'signed' | 'expired';
    createdAt: Date;
    updatedAt: Date;
    signedAt?: Date;
    expiresAt?: Date;
}

export interface AIContractRequest {
    type: string;
    role: string;
    compensation: {
        type: 'equity' | 'salary' | 'hourly' | 'hybrid';
        amount: number;
        equity: number;
        currency: string;
    };
    duration?: string;
    responsibilities: string[];
    additionalTerms?: string[];
}

class ContractService {
    async generateContract(request: AIContractRequest): Promise<Contract> {
        try {
            const response = await apiClient.post('/api/contracts/generate', request);
            return response.data;
        } catch (error) {
            console.error('Error generating contract:', error);
            throw error;
        }
    }

    async getContracts(): Promise<Contract[]> {
        try {
            const response = await apiClient.get('/api/contracts');
            return response.data;
        } catch (error) {
            console.error('Error getting contracts:', error);
            throw error;
        }
    }

    async getContract(id: string): Promise<Contract> {
        try {
            const response = await apiClient.get(`/api/contracts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting contract:', error);
            throw error;
        }
    }

    async saveContract(contract: Partial<Contract>): Promise<string> {
        try {
            const response = await apiClient.post('/api/contracts', contract);
            return response.data.id;
        } catch (error) {
            console.error('Error saving contract:', error);
            throw error;
        }
    }

    async updateContract(id: string, updates: Partial<Contract>): Promise<void> {
        try {
            await apiClient.put(`/api/contracts/${id}`, updates);
        } catch (error) {
            console.error('Error updating contract:', error);
            throw error;
        }
    }

    async deleteContract(id: string): Promise<void> {
        try {
            await apiClient.delete(`/api/contracts/${id}`);
        } catch (error) {
            console.error('Error deleting contract:', error);
            throw error;
        }
    }

    async signContract(id: string, signature: string): Promise<void> {
        try {
            await apiClient.post(`/api/contracts/${id}/sign`, { signature });
        } catch (error) {
            console.error('Error signing contract:', error);
            throw error;
        }
    }

    async sendForSignature(contractId: string, partyIds: string[]): Promise<void> {
        try {
            await apiClient.post(`/api/contracts/${contractId}/send`, { partyIds });
        } catch (error) {
            console.error('Error sending contract for signature:', error);
            throw error;
        }
    }
}

const contractService = new ContractService();
export default contractService;
