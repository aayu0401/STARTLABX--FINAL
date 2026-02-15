import { apiClient } from '@/lib/api-client';

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

export interface AIConversation {
    id: string;
    title: string;
    messages: AIMessage[];
    createdAt: string;
    updatedAt: string;
}

export interface IdeaValidation {
    score: number;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    marketSize: {
        tam: string;
        sam: string;
        som: string;
    };
    competitors: string[];
    recommendations: string[];
}

export interface PitchDeck {
    id: string;
    title: string;
    slides: {
        type: 'problem' | 'solution' | 'market' | 'product' | 'team' | 'traction' | 'business-model' | 'competition' | 'financials' | 'ask';
        title: string;
        content: string;
        notes?: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface MVPPlan {
    features: {
        name: string;
        description: string;
        priority: 'must-have' | 'should-have' | 'could-have' | 'wont-have';
        effort: 'low' | 'medium' | 'high';
    }[];
    timeline: {
        phase: string;
        duration: string;
        milestones: string[];
    }[];
    techStack: {
        category: string;
        technologies: string[];
        rationale: string;
    }[];
    resources: {
        role: string;
        count: number;
        skills: string[];
    }[];
    budget: {
        category: string;
        amount: number;
        notes: string;
    }[];
}

export const aiService = {
    // AI Copilot
    chat: (message: string, conversationId?: string) =>
        apiClient.post<{ response: string; conversationId: string }>('/api/ai/chat', {
            message,
            conversationId,
        }),

    getConversations: () =>
        apiClient.get<AIConversation[]>('/api/ai/conversations'),

    getConversation: (id: string) =>
        apiClient.get<AIConversation>(`/api/ai/conversations/${id}`),

    deleteConversation: (id: string) =>
        apiClient.delete(`/api/ai/conversations/${id}`),

    // Idea Validator
    validateIdea: (idea: string, industry?: string) =>
        apiClient.post<IdeaValidation>('/api/ai/validate-idea', { idea, industry }),

    // Pitch Deck Generator
    generatePitchDeck: (data: {
        companyName: string;
        problem: string;
        solution: string;
        industry: string;
    }) =>
        apiClient.post<PitchDeck>('/api/ai/generate-pitch-deck', data),

    getPitchDecks: () =>
        apiClient.get<PitchDeck[]>('/api/ai/pitch-decks'),

    getPitchDeck: (id: string) =>
        apiClient.get<PitchDeck>(`/api/ai/pitch-decks/${id}`),

    updatePitchDeck: (id: string, data: Partial<PitchDeck>) =>
        apiClient.put<PitchDeck>(`/api/ai/pitch-decks/${id}`, data),

    deletePitchDeck: (id: string) =>
        apiClient.delete(`/api/ai/pitch-decks/${id}`),

    exportPitchDeck: (id: string, format: 'pdf' | 'pptx') =>
        apiClient.get(`/api/ai/pitch-decks/${id}/export`, {
            params: { format },
            responseType: 'blob',
        }),

    // MVP Planner
    generateMVPPlan: (data: {
        productDescription: string;
        targetAudience: string;
        timeline: string;
        budget: string;
    }) =>
        apiClient.post<MVPPlan>('/api/ai/generate-mvp-plan', data),

    // Contract Generator
    generateContract: (data: {
        type: 'equity' | 'nda' | 'employment' | 'freelance' | 'partnership' | 'advisory';
        parties: { name: string; role: string }[];
        terms: Record<string, any>;
    }) =>
        apiClient.post<{ contract: string; id: string }>('/api/ai/generate-contract', data),

    // AI Matching
    getMatches: (type: 'startup' | 'talent', limit?: number) =>
        apiClient.get('/api/ai/matches', { params: { type, limit } }),

    // AI Recommendations
    getRecommendations: (context: 'feed' | 'connections' | 'communities' | 'jobs') =>
        apiClient.get('/api/ai/recommendations', { params: { context } }),

    // Document Analysis
    analyzeDocument: async (file: File, type: 'resume' | 'pitch-deck' | 'contract') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        return apiClient.post('/api/ai/analyze-document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};
