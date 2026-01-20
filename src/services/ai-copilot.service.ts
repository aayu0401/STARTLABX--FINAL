import apiClient from '../lib/api-client';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
        tokens?: number;
        model?: string;
    };
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    context: {
        userType: 'startup' | 'professional';
        userProfile?: any;
        currentPage?: string;
        relevantData?: any;
    };
    status: 'active' | 'archived';
    tags: string[];
    lastMessageAt: Date;
    messageCount?: number;
    lastMessage?: string;
}

export interface Suggestion {
    id: string;
    type: 'action' | 'insight' | 'recommendation' | 'warning';
    category: 'profile' | 'startup' | 'networking' | 'project' | 'general';
    title: string;
    description: string;
    actionUrl?: string;
    actionLabel?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'viewed' | 'dismissed' | 'completed';
}

export interface ChatRequest {
    conversationId?: string;
    message: string;
    context?: {
        userType: 'startup' | 'professional';
        userProfile?: any;
        currentPage?: string;
        relevantData?: any;
    };
}

export interface ChatResponse {
    conversationId: string;
    message: string;
    tokens: number;
}

export interface DocumentAnalysisRequest {
    documentText: string;
    analysisType: 'contract' | 'pitch_deck' | 'business_plan' | 'general';
}

export interface DocumentAnalysisResponse {
    analysis: string;
    analysisType: string;
}

class AICopilotService {
    private baseUrl = '/api/copilot';

    /**
     * Send a message to the AI Copilot
     */
    async chat(request: ChatRequest): Promise<ChatResponse> {
        const response = await apiClient.post<ChatResponse>(`${this.baseUrl}/chat`, request);
        return response.data;
    }

    /**
     * Get conversation history
     */
    async getConversations(params?: {
        status?: 'active' | 'archived';
        limit?: number;
        skip?: number;
    }): Promise<{ conversations: Conversation[]; total: number }> {
        const response = await apiClient.get(`${this.baseUrl}/conversations`, { params });
        return response.data;
    }

    /**
     * Get a specific conversation
     */
    async getConversation(conversationId: string): Promise<Conversation> {
        const response = await apiClient.get<Conversation>(
            `${this.baseUrl}/conversations/${conversationId}`
        );
        return response.data;
    }

    /**
     * Archive a conversation
     */
    async archiveConversation(conversationId: string): Promise<void> {
        await apiClient.put(`${this.baseUrl}/conversations/${conversationId}/archive`);
    }

    /**
     * Analyze a document
     */
    async analyzeDocument(request: DocumentAnalysisRequest): Promise<DocumentAnalysisResponse> {
        const response = await apiClient.post<DocumentAnalysisResponse>(
            `${this.baseUrl}/analyze-document`,
            request
        );
        return response.data;
    }

    /**
     * Get AI-generated suggestions
     */
    async getSuggestions(params?: {
        status?: 'pending' | 'viewed' | 'dismissed' | 'completed';
        limit?: number;
    }): Promise<{ suggestions: Suggestion[] }> {
        const response = await apiClient.get(`${this.baseUrl}/suggestions`, { params });
        return response.data;
    }

    /**
     * Update suggestion status
     */
    async updateSuggestion(
        suggestionId: string,
        status: 'viewed' | 'dismissed' | 'completed'
    ): Promise<void> {
        await apiClient.put(`${this.baseUrl}/suggestions/${suggestionId}`, { status });
    }

    /**
     * Submit feedback on AI response
     */
    async submitFeedback(feedback: {
        conversationId: string;
        messageIndex: number;
        feedback?: string;
        rating?: number;
    }): Promise<void> {
        await apiClient.post(`${this.baseUrl}/feedback`, feedback);
    }
}

export const aiCopilotService = new AICopilotService();
export default aiCopilotService;
