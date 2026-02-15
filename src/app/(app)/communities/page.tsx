'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { Users2, Search, Plus, Trophy, Zap, Code, Palette, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CreateCommunityModal } from './components/create-community-modal';

export default function CommunitiesPage() {
    const [communities, setCommunities] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { toast } = useToast();

    const fetchCommunities = async () => {
        try {
            setLoading(true);
            const query = activeTab !== 'all' ? `?category=${activeTab}` : '';
            const response = await fetch(`/api/communities${query}`);
            const data = await response.json();
            setCommunities(data.communities || []);
        } catch (error) {
            console.error('Failed to fetch communities', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunities();
    }, [activeTab]);

    const handleJoin = async (id: string) => {
        try {
            const response = await fetch(`/api/communities/${id}/join`, { method: 'POST' });
            const data = await response.json();

            if (response.ok) {
                toast({
                    title: data.joined ? "Joined!" : "Left",
                    description: data.joined ? "You are now a member." : "You have left the community.",
                });

                // Refresh list
                const res = await fetch('/api/communities');
                const updateData = await res.json();
                setCommunities(updateData.communities);
            } else {
                toast({
                    title: "Error",
                    description: data.error || "Failed to join",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
        }
    };

    const getIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'technology': return <Code className="h-4 w-4 text-white" />;
            case 'design': return <Palette className="h-4 w-4 text-white" />;
            case 'business': return <Rocket className="h-4 w-4 text-white" />;
            default: return <Users2 className="h-4 w-4 text-white" />;
        }
    };

    const filteredCommunities = communities.filter(community => {
        const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-left duration-700">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-gradient-primary">Universal Communities</h1>
                        <p className="text-muted-foreground mt-1 font-medium italic">
                            Find your tribe, collaborations, and neural growth opportunities.
                        </p>
                    </div>
                    <Button
                        variant="gradient"
                        className="gap-2 shadow-lg hover-lift py-6 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Initialize Node
                    </Button>
                </div>

                <CreateCommunityModal
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                    onSuccess={fetchCommunities}
                />

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search communities..."
                            className="pl-10 h-11 bg-background/50 backdrop-blur border-border/50 focus:border-primary/50 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4 md:flex md:w-auto">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="technology">Tech</TabsTrigger>
                            <TabsTrigger value="design">Design</TabsTrigger>
                            <TabsTrigger value="business">Business</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Communities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommunities.map((community) => (
                        <Card key={community.id} hover glass className="group overflow-hidden flex flex-col h-full border-muted/40">

                            {/* Cover Gradient */}
                            <div className={`h-24 w-full ${community.image} relative`}>
                                <div className="absolute -bottom-6 left-6 p-2 bg-background rounded-xl shadow-lg ring-4 ring-background">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${community.image}`}>
                                        {getIcon(community.category)}
                                    </div>
                                </div>
                            </div>

                            <CardHeader className="pt-10 pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                            {community.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                {community.category}
                                            </span>
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 py-4">
                                <p className="text-sm text-foreground/80 line-clamp-2 mb-4">
                                    {community.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {community.tags?.map((tag: any) => (
                                        <Badge key={tag} variant="secondary" className="text-xs bg-muted/50 hover:bg-muted">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="pt-2 border-t bg-muted/20 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Users2 className="h-3 w-3" />
                                        <span>{community.members?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span>{community.active} online</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:text-primary"
                                    onClick={() => handleJoin(community.id)}
                                >
                                    Join
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {filteredCommunities.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Users2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No communities found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
