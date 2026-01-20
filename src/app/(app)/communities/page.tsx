'use client';

import React, { useState } from 'react';
import { Plus, Search, Users, TrendingUp, Lock, Globe, Crown, Star, MessageCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/input';
import { cn, formatNumber } from '@/lib/utils';
import { communityService, type Community } from '@/services/community.service';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Globe },
    { id: 'tech', label: 'Technology', icon: Star },
    { id: 'design', label: 'Design', icon: Star },
    { id: 'business', label: 'Business', icon: Star },
    { id: 'marketing', label: 'Marketing', icon: Star },
];

export default function CommunitiesPage() {
    const [communities, setCommunities] = useState<Community[]>(generateMockCommunities());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'discover' | 'my-communities' | 'trending'>('discover');

    const filteredCommunities = communities.filter(community => {
        const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
        const matchesTab = activeTab === 'discover' ||
            (activeTab === 'my-communities' && community.isMember) ||
            (activeTab === 'trending' && community.trending);

        return matchesSearch && matchesCategory && matchesTab;
    });

    const handleJoinCommunity = async (communityId: string) => {
        try {
            await communityService.join(communityId);
            setCommunities(communities.map(c =>
                c.id === communityId ? { ...c, isMember: true, membersCount: c.membersCount + 1 } : c
            ));
        } catch (error) {
            console.error('Failed to join community:', error);
        }
    };

    const handleLeaveCommunity = async (communityId: string) => {
        try {
            await communityService.leave(communityId);
            setCommunities(communities.map(c =>
                c.id === communityId ? { ...c, isMember: false, membersCount: c.membersCount - 1 } : c
            ));
        } catch (error) {
            console.error('Failed to leave community:', error);
        }
    };

    const handleCreateCommunity = async (data: any) => {
        try {
            await communityService.create(data);
            setIsCreateModalOpen(false);
            // Reload communities
        } catch (error) {
            console.error('Failed to create community:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gradient-primary">Communities</h1>
                        <p className="text-muted-foreground mt-1">
                            Connect with like-minded professionals and grow together
                        </p>
                    </div>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="gradient" size="lg" className="gap-2 shadow-lg hover-lift">
                                <Plus className="h-5 w-5" />
                                Create Community
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create a New Community</DialogTitle>
                                <DialogDescription>
                                    Build a space for people to connect and collaborate
                                </DialogDescription>
                            </DialogHeader>
                            <CreateCommunityForm onSubmit={handleCreateCommunity} />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Filters */}
                <Card glass className="mb-6">
                    <CardContent className="p-6 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search communities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-lg"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategory === category.id ? 'gradient' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category.id)}
                                        className="gap-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {category.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="discover" className="gap-2">
                            <Globe className="h-4 w-4" />
                            Discover
                        </TabsTrigger>
                        <TabsTrigger value="my-communities" className="gap-2">
                            <Users className="h-4 w-4" />
                            My Communities
                        </TabsTrigger>
                        <TabsTrigger value="trending" className="gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Trending
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Communities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommunities.length === 0 ? (
                        <div className="col-span-full">
                            <Card className="text-center p-12">
                                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">No communities found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search or filters
                                </p>
                            </Card>
                        </div>
                    ) : (
                        filteredCommunities.map((community) => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                                onJoin={handleJoinCommunity}
                                onLeave={handleLeaveCommunity}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

interface CommunityCardProps {
    community: Community;
    onJoin: (id: string) => void;
    onLeave: (id: string) => void;
}

function CommunityCard({ community, onJoin, onLeave }: CommunityCardProps) {
    return (
        <Card hover glass className="overflow-hidden group fade-in">
            {/* Cover Image */}
            <div className="relative h-32 bg-gradient-to-r from-primary/20 to-accent/20 overflow-hidden">
                {community.coverImage ? (
                    <img
                        src={community.coverImage}
                        alt={community.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Users className="h-12 w-12 text-primary/40" />
                    </div>
                )}
                {community.trending && (
                    <Badge variant="gradient" className="absolute top-3 right-3 gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                    </Badge>
                )}
                {community.privacy === 'PRIVATE' && (
                    <Badge variant="outline" className="absolute top-3 left-3 gap-1 bg-background/80 backdrop-blur-sm">
                        <Lock className="h-3 w-3" />
                        Private
                    </Badge>
                )}
            </div>

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate group-hover:text-primary transition-colors cursor-pointer">
                            {community.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                            {community.description}
                        </CardDescription>
                    </div>
                    {community.isOwner && (
                        <Crown className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-primary">{formatNumber(community.membersCount)}</p>
                        <p className="text-xs text-muted-foreground">Members</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-accent">{formatNumber(community.postsCount)}</p>
                        <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">{community.activityLevel}</p>
                        <p className="text-xs text-muted-foreground">Activity</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {community.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {community.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{community.tags.length - 3}
                        </Badge>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    <span>Last post {community.lastActivityAt}</span>
                </div>
            </CardContent>

            <CardFooter className="pt-4 border-t">
                {community.isMember ? (
                    <div className="w-full flex gap-2">
                        <Button variant="gradient" className="flex-1">
                            View Community
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onLeave(community.id)}
                        >
                            Leave
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="gradient"
                        className="w-full"
                        onClick={() => onJoin(community.id)}
                    >
                        Join Community
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

function CreateCommunityForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'tech',
        privacy: 'PUBLIC',
        tags: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Community Name</label>
                <Input
                    placeholder="e.g., AI Enthusiasts"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                    placeholder="What is your community about?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="tech">Technology</option>
                        <option value="design">Design</option>
                        <option value="business">Business</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">Privacy</label>
                    <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        value={formData.privacy}
                        onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                    >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                <Input
                    placeholder="e.g., AI, Machine Learning, Innovation"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
            </div>

            <DialogFooter>
                <Button type="submit" variant="gradient" size="lg" className="w-full">
                    Create Community
                </Button>
            </DialogFooter>
        </form>
    );
}

// Mock data generator
function generateMockCommunities(): Community[] {
    return [
        {
            id: '1',
            name: 'AI & Machine Learning',
            description: 'A community for AI enthusiasts, researchers, and practitioners to share knowledge and collaborate on cutting-edge projects.',
            category: 'tech',
            privacy: 'PUBLIC',
            coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
            membersCount: 12543,
            postsCount: 3421,
            activityLevel: 'High',
            tags: ['AI', 'ML', 'Deep Learning', 'Neural Networks'],
            isMember: true,
            isOwner: false,
            trending: true,
            lastActivityAt: '2 hours ago',
        },
        {
            id: '2',
            name: 'Startup Founders',
            description: 'Connect with fellow entrepreneurs, share experiences, and get advice on building successful startups.',
            category: 'business',
            privacy: 'PUBLIC',
            coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
            membersCount: 8932,
            postsCount: 2156,
            activityLevel: 'High',
            tags: ['Startup', 'Entrepreneurship', 'Funding', 'Growth'],
            isMember: false,
            isOwner: false,
            trending: true,
            lastActivityAt: '1 hour ago',
        },
        {
            id: '3',
            name: 'UI/UX Designers',
            description: 'A creative space for designers to showcase work, get feedback, and discuss the latest design trends.',
            category: 'design',
            privacy: 'PUBLIC',
            coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
            membersCount: 15234,
            postsCount: 5678,
            activityLevel: 'Medium',
            tags: ['Design', 'UI', 'UX', 'Figma', 'Adobe'],
            isMember: true,
            isOwner: false,
            trending: false,
            lastActivityAt: '3 hours ago',
        },
        {
            id: '4',
            name: 'Growth Marketing',
            description: 'Learn and share growth hacking strategies, marketing tactics, and customer acquisition techniques.',
            category: 'marketing',
            privacy: 'PRIVATE',
            coverImage: '',
            membersCount: 6543,
            postsCount: 1234,
            activityLevel: 'Medium',
            tags: ['Marketing', 'Growth', 'SEO', 'Analytics'],
            isMember: false,
            isOwner: false,
            trending: false,
            lastActivityAt: '5 hours ago',
        },
        {
            id: '5',
            name: 'Web3 & Blockchain',
            description: 'Explore the future of decentralized technology, cryptocurrencies, and blockchain applications.',
            category: 'tech',
            privacy: 'PUBLIC',
            coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
            membersCount: 9876,
            postsCount: 2345,
            activityLevel: 'High',
            tags: ['Web3', 'Blockchain', 'Crypto', 'DeFi'],
            isMember: true,
            isOwner: true,
            trending: true,
            lastActivityAt: '30 minutes ago',
        },
        {
            id: '6',
            name: 'Remote Work Hub',
            description: 'Tips, tools, and community for remote workers and distributed teams around the world.',
            category: 'business',
            privacy: 'PUBLIC',
            coverImage: '',
            membersCount: 11234,
            postsCount: 4567,
            activityLevel: 'Medium',
            tags: ['Remote', 'Work', 'Productivity', 'Tools'],
            isMember: false,
            isOwner: false,
            trending: false,
            lastActivityAt: '4 hours ago',
        },
    ];
}
