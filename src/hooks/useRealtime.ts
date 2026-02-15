'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import realtimeService, { RealtimeService } from '../services/realtime.service';
import { notificationService } from '../services/notification.service';

export interface UseRealtimeOptions {
    autoConnect?: boolean;
    events?: { event: string; handler: (data: any) => void }[];
}

export function useRealtime(options: UseRealtimeOptions = {}) {
    const { autoConnect = true, events = [] } = options;
    const [isConnected, setIsConnected] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const unsubscribersRef = useRef<(() => void)[]>([]);

    useEffect(() => {
        // Subscribe to connection status
        const unsubscribeStatus = realtimeService.on('connection_status', (data) => {
            setIsConnected(data.connected);
            setReconnecting(false);
        });

        const unsubscribeError = realtimeService.on('connection_error', () => {
            setReconnecting(false);
        });

        unsubscribersRef.current.push(unsubscribeStatus, unsubscribeError);

        // Auto-connect if enabled
        if (autoConnect) {
            realtimeService.connect();
            setIsConnected(realtimeService.getConnectionStatus());
        }

        // Subscribe to provided events
        events.forEach(({ event, handler }) => {
            const unsubscribe = realtimeService.on(event, handler);
            unsubscribersRef.current.push(unsubscribe);
        });

        return () => {
            // Cleanup all subscriptions
            unsubscribersRef.current.forEach(unsub => unsub());
            unsubscribersRef.current = [];
        };
    }, [autoConnect]);

    const connect = useCallback(() => {
        realtimeService.connect();
    }, []);

    const disconnect = useCallback(() => {
        realtimeService.disconnect();
    }, []);

    const subscribe = useCallback((event: string, handler: (data: any) => void) => {
        const unsubscribe = realtimeService.on(event, handler);
        unsubscribersRef.current.push(unsubscribe);
        return unsubscribe;
    }, []);

    const send = useCallback((event: string, data: any) => {
        realtimeService.send(event, data);
    }, []);

    return {
        isConnected,
        reconnecting,
        connect,
        disconnect,
        subscribe,
        send,
        service: realtimeService as RealtimeService,
    };
}

// Hook for chat functionality
export function useRealtimeChat(conversationId: string | null) {
    const [messages, setMessages] = useState<any[]>([]);
    const [typing, setTyping] = useState<{ userId: string; isTyping: boolean }[]>([]);
    const { isConnected } = useRealtime();

    useEffect(() => {
        if (!conversationId || !isConnected) return;

        // Join conversation
        realtimeService.joinConversation(conversationId);

        // Subscribe to messages
        const unsubscribeMessage = realtimeService.on('message', (data) => {
            if (data.conversationId === conversationId) {
                setMessages(prev => [...prev, data]);
            }
        });

        // Subscribe to typing indicators
        const unsubscribeTyping = realtimeService.on('typing', (data) => {
            if (data.conversationId === conversationId) {
                setTyping(prev => {
                    const filtered = prev.filter(t => t.userId !== data.userId);
                    if (data.isTyping) {
                        return [...filtered, { userId: data.userId, isTyping: true }];
                    }
                    return filtered;
                });
            }
        });

        return () => {
            realtimeService.leaveConversation(conversationId);
            unsubscribeMessage();
            unsubscribeTyping();
        };
    }, [conversationId, isConnected]);

    const sendMessage = useCallback((message: any) => {
        if (conversationId) {
            realtimeService.sendMessage(conversationId, message);
        }
    }, [conversationId]);

    const sendTyping = useCallback((isTyping: boolean) => {
        if (conversationId) {
            realtimeService.sendTypingIndicator(conversationId, isTyping);
        }
    }, [conversationId]);

    return {
        messages,
        typing,
        sendMessage,
        sendTyping,
        isConnected,
    };
}

// Hook for feed updates
export function useRealtimeFeed(feedType: 'global' | 'following' | 'trending' = 'global') {
    const [posts, setPosts] = useState<any[]>([]);
    const [newPostsCount, setNewPostsCount] = useState(0);
    const { isConnected } = useRealtime();

    useEffect(() => {
        if (!isConnected) return;

        // Join feed
        realtimeService.joinFeed(feedType);

        // Subscribe to new posts
        const unsubscribePost = realtimeService.on('new_post', (data) => {
            setPosts(prev => [data, ...prev]);
            setNewPostsCount(prev => prev + 1);
        });

        // Subscribe to comments
        const unsubscribeComment = realtimeService.on('new_comment', (data) => {
            setPosts(prev => prev.map(post =>
                post.id === data.postId
                    ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
                    : post
            ));
        });

        // Subscribe to likes
        const unsubscribeLike = realtimeService.on('new_like', (data) => {
            setPosts(prev => prev.map(post =>
                post.id === data.postId
                    ? { ...post, likesCount: (post.likesCount || 0) + 1 }
                    : post
            ));
        });

        // Subscribe to new opportunities
        const unsubscribeOpp = realtimeService.on('new_opportunity', (data) => {
            // Normalize opportunity to feed post format
            const opportunityPost = {
                ...data,
                type: 'OPPORTUNITY',
                title: data.role,
                content: data.description,
                user: data.creator,
                likesCount: 0,
                commentsCount: 0,
                sharesCount: 0,
                isRealtime: true
            };
            setPosts(prev => [opportunityPost, ...prev]);
            setNewPostsCount(prev => prev + 1);
        });

        return () => {
            realtimeService.leaveFeed(feedType);
            unsubscribePost();
            unsubscribeComment();
            unsubscribeLike();
            unsubscribeOpp();
        };
    }, [feedType, isConnected]);

    const clearNewPostsCount = useCallback(() => {
        setNewPostsCount(0);
    }, []);

    return {
        posts,
        newPostsCount,
        clearNewPostsCount,
        isConnected,
    };
}

// Hook for notifications
export function useRealtimeNotifications(userId: string | null) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isConnected } = useRealtime();
    const fetchedRef = useRef(false);

    const fetchInitial = useCallback(async () => {
        if (!userId) return;
        try {
            const { data } = await notificationService.getNotifications({ limit: 20 });
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
            fetchedRef.current = true;
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        if (!fetchedRef.current) {
            fetchInitial();
        }

        if (!isConnected) return;

        // Subscribe to notifications
        realtimeService.subscribeToNotifications(userId);

        const unsubscribe = realtimeService.on('new_notification', (data) => {
            setNotifications(prev => [data, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            realtimeService.unsubscribeFromNotifications(userId);
            unsubscribe();
        };
    }, [userId, isConnected, fetchInitial]);

    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    }, []);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        isConnected,
        refresh: fetchInitial
    };
}

// Hook for analytics updates
export function useRealtimeAnalytics(dashboardId: string | null) {
    const [analytics, setAnalytics] = useState<any>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const { isConnected } = useRealtime();

    useEffect(() => {
        if (!dashboardId || !isConnected) return;

        // Subscribe to analytics
        realtimeService.subscribeToAnalytics(dashboardId);

        const unsubscribe = realtimeService.on('analytics_update', (data) => {
            setAnalytics(data);
            setLastUpdate(new Date());
        });

        return () => {
            realtimeService.unsubscribeFromAnalytics(dashboardId);
            unsubscribe();
        };
    }, [dashboardId, isConnected]);

    return {
        analytics,
        lastUpdate,
        isConnected,
    };
}

// Hook for user presence
export function useRealtimePresence() {
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const { isConnected } = useRealtime();

    useEffect(() => {
        if (!isConnected) return;

        const unsubscribeOnline = realtimeService.on('user_online', (data) => {
            setOnlineUsers(prev => new Set([...prev, data.userId]));
        });

        const unsubscribeOffline = realtimeService.on('user_offline', (data) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
        });

        return () => {
            unsubscribeOnline();
            unsubscribeOffline();
        };
    }, [isConnected]);

    const updatePresence = useCallback((status: 'online' | 'away' | 'busy' | 'offline') => {
        realtimeService.updatePresence(status);
    }, []);

    const isUserOnline = useCallback((userId: string) => {
        return onlineUsers.has(userId);
    }, [onlineUsers]);

    return {
        onlineUsers: Array.from(onlineUsers),
        updatePresence,
        isUserOnline,
        isConnected,
    };
}
