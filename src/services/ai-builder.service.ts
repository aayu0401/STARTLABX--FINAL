import apiClient from '../lib/api-client';

export interface PitchDeck {
    id: string;
    startupId: string;
    title: string;
    slides: PitchSlide[];
    status: 'draft' | 'completed' | 'published';
    createdAt: Date;
    updatedAt: Date;
}

export interface PitchSlide {
    id: string;
    type: 'cover' | 'problem' | 'solution' | 'market' | 'product' | 'business_model' | 'traction' | 'team' | 'financials' | 'ask' | 'custom';
    title: string;
    content: string;
    notes?: string;
    order: number;
}

export interface MVPPlan {
    id: string;
    startupId: string;
    name: string;
    description: string;
    features: MVPFeature[];
    timeline: {
        totalWeeks: number;
        phases: MVPPhase[];
    };
    resources: {
        developers: number;
        designers: number;
        budget?: number;
    };
    techStack: string[];
    status: 'planning' | 'in_progress' | 'completed';
    createdAt: Date;
}

export interface MVPFeature {
    id: string;
    name: string;
    description: string;
    priority: 'must_have' | 'should_have' | 'nice_to_have';
    estimatedHours: number;
    status: 'pending' | 'in_progress' | 'completed';
}

export interface MVPPhase {
    name: string;
    duration: number;
    features: string[];
    deliverables: string[];
}

export interface IdeaValidation {
    id: string;
    idea: string;
    analysis: {
        marketPotential: number;
        competitionLevel: number;
        feasibility: number;
        uniqueness: number;
        overallScore: number;
    };
    insights: string[];
    recommendations: string[];
    competitors: string[];
    targetMarket: string[];
    risks: string[];
    opportunities: string[];
    nextSteps: string[];
    createdAt: Date;
}

class AIBuilderService {
    private baseUrl = '/api/ai-builder';

    /**
     * Validate startup idea with AI
     */
    async validateIdea(idea: string, industry?: string): Promise<IdeaValidation> {
        const response = await apiClient.post(`${this.baseUrl}/validate-idea`, {
            idea,
            industry
        });
        return response.data;
    }

    /**
     * Brainstorm with AI
     */
    async brainstorm(topic: string, context?: any): Promise<{
        ideas: string[];
        insights: string[];
        questions: string[];
    }> {
        const response = await apiClient.post(`${this.baseUrl}/brainstorm`, {
            topic,
            context
        });
        return response.data;
    }

    /**
     * Generate pitch deck with AI
     */
    async generatePitchDeck(startupInfo: {
        name: string;
        problem: string;
        solution: string;
        market?: string;
        businessModel?: string;
    }): Promise<PitchDeck> {
        const response = await apiClient.post(`${this.baseUrl}/generate-pitch`, startupInfo);
        return response.data;
    }

    /**
     * Get pitch deck
     */
    async getPitchDeck(pitchId: string): Promise<PitchDeck> {
        const response = await apiClient.get(`${this.baseUrl}/pitch/${pitchId}`);
        return response.data;
    }

    /**
     * Update pitch deck slide
     */
    async updatePitchSlide(pitchId: string, slideId: string, content: Partial<PitchSlide>): Promise<PitchDeck> {
        const response = await apiClient.put(`${this.baseUrl}/pitch/${pitchId}/slides/${slideId}`, content);
        return response.data;
    }

    /**
     * Generate MVP plan with AI
     */
    async generateMVPPlan(requirements: {
        productIdea: string;
        targetUsers: string;
        keyFeatures: string[];
        timeline?: number;
        budget?: number;
    }): Promise<MVPPlan> {
        const response = await apiClient.post(`${this.baseUrl}/generate-mvp`, requirements);
        return response.data;
    }

    /**
     * Get MVP plan
     */
    async getMVPPlan(mvpId: string): Promise<MVPPlan> {
        const response = await apiClient.get(`${this.baseUrl}/mvp/${mvpId}`);
        return response.data;
    }

    /**
     * Update MVP feature status
     */
    async updateMVPFeature(mvpId: string, featureId: string, status: string): Promise<MVPPlan> {
        const response = await apiClient.put(`${this.baseUrl}/mvp/${mvpId}/features/${featureId}`, {
            status
        });
        return response.data;
    }

    /**
     * Get AI recommendations for next steps
     */
    async getNextSteps(startupId: string): Promise<{
        recommendations: string[];
        priorities: string[];
        resources: string[];
    }> {
        const response = await apiClient.get(`${this.baseUrl}/next-steps/${startupId}`);
        return response.data;
    }
}

export const aiBuilderService = new AIBuilderService();
export default aiBuilderService;
