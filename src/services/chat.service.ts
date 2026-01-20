import { apiClient } from '@/lib/api-client';
import { io, Socket } from 'socket.io-client';

export interface Conversation {
    id: string;
    type: 'direct' | 'group';
    name?: string;
    avatar?: string;
    participants: Array<{
        userId: string;
        name: string;
        avatar?: string;
        lastReadAt?: string;
    }>;
    lastMessage?: Message;
    lastMessageAt: string;
    unreadCount: number;
    createdAt: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    type: 'text' | 'file' | 'image' | 'system';
    content: string;
    attachments?: Array<{
        type: string;
        url: string;
        name: string;
        size: number;
    }>;
    readBy: Array<{
        userId: string;
        readAt: string;
    }>;
    createdAt: string;
    sender?: {
        id: string;
        name: string;
        avatar?: string;
    };
}

class ChatService {
    private socket: Socket | null = null;
    private listeners: Map<string, Function[]> = new Map();

    // REST API methods
    getConversations = (params?: { page?: number; limit?: number }) =>
        apiClient.get<{ conversations: Conversation[]; total: number }>('/api/chat/conversations', { params });

    getConversation = (id: string) =>
        apiClient.get<Conversation>(`/api/chat/conversations/${id}`);

    createConversation = (data: { participantIds: string[]; name?: string }) =>
        apiClient.post<Conversation>('/api/chat/conversations', data);

    deleteConversation = (id: string) =>
        apiClient.delete(`/api/chat/conversations/${id}`);

    getMessages = (conversationId: string, params?: { page?: number; limit?: number }) =>
        apiClient.get<{ messages: Message[]; total: number }>(`/api/chat/conversations/${conversationId}/messages`, { params });

    sendMessage = (conversationId: string, content: string, attachments?: any[]) =>
        apiClient.post<Message>(`/api/chat/conversations/${conversationId}/messages`, {
            content,
            attachments,
        });

    markAsRead = (messageId: string) =>
        apiClient.post(`/api/chat/messages/${messageId}/read`);

    uploadFile = (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<{ url: string; name: string; size: number }>('/api/chat/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    // WebSocket methods
    connect() {
        if (typeof window === 'undefined') {
            console.warn('Cannot connect to chat on server side');
            return null;
        }

        const token = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('access_token') : null;
        const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8087';

        this.socket = io(WS_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to chat server');
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from chat server');
        });

        this.socket.on('error', (error) => {
            console.error('Chat error:', error);
        });

        // Set up event listeners
        this.setupEventListeners();

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.listeners.clear();
    }

    private setupEventListeners() {
        if (!this.socket) return;

        // New message
        this.socket.on('new_message', (message: Message) => {
            this.emit('new_message', message);
        });

        // Message updated
        this.socket.on('message_updated', (message: Message) => {
            this.emit('message_updated', message);
        });

        // Message deleted
        this.socket.on('message_deleted', (data: { messageId: string }) => {
            this.emit('message_deleted', data);
        });

        // User typing
        this.socket.on('user_typing', (data: { userId: string; conversationId: string }) => {
            this.emit('user_typing', data);
        });

        // User online/offline
        this.socket.on('user_online', (data: { userId: string }) => {
            this.emit('user_online', data);
        });

        this.socket.on('user_offline', (data: { userId: string }) => {
            this.emit('user_offline', data);
        });

        // Message read
        this.socket.on('message_read', (data: { messageId: string; userId: string }) => {
            this.emit('message_read', data);
        });
    }

    // Event emitter methods
    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    off(event: string, callback: Function) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    private emit(event: string, data: any) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    // Socket emit methods
    joinConversation(conversationId: string) {
        this.socket?.emit('join_conversation', { conversationId });
    }

    leaveConversation(conversationId: string) {
        this.socket?.emit('leave_conversation', { conversationId });
    }

    sendMessageViaSocket(conversationId: string, content: string) {
        this.socket?.emit('send_message', { conversationId, content });
    }

    startTyping(conversationId: string) {
        this.socket?.emit('typing_start', { conversationId });
    }

    stopTyping(conversationId: string) {
        this.socket?.emit('typing_stop', { conversationId });
    }

    markMessageRead(messageId: string) {
        this.socket?.emit('mark_read', { messageId });
    }
}

export const chatService = new ChatService();
