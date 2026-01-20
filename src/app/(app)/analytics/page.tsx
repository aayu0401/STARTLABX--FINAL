'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Eye, Heart, MessageCircle, Share2, Target, Calendar, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn, formatNumber } from '@/lib/utils';
import { dashboardService } from '@/services/dashboard.service';

interface StatCard {
    title: string;
    value: string;
    change: number;
    icon: any;
    color: string;
}

interface ChartData {
    label: string;
    value: number;
}

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            // In production, fetch from API
            // const data = await dashboardService.getAnalytics({ timeRange });
            setTimeout(() => setLoading(false), 500);
        } catch (error) {
            console.error('Failed to load analytics:', error);
            setLoading(false);
        }
    };

    const stats: StatCard[] = [
        {
            title: 'Total Views',
            value: '45.2K',
            change: 12.5,
            icon: Eye,
            color: 'text-blue-600',
        },
        {
            title: 'Engagement Rate',
            value: '8.4%',
            change: 3.2,
            icon: Heart,
            color: 'text-red-600',
        },
        {
            title: 'New Followers',
            value: '1,234',
            change: -2.4,
            icon: Users,
            color: 'text-green-600',
        },
        {
            title: 'Total Interactions',
            value: '12.8K',
            change: 18.7,
            icon: MessageCircle,
            color: 'text-purple-600',
        },
    ];

    const engagementData: ChartData[] = [
        { label: 'Mon', value: 65 },
        { label: 'Tue', value: 78 },
        { label: 'Wed', value: 82 },
        { label: 'Thu', value: 71 },
        { label: 'Fri', value: 88 },
        { label: 'Sat', value: 95 },
        { label: 'Sun', value: 73 },
    ];

    const topPosts = [
        {
            id: '1',
            title: 'How we scaled to 1M users',
            views: 12543,
            likes: 892,
            comments: 156,
            shares: 234,
        },
        {
            id: '2',
            title: 'Building a remote-first culture',
            views: 9876,
            likes: 654,
            comments: 98,
            shares: 187,
        },
        {
            id: '3',
            title: 'AI trends for 2025',
            views: 8765,
            likes: 543,
            comments: 87,
            shares: 145,
        },
    ];

    const audienceData = [
        { label: 'Founders', value: 35, color: 'bg-primary' },
        { label: 'Developers', value: 28, color: 'bg-accent' },
        { label: 'Designers', value: 18, color: 'bg-green-500' },
        { label: 'Marketers', value: 12, color: 'bg-purple-500' },
        { label: 'Others', value: 7, color: 'bg-gray-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gradient-primary">Analytics Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Track your performance and insights
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                            <TabsList>
                                <TabsTrigger value="7d">7 Days</TabsTrigger>
                                <TabsTrigger value="30d">30 Days</TabsTrigger>
                                <TabsTrigger value="90d">90 Days</TabsTrigger>
                                <TabsTrigger value="1y">1 Year</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                        <Button variant="gradient" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const isPositive = stat.change > 0;

                        return (
                            <Card key={index} hover glass className="overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn('p-3 rounded-xl bg-gradient-to-br',
                                            index === 0 && 'from-blue-500/20 to-blue-600/20',
                                            index === 1 && 'from-red-500/20 to-red-600/20',
                                            index === 2 && 'from-green-500/20 to-green-600/20',
                                            index === 3 && 'from-purple-500/20 to-purple-600/20'
                                        )}>
                                            <Icon className={cn('h-6 w-6', stat.color)} />
                                        </div>
                                        <Badge variant={isPositive ? 'success' : 'destructive'} className="gap-1">
                                            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            {Math.abs(stat.change)}%
                                        </Badge>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Engagement Chart */}
                    <Card glass className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Engagement Overview
                            </CardTitle>
                            <CardDescription>Daily engagement metrics for the past week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {engagementData.map((data, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{data.label}</span>
                                            <span className="text-muted-foreground">{data.value}%</span>
                                        </div>
                                        <Progress value={data.value} variant="gradient" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Audience Breakdown */}
                    <Card glass>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Audience Breakdown
                            </CardTitle>
                            <CardDescription>Who's engaging with your content</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {audienceData.map((segment, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{segment.label}</span>
                                        <span className="text-muted-foreground">{segment.value}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={cn('h-full transition-all', segment.color)}
                                            style={{ width: `${segment.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Top Performing Posts */}
                <Card glass>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Top Performing Posts
                        </CardTitle>
                        <CardDescription>Your most engaging content this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{post.title}</h4>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Published 2 days ago
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="text-center p-3 bg-background rounded-lg">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Eye className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-bold">{formatNumber(post.views)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Views</p>
                                        </div>
                                        <div className="text-center p-3 bg-background rounded-lg">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Heart className="h-4 w-4 text-red-600" />
                                                <span className="text-sm font-bold">{formatNumber(post.likes)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Likes</p>
                                        </div>
                                        <div className="text-center p-3 bg-background rounded-lg">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <MessageCircle className="h-4 w-4 text-green-600" />
                                                <span className="text-sm font-bold">{formatNumber(post.comments)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Comments</p>
                                        </div>
                                        <div className="text-center p-3 bg-background rounded-lg">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Share2 className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm font-bold">{formatNumber(post.shares)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Shares</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Growth Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Card glass className="bg-gradient-to-br from-primary/10 to-accent/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Growth Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-background/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Profile Views</span>
                                    <Badge variant="success">+24%</Badge>
                                </div>
                                <Progress value={76} variant="success" />
                            </div>
                            <div className="p-4 bg-background/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Connection Requests</span>
                                    <Badge variant="success">+18%</Badge>
                                </div>
                                <Progress value={62} variant="gradient" />
                            </div>
                            <div className="p-4 bg-background/50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Post Reach</span>
                                    <Badge variant="success">+31%</Badge>
                                </div>
                                <Progress value={84} variant="success" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card glass className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-green-600" />
                                Activity Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                                <div>
                                    <p className="text-2xl font-bold">45</p>
                                    <p className="text-sm text-muted-foreground">Posts Published</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <MessageCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                                <div>
                                    <p className="text-2xl font-bold">1,234</p>
                                    <p className="text-sm text-muted-foreground">Comments Made</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <MessageCircle className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                                <div>
                                    <p className="text-2xl font-bold">89</p>
                                    <p className="text-sm text-muted-foreground">Connections Made</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
