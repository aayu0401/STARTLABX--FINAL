'use client';

import React, { useState } from 'react';
import { Clock, Filter, Sparkles, FileText, Users, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

interface Activity {
    id: string;
    type: 'pitch' | 'mvp' | 'contract' | 'hire' | 'ai' | 'social' | 'team';
    title: string;
    description: string;
    user: string;
    avatar?: string;
    timestamp: Date;
    metadata?: any;
}

export default function ActivityPage() {
    const [filter, setFilter] = useState<'all' | string>('all');

    const activities: Activity[] = [
        {
            id: '1',
            type: 'pitch',
            title: 'Created pitch deck',
            description: 'TechStartup 2024 pitch deck with 10 slides',
            user: 'You',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            metadata: { slides: 10 }
        },
        {
            id: '2',
            type: 'hire',
            title: 'Received hiring proposal',
            description: 'John Doe applied for Senior Developer position',
            user: 'John Doe',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
            id: '3',
            type: 'ai',
            title: 'Idea validation completed',
            description: 'Your startup idea scored 85/100',
            user: 'AI Copilot',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            metadata: { score: 85 }
        },
        {
            id: '4',
            type: 'contract',
            title: 'Contract signed',
            description: 'NDA with Sarah Johnson',
            user: 'Sarah Johnson',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
            id: '5',
            type: 'social',
            title: 'New connection',
            description: 'Mike Chen accepted your connection request',
            user: 'Mike Chen',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
            id: '6',
            type: 'mvp',
            title: 'MVP plan created',
            description: 'Generated 12-week MVP roadmap',
            user: 'You',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            metadata: { weeks: 12, features: 15 }
        },
        {
            id: '7',
            type: 'team',
            title: 'Team member added',
            description: 'Alex Rodriguez joined your team',
            user: 'Alex Rodriguez',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
    ];

    const activityTypes = [
        { value: 'all', label: 'All Activity', icon: Clock },
        { value: 'ai', label: 'AI Actions', icon: Sparkles },
        { value: 'pitch', label: 'Pitch Decks', icon: FileText },
        { value: 'hire', label: 'Hiring', icon: Users },
        { value: 'social', label: 'Social', icon: MessageSquare },
        { value: 'team', label: 'Team', icon: Users }
    ];

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'pitch': return FileText;
            case 'mvp': return TrendingUp;
            case 'contract': return FileText;
            case 'hire': return Users;
            case 'ai': return Sparkles;
            case 'social': return MessageSquare;
            case 'team': return Users;
            default: return CheckCircle;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'pitch': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
            case 'mvp': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'contract': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            case 'hire': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
            case 'ai': return 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300';
            case 'social': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300';
            case 'team': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    const filteredActivities = filter === 'all'
        ? activities
        : activities.filter(a => a.type === filter);

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Clock className="w-8 h-8" />
                    Activity Feed
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Track all your actions and updates
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-2 flex-wrap">
                {activityTypes.map((type) => (
                    <Button
                        key={type.value}
                        variant={filter === type.value ? 'gradient' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(type.value)}
                    >
                        <type.icon className="w-4 h-4 mr-2" />
                        {type.label}
                    </Button>
                ))}
            </div>

            {/* Activity Timeline */}
            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                {/* Activities */}
                <div className="space-y-6">
                    {filteredActivities.map((activity) => {
                        const Icon = getActivityIcon(activity.type);

                        return (
                            <div key={activity.id} className="relative pl-16">
                                {/* Timeline Dot */}
                                <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                {/* Activity Card */}
                                <Card className="p-4 hover-lift">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                {activity.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <Badge variant="glass" className="text-xs">
                                            {activity.type}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-2 mt-3">
                                        <Avatar className="w-6 h-6 bg-gradient-to-br from-primary to-accent">
                                            <span className="text-xs text-white">{activity.user.charAt(0)}</span>
                                        </Avatar>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {activity.user}
                                        </span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-gray-500">
                                            {formatTimestamp(activity.timestamp)}
                                        </span>
                                    </div>

                                    {/* Metadata */}
                                    {activity.metadata && (
                                        <div className="mt-3 flex gap-2">
                                            {Object.entries(activity.metadata).map(([key, value]) => (
                                                <Badge key={key} variant="glass" className="text-xs">
                                                    {key}: {value}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Empty State */}
            {filteredActivities.length === 0 && (
                <Card className="p-12 text-center">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Start using the platform to see your activity here
                    </p>
                </Card>
            )}
        </div>
    );
}
