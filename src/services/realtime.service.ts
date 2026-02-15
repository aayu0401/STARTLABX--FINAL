import { io, Socket } from 'socket.io-client';

export interface RealtimeMessage {
    id: string;
    type: 'post' | 'comment' | 'like' | 'notification' | 'chat' | 'analytics';
    data: any;
    timestamp: Date;
    userId?: string;
}

export interface RealtimeEvent {
    event: string;
    handler: (data: any) => void;
}

export class RealtimeService {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();
    private isConnected = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.initializeSocket();
        }
    }

    private initializeSocket() {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3002';

        this.socket = io(wsUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: this.maxReconnectAttempts,
            autoConnect: true,
        });

        this.setupEventListeners();
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('✅ Real-time connection established');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.emit('connection_status', { connected: true });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Real-time connection lost:', reason);
            this.isConnected = false;
            this.emit('connection_status', { connected: false, reason });
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 Reconnection attempt ${attemptNumber}/${this.maxReconnectAttempts}`);
            this.reconnectAttempts = attemptNumber;
        });

        this.socket.on('reconnect_failed', () => {
            console.log('❌ Failed to reconnect after maximum attempts');
            this.emit('connection_error', { message: 'Failed to reconnect' });
        });

        // Real-time data events
        this.socket.on('receive_message', (data) => {
            this.emit('message', data);
        });

        this.socket.on('new_post', (data) => {
            this.emit('new_post', data);
        });

        this.socket.on('new_comment', (data) => {
            this.emit('new_comment', data);
        });

        this.socket.on('new_like', (data) => {
            this.emit('new_like', data);
        });

        this.socket.on('new_notification', (data) => {
            this.emit('new_notification', data);
        });

        this.socket.on('analytics_update', (data) => {
            this.emit('analytics_update', data);
        });

        this.socket.on('user_online', (data) => {
            this.emit('user_online', data);
        });

        this.socket.on('user_offline', (data) => {
            this.emit('user_offline', data);
        });

        this.socket.on('typing', (data) => {
            this.emit('typing', data);
        });

        this.socket.on('new_opportunity', (data) => {
            this.emit('new_opportunity', data);
        });
    }

    // Connection management
    connect() {
        if (this.socket && !this.isConnected) {
            this.socket.connect();
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.isConnected = false;
        }
    }

    getConnectionStatus(): boolean {
        return this.isConnected;
    }

    // Event subscription
    on(event: string, handler: (data: any) => void) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event)!.add(handler);

        // Return unsubscribe function
        return () => this.off(event, handler);
    }

    off(event: string, handler: (data: any) => void) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.delete(handler);
        }
    }

    private emit(event: string, data: any) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }

    // Chat functionality
    joinConversation(conversationId: string) {
        if (this.socket) {
            this.socket.emit('join_conversation', conversationId);
            console.log(`📥 Joined conversation: ${conversationId}`);
        }
    }

    leaveConversation(conversationId: string) {
        if (this.socket) {
            this.socket.emit('leave_conversation', conversationId);
            console.log(`📤 Left conversation: ${conversationId}`);
        }
    }

    sendMessage(conversationId: string, message: any) {
        if (this.socket) {
            this.socket.emit('send_message', {
                conversationId,
                ...message,
                timestamp: new Date(),
            });
        }
    }

    sendTypingIndicator(conversationId: string, isTyping: boolean) {
        if (this.socket) {
            this.socket.emit('typing', {
                conversationId,
                isTyping,
                timestamp: new Date(),
            });
        }
    }

    // Feed functionality
    joinFeed(feedType: 'global' | 'following' | 'trending' = 'global') {
        if (this.socket) {
            this.socket.emit('join_feed', feedType);
            console.log(`📰 Joined ${feedType} feed`);
        }
    }

    leaveFeed(feedType: string) {
        if (this.socket) {
            this.socket.emit('leave_feed', feedType);
        }
    }

    // Notification functionality
    subscribeToNotifications(userId: string) {
        if (this.socket) {
            this.socket.emit('subscribe_notifications', userId);
            console.log(`🔔 Subscribed to notifications for user: ${userId}`);
        }
    }

    unsubscribeFromNotifications(userId: string) {
        if (this.socket) {
            this.socket.emit('unsubscribe_notifications', userId);
        }
    }

    // Analytics functionality
    subscribeToAnalytics(dashboardId: string) {
        if (this.socket) {
            this.socket.emit('subscribe_analytics', dashboardId);
            console.log(`📊 Subscribed to analytics: ${dashboardId}`);
        }
    }

    unsubscribeFromAnalytics(dashboardId: string) {
        if (this.socket) {
            this.socket.emit('unsubscribe_analytics', dashboardId);
        }
    }

    // Presence functionality
    updatePresence(status: 'online' | 'away' | 'busy' | 'offline') {
        if (this.socket) {
            this.socket.emit('update_presence', {
                status,
                timestamp: new Date(),
            });
        }
    }

    // Generic emit
    send(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    // Cleanup
    destroy() {
        this.eventHandlers.clear();
        if (this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

// Singleton instance
const realtimeService = new RealtimeService();

// Auto-connect on initialization
if (typeof window !== 'undefined') {
    realtimeService.connect();
}

export default realtimeService;
