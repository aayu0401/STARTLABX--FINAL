'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Eye, Trash2, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { notificationService, Notification } from '@/services/notification.service';
import { useToast } from '@/hooks/use-toast';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { toast } = useToast();

    useEffect(() => {
        loadNotifications();
    }, [filter]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications({
                unreadOnly: filter === 'unread',
                limit: 50,
            });
            setNotifications(response.data.notifications);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            toast({
                title: 'Error',
                description: 'Failed to load notifications',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
            );
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast({
                title: 'Success',
                description: 'All notifications marked as read',
            });
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast({
                title: 'Success',
                description: 'Notification deleted',
            });
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleAction = async (id: string, action: 'accept' | 'decline' | 'view' | 'dismiss') => {
        try {
            await notificationService.performAction(id, action);
            toast({
                title: 'Success',
                description: `Action ${action} performed successfully`,
            });
            loadNotifications();
        } catch (error) {
            console.error('Failed to perform action:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, React.ReactNode> = {
            mention: '💬',
            like: '❤️',
            comment: '💭',
            share: '🔄',
            follow: '👤',
            message: '✉️',
            connection: '🤝',
            invite: '📨',
            system: '🔔',
        };
        return icons[type] || '🔔';
    };

    const groupByDate = (notifications: Notification[]) => {
        const groups: Record<string, Notification[]> = {
            Today: [],
            Yesterday: [],
            'This Week': [],
            Older: [],
        };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        notifications.forEach(notification => {
            const date = new Date(notification.createdAt);
            if (date >= today) {
                groups.Today.push(notification);
            } else if (date >= yesterday) {
                groups.Yesterday.push(notification);
            } else if (date >= weekAgo) {
                groups['This Week'].push(notification);
            } else {
                groups.Older.push(notification);
            }
        });

        return groups;
    };

    const groupedNotifications = groupByDate(notifications);

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Notifications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Stay updated with your latest activity
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        disabled={notifications.every(n => n.isRead)}
                    >
                        <Check className="w-4 h-4 mr-2" />
                        Mark All Read
                    </Button>
                    <Link href="/settings#notifications">
                        <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="mb-6">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">
                        Unread
                        {notifications.filter(n => !n.isRead).length > 0 && (
                            <Badge variant="default" className="ml-2">
                                {notifications.filter(n => !n.isRead).length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Notifications List */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="p-4 animate-pulse">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <Card className="p-12 text-center">
                    <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {filter === 'unread'
                            ? "You're all caught up!"
                            : "You don't have any notifications yet"}
                    </p>
                </Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedNotifications).map(([group, items]) =>
                        items.length > 0 ? (
                            <div key={group}>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                                    {group}
                                </h3>
                                <div className="space-y-2">
                                    {items.map(notification => (
                                        <Card
                                            key={notification.id}
                                            className={`p-4 transition-all ${!notification.isRead
                                                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className="text-2xl flex-shrink-0">
                                                    {getNotificationIcon(notification.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.isRead && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>

                                                    {/* Actions */}
                                                    {notification.actionable && notification.actions && (
                                                        <div className="flex items-center gap-2 mt-3">
                                                            {notification.actions.map((action, idx) => (
                                                                <Button
                                                                    key={idx}
                                                                    size="sm"
                                                                    variant={action.action === 'accept' ? 'default' : 'outline'}
                                                                    onClick={() => handleAction(notification.id, action.action)}
                                                                >
                                                                    {action.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    {!notification.isRead && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(notification.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            )}
        </div>
    );
}
