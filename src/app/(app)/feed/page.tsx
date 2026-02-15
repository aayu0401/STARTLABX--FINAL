'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Users, Hash, Sparkles, Filter, RefreshCw, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PostCard } from '@/components/feed/post-card';
import { CreatePostModal } from '@/components/feed/create-post-modal';
import { postService, type Post } from '@/services/post.service';
import { cn } from '@/lib/utils';
import { useRealtime, useRealtimeFeed } from '@/hooks/useRealtime';
import { RealtimeStatus, RealtimeUpdateBadge } from '@/components/realtime/realtime-status';

// Mock trending data
const TRENDING_TOPICS = [
    { tag: 'AI', count: 1234, trend: '+12%' },
    { tag: 'Startup', count: 987, trend: '+8%' },
    { tag: 'Funding', count: 756, trend: '+15%' },
    { tag: 'WebDev', count: 654, trend: '+5%' },
    { tag: 'Design', count: 543, trend: '+10%' },
];

const SUGGESTED_USERS = [
    { id: '1', name: 'Sarah Chen', title: 'Product Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen&backgroundColor=b6e3f4', mutual: 12 },
    { id: '2', name: 'Alex Kumar', title: 'Full Stack Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexKumar&backgroundColor=c0aede', mutual: 8 },
    { id: '3', name: 'Emma Wilson', title: 'Marketing Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaWilson&backgroundColor=ffdfbf', mutual: 15 },
];

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'following' | 'trending'>('all');

    // Real-time feed updates
    const { send } = useRealtime();
    const feedType = activeFilter === 'all' ? 'global' : activeFilter === 'following' ? 'following' : 'trending';
    const { posts: realtimePosts, newPostsCount, clearNewPostsCount, isConnected } = useRealtimeFeed(feedType);

    useEffect(() => {
        loadFeed();
    }, [activeFilter]);

    // Merge real-time posts with existing posts
    useEffect(() => {
        if (realtimePosts.length > 0) {
            setPosts(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const newPosts = realtimePosts.filter(p => !existingIds.has(p.id));
                return [...newPosts, ...prev];
            });
        }
    }, [realtimePosts]);

    const loadFeed = async () => {
        try {
            setLoading(true);
            const response = await postService.getFeed({ filter: activeFilter });
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Failed to load feed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshFeed = () => {
        clearNewPostsCount();
        loadFeed();
    };

    const handleLike = async (postId: string) => {
        try {
            await postService.like(postId);
            // Update local state
            setPosts(posts.map(p =>
                p.id === postId
                    ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
                    : p
            ));
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleComment = async (postId: string, content: string) => {
        try {
            const response = await postService.comment(postId, content);
            send('post_commented', { postId, comment: response.data });
            // Update local state
            setPosts(posts.map(p =>
                p.id === postId
                    ? { ...p, commentsCount: p.commentsCount + 1 }
                    : p
            ));
        } catch (error) {
            console.error('Failed to comment:', error);
        }
    };

    const handleShare = async (postId: string) => {
        // Implement share functionality
        console.log('Share post:', postId);
    };

    const handleSave = async (postId: string) => {
        // Implement save functionality
        setPosts(posts.map(p =>
            p.id === postId
                ? { ...p, isSaved: !p.isSaved }
                : p
        ));
    };

    const handleCreatePost = async (postData: any) => {
        try {
            const response = await postService.create(postData);
            send('new_post', response.data);
            setIsCreateModalOpen(false);
            loadFeed(); // Reload feed
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Feed */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold text-gradient-primary">Social Feed</h1>
                                    <RealtimeUpdateBadge
                                        count={newPostsCount}
                                        onClick={handleRefreshFeed}
                                    />
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-muted-foreground">
                                        Connect, share, and grow with the community
                                    </p>
                                    {isConnected && (
                                        <Badge variant="success" className="text-xs">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />
                                            Live
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="gap-2"
                                    onClick={handleRefreshFeed}
                                    disabled={loading}
                                >
                                    <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
                                    Refresh
                                </Button>
                                <Button
                                    variant="gradient"
                                    size="lg"
                                    className="gap-2 shadow-lg hover-lift"
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    <Plus className="h-5 w-5" />
                                    Create Post
                                </Button>
                            </div>
                        </div>

                        {/* Filters */}
                        <Card glass>
                            <CardContent className="p-4">
                                <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as any)}>
                                    <TabsList className="grid w-full grid-cols-4">
                                        <TabsTrigger value="all" className="gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            All Posts
                                        </TabsTrigger>
                                        <TabsTrigger value="following" className="gap-2">
                                            <Users className="h-4 w-4" />
                                            Following
                                        </TabsTrigger>
                                        <TabsTrigger value="trending" className="gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            Trending
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="launches"
                                            className="gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                                        >
                                            <Rocket className="h-4 w-4" /> Launches
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* Posts Feed */}
                        <div className="space-y-4">
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 3 }).map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex gap-3">
                                                <div className="h-12 w-12 rounded-full bg-muted" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-muted rounded w-1/4" />
                                                    <div className="h-3 bg-muted rounded w-1/6" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-muted rounded w-full" />
                                                <div className="h-4 bg-muted rounded w-3/4" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : posts.length === 0 ? (
                                <Card className="text-center p-12">
                                    <div className="text-muted-foreground">
                                        <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium">No posts yet</p>
                                        <p className="text-sm mt-2">Be the first to share something!</p>
                                    </div>
                                </Card>
                            ) : (
                                posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onLike={handleLike}
                                        onComment={handleComment}
                                        onShare={handleShare}
                                        onSave={handleSave}
                                    />
                                ))
                            )}
                        </div>

                        {/* Load More */}
                        {!loading && posts.length > 0 && (
                            <div className="text-center">
                                <Button variant="outline" size="lg" className="gap-2">
                                    Load More Posts
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Trending Topics */}
                        <Card glass hover className="overflow-hidden">
                            <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-accent/10">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Trending Topics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {TRENDING_TOPICS.map((topic, index) => (
                                        <div
                                            key={topic.tag}
                                            className="p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-muted-foreground">
                                                            #{index + 1}
                                                        </span>
                                                        <Hash className="h-3 w-3 text-primary" />
                                                        <span className="font-semibold group-hover:text-primary transition-colors">
                                                            {topic.tag}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {topic.count.toLocaleString()} posts
                                                    </p>
                                                </div>
                                                <Badge variant="success" className="text-xs">
                                                    {topic.trend}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Suggested Connections */}
                        <Card glass hover>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Users className="h-5 w-5 text-primary" />
                                    Suggested for You
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {SUGGESTED_USERS.map((user) => (
                                    <div key={user.id} className="flex items-center gap-3">
                                        <Avatar size="md" className="cursor-pointer hover:ring-4 hover:ring-primary/20 transition-all">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback name={user.name} />
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate hover:text-primary cursor-pointer transition-colors">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.mutual} mutual connections
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Follow
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="ghost" className="w-full text-sm">
                                    See all suggestions
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card glass className="bg-gradient-to-br from-primary/10 to-accent/10">
                            <CardContent className="p-6 space-y-4">
                                <div className="text-center">
                                    <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
                                    <h3 className="font-semibold text-lg">Your Impact</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-background/50 rounded-lg">
                                        <p className="text-2xl font-bold text-primary">1.2K</p>
                                        <p className="text-xs text-muted-foreground">Followers</p>
                                    </div>
                                    <div className="text-center p-3 bg-background/50 rounded-lg">
                                        <p className="text-2xl font-bold text-accent">856</p>
                                        <p className="text-xs text-muted-foreground">Following</p>
                                    </div>
                                    <div className="text-center p-3 bg-background/50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">45</p>
                                        <p className="text-xs text-muted-foreground">Posts</p>
                                    </div>
                                    <div className="text-center p-3 bg-background/50 rounded-lg">
                                        <p className="text-2xl font-bold text-orange-600">3.4K</p>
                                        <p className="text-xs text-muted-foreground">Engagement</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSubmit={handleCreatePost}
            />
        </div>
    );
}

// Mock data generator
function generateMockPosts(): Post[] {
    return [
        {
            id: '1',
            type: 'OPPORTUNITY',
            title: 'Looking for a Co-Founder!',
            content: 'We\'re building an AI-powered platform for sustainable agriculture. Looking for a technical co-founder with experience in ML/AI. Equity-based compensation. Let\'s change the world together! 🌱',
            hashtags: ['AI', 'Startup', 'CoFounder', 'Agriculture'],
            user: {
                id: '1',
                name: 'Sarah Johnson',
                title: 'CEO @ GreenTech',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
            },
            likesCount: 45,
            commentsCount: 12,
            sharesCount: 8,
            viewsCount: 234,
            isLiked: false,
            isSaved: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: '2',
            type: 'ACHIEVEMENT',
            title: 'We just raised our Seed Round! 🎉',
            content: 'Excited to announce that we\'ve successfully raised $2M in seed funding! Thank you to all our investors and supporters. This is just the beginning of our journey to revolutionize the fintech space.',
            hashtags: ['Funding', 'Startup', 'Fintech', 'Milestone'],
            media: [
                { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60' },
                { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=60' },
            ],
            user: {
                id: '2',
                name: 'Michael Chen',
                title: 'Founder @ PayFlow',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c0aede',
            },
            likesCount: 189,
            commentsCount: 34,
            sharesCount: 23,
            viewsCount: 1245,
            isLiked: true,
            isSaved: false,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: '3',
            type: 'INSIGHT',
            title: 'The Future of Remote Work',
            content: 'After building 3 remote-first startups, here are my top 5 lessons:\n\n1. Communication is everything\n2. Trust your team\n3. Async > Sync meetings\n4. Document everything\n5. Culture requires intentional effort\n\nWhat would you add to this list?',
            hashtags: ['RemoteWork', 'Startup', 'Culture', 'Leadership'],
            user: {
                id: '3',
                name: 'Emma Rodriguez',
                title: 'Serial Entrepreneur',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=ffdfbf',
            },
            likesCount: 234,
            commentsCount: 67,
            sharesCount: 45,
            viewsCount: 2134,
            isLiked: false,
            isSaved: true,
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: '4',
            type: 'UPDATE',
            title: 'Launched v2.0 Today! 🚀',
            content: 'It has been a long journey, but we finally shipped the new version of our analytics dashboard. Check it out and let us know what you think!',
            hashtags: ['ProductLaunch', 'SaaS', 'Analytics', 'ShipIt'],
            media: [
                { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60' }
            ],
            user: {
                id: '4',
                name: 'David Kim',
                title: 'Product Manager @ DataWiz',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1d4f9',
            },
            likesCount: 89,
            commentsCount: 15,
            sharesCount: 12,
            viewsCount: 890,
            isLiked: false,
            isSaved: false,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: '5',
            type: 'QUESTION',
            title: 'Best tech stack for 2024?',
            content: 'I am starting a new project and debating between Next.js and Remix. What are your thoughts? Performance and DX are my top priorities.',
            hashtags: ['WebDev', 'Nextjs', 'Remix', 'TechStack'],
            user: {
                id: '5',
                name: 'Alex Foster',
                title: 'Senior Frontend Dev',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffd5dc',
            },
            likesCount: 56,
            commentsCount: 42,
            sharesCount: 5,
            viewsCount: 450,
            isLiked: false,
            isSaved: false,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        }
    ];
}
