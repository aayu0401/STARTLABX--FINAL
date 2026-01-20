'use client';

import React, { useState } from 'react';
import { Bell, Check, X, Clock, TrendingUp, Users, FileText, MessageSquare, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'message';
    title: string;
    description: string;
    time: string;
    read: boolean;
    actionUrl?: string;
    icon: any;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'success',
            title: 'New hiring proposal accepted',
            description: 'John Doe accepted your proposal for Senior Developer role',
            time: '5 minutes ago',
            read: false,
            actionUrl: '/contracts/123',
            icon: Check
        },
        {
            id: '2',
            type: 'message',
            title: 'New message from Sarah',
            description: 'Interested in discussing the equity offer...',
            time: '1 hour ago',
            read: false,
            actionUrl: '/messages',
            icon: MessageSquare
        },
        {
            id: '3',
            type: 'info',
            title: 'Your pitch deck is ready',
            description: 'AI has generated your pitch deck with 10 slides',
            time: '2 hours ago',
            read: true,
            actionUrl: '/ai-builder',
            icon: FileText
        },
        {
            id: '4',
            type: 'warning',
            title: 'Contract expires soon',
            description: 'Your NDA with TechCorp expires in 7 days',
            time: '1 day ago',
            read: true,
            actionUrl: '/contracts/456',
            icon: Clock
        },
        {
            id: '5',
            type: 'success',
            title: 'New follower',
            description: 'Mike Johnson started following your startup',
            time: '2 days ago',
            read: true,
            actionUrl: '/profile/mike',
            icon: Users
        }
    ]);

    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleDelete = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
            case 'message': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Bell className="w-8 h-8" />
                            Notifications
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            <Check className="w-4 h-4 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'gradient' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        All ({notifications.length})
                    </Button>
                    <Button
                        variant={filter === 'unread' ? 'gradient' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('unread')}
                    >
                        Unread ({unreadCount})
                    </Button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet"}
                        </p>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`p-4 hover-lift transition-all ${!notification.read ? 'border-l-4 border-primary bg-primary/5' : ''
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                                    <notification.icon className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {notification.title}
                                        </h4>
                                        {!notification.read && (
                                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {notification.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">{notification.time}</span>

                                        <div className="flex gap-2">
                                            {notification.actionUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.location.href = notification.actionUrl!}
                                                >
                                                    View
                                                </Button>
                                            )}
                                            {!notification.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(notification.id)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
