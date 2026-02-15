'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X, TrendingUp, Clock, Bookmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchService, SearchResult } from '@/services/search.service';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'user' | 'startup' | 'post' | 'community'>('all');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [trendingSearches, setTrendingSearches] = useState<{ query: string; count: number }[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        loadRecentSearches();
        loadTrendingSearches();
    }, []);

    useEffect(() => {
        if (query.length > 2) {
            loadSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const loadRecentSearches = async () => {
        try {
            const response = await searchService.getRecentSearches(5);
            setRecentSearches(response.data);
        } catch (error) {
            console.error('Failed to load recent searches:', error);
        }
    };

    const loadTrendingSearches = async () => {
        try {
            const response = await searchService.getTrendingSearches(5);
            setTrendingSearches(response.data);
        } catch (error) {
            console.error('Failed to load trending searches:', error);
        }
    };

    const loadSuggestions = async () => {
        try {
            const response = await searchService.getSuggestions(query, 5);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        }
    };

    const handleSearch = async (searchQuery?: string) => {
        const q = searchQuery || query;
        if (!q.trim()) return;

        try {
            setLoading(true);
            const response = await searchService.search(q, {
                filters: filter !== 'all' ? { type: [filter] } : undefined,
            });
            setResults(response.data.results);
            setSuggestions([]);
            loadRecentSearches(); // Refresh recent searches
        } catch (error) {
            console.error('Search failed:', error);
            toast({
                title: 'Error',
                description: 'Search failed. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setQuery('');
        setResults([]);
        setSuggestions([]);
    };

    const getResultIcon = (type: string) => {
        const icons: Record<string, string> = {
            user: '👤',
            startup: '🚀',
            post: '📝',
            community: '👥',
        };
        return icons[type] || '📄';
    };

    const getResultLink = (result: SearchResult) => {
        const links: Record<string, string> = {
            user: `/users/${result.id}`,
            startup: `/startups/${result.id}`,
            post: `/feed?post=${result.id}`,
            community: `/communities/${result.id}`,
        };
        return links[result.type] || '#';
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* Search Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Search
                </h1>

                {/* Search Bar */}
                <div className="relative">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for people, startups, posts, communities..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="pl-12 pr-12 h-14 text-lg"
                        />
                        {query && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {suggestions.length > 0 && (
                        <Card className="absolute top-full mt-2 w-full z-10 p-2">
                            {suggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setQuery(suggestion);
                                        handleSearch(suggestion);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <SearchIcon className="w-4 h-4 text-gray-400" />
                                        <span>{suggestion}</span>
                                    </div>
                                </button>
                            ))}
                        </Card>
                    )}
                </div>

                {/* Filter Tabs */}
                <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mt-4">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="user">People</TabsTrigger>
                        <TabsTrigger value="startup">Startups</TabsTrigger>
                        <TabsTrigger value="post">Posts</TabsTrigger>
                        <TabsTrigger value="community">Communities</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Search Results */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : results.length > 0 ? (
                <div className="space-y-4">
                    {results.map((result) => (
                        <Link key={result.id} href={getResultLink(result)}>
                            <Card className="p-6 hover:shadow-lg transition-all hover-lift cursor-pointer">
                                <div className="flex items-start gap-4">
                                    {/* Icon/Image */}
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl flex-shrink-0">
                                        {result.image ? (
                                            <img
                                                src={result.image}
                                                alt={result.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            getResultIcon(result.type)
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                {result.title}
                                            </h3>
                                            <Badge variant="glass">{result.type}</Badge>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                            {result.description}
                                        </p>
                                        {result.metadata && (
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                {result.metadata.location && (
                                                    <span>📍 {result.metadata.location}</span>
                                                )}
                                                {result.metadata.members && (
                                                    <span>👥 {result.metadata.members} members</span>
                                                )}
                                                {result.metadata.followers && (
                                                    <span>👤 {result.metadata.followers} followers</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : query && !loading ? (
                <Card className="p-12 text-center">
                    <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Try adjusting your search or filters
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <h3 className="font-semibold">Recent Searches</h3>
                            </div>
                            <div className="space-y-2">
                                {recentSearches.map((search, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setQuery(search);
                                            handleSearch(search);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                    >
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Trending Searches */}
                    {trendingSearches.length > 0 && (
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-gray-500" />
                                <h3 className="font-semibold">Trending Searches</h3>
                            </div>
                            <div className="space-y-2">
                                {trendingSearches.map((search, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setQuery(search.query);
                                            handleSearch(search.query);
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex items-center justify-between"
                                    >
                                        <span>{search.query}</span>
                                        <Badge variant="glass">{search.count}</Badge>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
