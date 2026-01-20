import apiClient from '../lib/api-client';

export interface Contract {
    id: string;
    type: 'equity_agreement' | 'nda' | 'advisor_agreement' | 'employment' | 'freelance' | 'co_founder' | 'custom';
    title: string;
    parties: ContractParty[];
    content: string;
    terms: ContractTerm[];
    status: 'draft' | 'pending_signatures' | 'signed' | 'expired' | 'terminated';
    createdBy: string;
    createdAt: Date;
    expiresAt?: Date;
    signedAt?: Date;
}

export interface ContractParty {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: 'employer' | 'employee' | 'founder' | 'advisor' | 'freelancer' | 'investor';
    signed: boolean;
    signedAt?: Date;
    signatureUrl?: string;
}

export interface ContractTerm {
    key: string;
    label: string;
    value: string;
    type: 'text' | 'number' | 'date' | 'percentage' | 'currency';
}

export interface ContractTemplate {
    id: string;
    type: string;
    name: string;
    description: string;
    category: 'hiring' | 'equity' | 'legal' | 'partnership';
    requiredFields: string[];
    content: string;
}

export interface AIContractRequest {
    type: string;
    role: string;
    compensation: {
        type: 'equity' | 'salary' | 'hourly' | 'hybrid';
        amount?: number;
        equity?: number;
        currency?: string;
    };
    duration?: string;
    responsibilities: string[];
    additionalTerms?: string[];
}

class ContractService {
    private baseUrl = '/api/contracts';

    /**
     * Generate contract with AI
     */
    async generateContract(request: AIContractRequest): Promise<Contract> {
        const response = await apiClient.post(`${this.baseUrl}/generate`, request);
        return response.data;
    }

    /**
     * Get contract templates
     */
    async getTemplates(category?: string): Promise<ContractTemplate[]> {
        const response = await apiClient.get(`${this.baseUrl}/templates`, {
            params: { category }
        });
        return response.data;
    }

    /**
     * Create contract from template
     */
    async createFromTemplate(templateId: string, data: Record<string, any>): Promise<Contract> {
        const response = await apiClient.post(`${this.baseUrl}/from-template/${templateId}`, data);
        return response.data;
    }

    /**
     * Get user's contracts
     */
    async getContracts(status?: string): Promise<Contract[]> {
        const response = await apiClient.get(`${this.baseUrl}`, {
            params: { status }
        });
        return response.data;
    }

    /**
     * Get contract details
     */
    async getContract(contractId: string): Promise<Contract> {
        const response = await apiClient.get(`${this.baseUrl}/${contractId}`);
        return response.data;
    }

    /**
     * Update contract
     */
    async updateContract(contractId: string, updates: Partial<Contract>): Promise<Contract> {
        const response = await apiClient.put(`${this.baseUrl}/${contractId}`, updates);
        return response.data;
    }

    /**
     * Send contract for signature
     */
    async sendForSignature(contractId: string, partyIds: string[]): Promise<Contract> {
        const response = await apiClient.post(`${this.baseUrl}/${contractId}/send`, {
            partyIds
        });
        return response.data;
    }

    /**
     * Sign contract
     */
    async signContract(contractId: string, signature: string): Promise<Contract> {
        const response = await apiClient.post(`${this.baseUrl}/${contractId}/sign`, {
            signature
        });
        return response.data;
    }

    /**
     * Get AI suggestions for contract improvements
     */
    async getContractSuggestions(contractId: string): Promise<{
        suggestions: string[];
        risks: string[];
        improvements: string[];
    }> {
        const response = await apiClient.get(`${this.baseUrl}/${contractId}/ai-review`);
        return response.data;
    }

    /**
     * Terminate contract
     */
    async terminateContract(contractId: string, reason: string): Promise<Contract> {
        const response = await apiClient.post(`${this.baseUrl}/${contractId}/terminate`, {
            reason
        });
        return response.data;
    }
}

export const contractService = new ContractService();
export default contractService;
