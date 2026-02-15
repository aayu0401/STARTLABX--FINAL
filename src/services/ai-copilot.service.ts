import { apiClient } from '@/lib/api-client';

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Suggestion {
    id: string;
    type: 'action' | 'insight' | 'recommendation' | 'warning' | 'resource' | 'connection';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category?: string;
    actionUrl?: string;
    actionLabel?: string;
    status?: 'pending' | 'completed' | 'dismissed';
    metadata?: Record<string, any>;
}

export interface DocumentAnalysis {
    id?: string;
    summary: string;
    keyPoints: string[];
    suggestions: Suggestion[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    analysis?: string;
}

class AICopilotService {
    // Chat functionality
    async chat(params: {
        message: string;
        conversationId?: string;
        context?: Record<string, any>;
    }): Promise<{ message: string; conversationId: string; tokens?: number }> {
        try {
            const response = await apiClient.post('/api/ai/copilot/chat', params);
            return response.data;
        } catch (error) {
            console.error('Error in AI chat:', error);
            throw error;
        }
    }

    async sendMessage(conversationId: string, message: string): Promise<Message> {
        try {
            const response = await apiClient.post(`/api/ai/copilot/chat/${conversationId}`, {
                message,
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async getConversation(conversationId: string): Promise<Conversation> {
        try {
            const response = await apiClient.get(`/api/ai/copilot/conversations/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting conversation:', error);
            throw error;
        }
    }

    async getConversations(): Promise<Conversation[]> {
        try {
            const response = await apiClient.get('/api/ai/copilot/conversations');
            return response.data;
        } catch (error) {
            console.error('Error getting conversations:', error);
            throw error;
        }
    }

    async createConversation(title?: string): Promise<Conversation> {
        try {
            const response = await apiClient.post('/api/ai/copilot/conversations', {
                title: title || 'New Conversation',
            });
            return response.data;
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    }

    async deleteConversation(conversationId: string): Promise<void> {
        try {
            await apiClient.delete(`/api/ai/copilot/conversations/${conversationId}`);
        } catch (error) {
            console.error('Error deleting conversation:', error);
            throw error;
        }
    }

    // Suggestions
    async getSuggestions(params?: { status?: string; category?: string }): Promise<{ suggestions: Suggestion[]; total: number }> {
        try {
            const response = await apiClient.get('/api/ai/copilot/suggestions', { params });
            // Handle if API returns bare array or object
            if (Array.isArray(response.data)) {
                return { suggestions: response.data, total: response.data.length };
            }
            return response.data;
        } catch (error) {
            console.error('Error getting suggestions:', error);
            throw error;
        }
    }

    async updateSuggestion(suggestionId: string, status: 'pending' | 'completed' | 'dismissed'): Promise<void> {
        try {
            await apiClient.patch(`/api/ai/copilot/suggestions/${suggestionId}`, { status });
        } catch (error) {
            console.error('Error updating suggestion:', error);
            throw error;
        }
    }

    async dismissSuggestion(suggestionId: string): Promise<void> {
        return this.updateSuggestion(suggestionId, 'dismissed');
    }

    // Document analysis
    async analyzeDocument(params: { documentText: string; analysisType?: string }): Promise<DocumentAnalysis> {
        try {
            const response = await apiClient.post('/api/ai/copilot/analyze', params);
            return response.data;
        } catch (error) {
            console.error('Error analyzing document:', error);
            throw error;
        }
    }

    // Quick actions
    async getQuickActions(context?: string): Promise<Suggestion[]> {
        try {
            const response = await apiClient.get('/api/ai/copilot/quick-actions', {
                params: { context },
            });
            return response.data;
        } catch (error) {
            console.error('Error getting quick actions:', error);
            throw error;
        }
    }
}

const aiCopilotService = new AICopilotService();
export default aiCopilotService;
