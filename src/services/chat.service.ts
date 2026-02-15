import { apiClient } from '@/lib/api-client';

export interface ChatUser {
    id: string;
    name: string;
    avatar: string;
    title: string;
    online: boolean;
}

export interface Conversation {
    id: string;
    user: ChatUser;
    lastMessage: {
        content: string;
        timestamp: string;
        read: boolean;
        fromMe: boolean;
    };
    unreadCount: number;
}

export interface Message {
    id: string;
    conversationId?: string;
    content: string;
    timestamp: string;
    fromMe: boolean;
    read: boolean;
    type: 'text' | 'image' | 'file';
}

export const chatService = {
    // Socket instance
    socket: null as any,

    // Connect to WebSocket
    connect: () => {
        if (typeof window === 'undefined') return;

        // Dynamic import to avoid SSR issues
        import('socket.io-client').then(({ io }) => {
            if (!chatService.socket) {
                chatService.socket = io({
                    path: '/socket.io', // Standard Socket.IO path
                    addTrailingSlash: false,
                });

                chatService.socket.on('connect', () => {
                    console.log('Connected to chat server');
                });
            }
        });
    },

    // Disconnect
    disconnect: () => {
        if (chatService.socket) {
            chatService.socket.disconnect();
            chatService.socket = null;
        }
    },

    // Join conversation room
    joinConversation: (conversationId: string) => {
        if (chatService.socket) {
            chatService.socket.emit('join_conversation', conversationId);
        }
    },

    // Listen for new messages
    onMessage: (callback: (message: Message) => void) => {
        // Wait for socket to be initialized
        const interval = setInterval(() => {
            if (chatService.socket) {
                chatService.socket.on('receive_message', callback);
                clearInterval(interval);
            }
        }, 100);
        // Timeout to clear interval
        setTimeout(() => clearInterval(interval), 5000);
    },

    // Get conversations
    getConversations: () =>
        apiClient.get<Conversation[]>('/api/chat/conversations').then(res => res.data),

    // Get messages
    getMessages: (conversationId: string) =>
        apiClient.get<Message[]>(`/api/chat/messages/${conversationId}`).then(res => res.data),

    // Send message
    sendMessage: async (conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
        const response = await apiClient.post<Message>(`/api/chat/messages/${conversationId}`, { content, type });

        // Emit via socket for real-time update
        if (chatService.socket) {
            chatService.socket.emit('send_message', {
                conversationId,
                ...response.data
            });
        }

        return response;
    },
};
