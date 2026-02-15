import { apiClient } from '@/lib/api-client';

export interface IdeaValidation {
    analysis: {
        overallScore: number;
        marketPotential: number;
        feasibility: number;
        uniqueness: number;
        competitionLevel: number;
    };
    insights: string[];
    recommendations: string[];
    risks: string[];
    opportunities: string[];
    nextSteps: string[];
}

export interface MVPFeature {
    id: string;
    name: string;
    description: string;
    priority: 'must-have' | 'should-have' | 'nice-to-have';
    effort: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    status?: 'todo' | 'in-progress' | 'done';
    estimatedHours?: number;
}

export interface MVPPlan {
    id: string;
    name: string;
    description: string;
    features: MVPFeature[];
    timeline: {
        totalWeeks: number;
        phases: Array<{
            name: string;
            duration: string;
            deliverables: string[];
        }>;
    };
    techStack: string[];
    resources: {
        budget?: number;
        team?: string[];
    };
}

export interface PitchSlide {
    id: string;
    type: 'cover' | 'problem' | 'solution' | 'market' | 'product' | 'business-model' | 'traction' | 'team' | 'financials' | 'ask';
    title: string;
    content: string;
    notes?: string;
    order: number;
}

export interface PitchDeck {
    id: string;
    title: string;
    slides: PitchSlide[];
    createdAt: Date;
    updatedAt: Date;
}

class AIBuilderService {
    // Idea Validation
    async validateIdea(idea: string, industry?: string): Promise<IdeaValidation> {
        try {
            const response = await apiClient.post('/api/ai/validate-idea', {
                idea,
                industry,
            });
            return response.data;
        } catch (error) {
            console.error('Error validating idea:', error);
            throw error;
        }
    }

    // MVP Planning
    async generateMVPPlan(params: {
        productIdea: string;
        targetUsers: string;
        keyFeatures: string[];
        timeline: number;
        budget?: number;
    }): Promise<MVPPlan> {
        try {
            const response = await apiClient.post('/api/ai/mvp-plan', params);
            return response.data;
        } catch (error) {
            console.error('Error generating MVP plan:', error);
            throw error;
        }
    }

    async updateMVPFeature(planId: string, featureId: string, status: string): Promise<MVPPlan> {
        try {
            const response = await apiClient.patch(`/api/ai/mvp-plans/${planId}/features/${featureId}`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating MVP feature:', error);
            throw error;
        }
    }

    async saveMVPPlan(plan: MVPPlan): Promise<string> {
        try {
            const response = await apiClient.post('/api/ai/mvp-plans', plan);
            return response.data.id;
        } catch (error) {
            console.error('Error saving MVP plan:', error);
            throw error;
        }
    }

    async getMVPPlans(): Promise<MVPPlan[]> {
        try {
            const response = await apiClient.get('/api/ai/mvp-plans');
            return response.data;
        } catch (error) {
            console.error('Error getting MVP plans:', error);
            throw error;
        }
    }

    // Pitch Deck Generation
    async generatePitchDeck(companyInfo: {
        name: string;
        description?: string;
        problem: string;
        solution: string;
        market?: string;
        businessModel?: string;
    }): Promise<PitchDeck> {
        try {
            const response = await apiClient.post('/api/ai/pitch-deck', companyInfo);
            return response.data;
        } catch (error) {
            console.error('Error generating pitch deck:', error);
            throw error;
        }
    }

    async savePitchDeck(deck: PitchDeck): Promise<string> {
        try {
            const response = await apiClient.post('/api/ai/pitch-decks', deck);
            return response.data.id;
        } catch (error) {
            console.error('Error saving pitch deck:', error);
            throw error;
        }
    }

    async getPitchDecks(): Promise<PitchDeck[]> {
        try {
            const response = await apiClient.get('/api/ai/pitch-decks');
            return response.data;
        } catch (error) {
            console.error('Error getting pitch decks:', error);
            throw error;
        }
    }

    async updatePitchDeck(deckId: string, updates: Partial<PitchDeck>): Promise<void> {
        try {
            await apiClient.put(`/api/ai/pitch-decks/${deckId}`, updates);
        } catch (error) {
            console.error('Error updating pitch deck:', error);
            throw error;
        }
    }

    async deletePitchDeck(deckId: string): Promise<void> {
        try {
            await apiClient.delete(`/api/ai/pitch-decks/${deckId}`);
        } catch (error) {
            console.error('Error deleting pitch deck:', error);
            throw error;
        }
    }

    async updatePitchSlide(deckId: string, slideId: string, updates: Partial<PitchSlide>): Promise<PitchDeck> {
        try {
            const response = await apiClient.patch(`/api/ai/pitch-decks/${deckId}/slides/${slideId}`, updates);
            return response.data;
        } catch (error) {
            console.error('Error updating pitch slide:', error);
            throw error;
        }
    }
}

const aiBuilderService = new AIBuilderService();
export default aiBuilderService;
