'use client';

import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, MapPin, DollarSign, Star, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdvancedSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'all' | 'startups' | 'professionals' | 'projects'>('all');
    const [filters, setFilters] = useState({
        location: '',
        industry: '',
        skills: [] as string[],
        availability: '',
        equity: false,
        remote: false
    });

    const recentSearches = [
        'Full-stack developer with React',
        'FinTech startups in SF',
        'AI/ML engineers',
        'Co-founder with sales experience'
    ];

    const popularSearches = [
        { query: 'Remote developers', count: 1234 },
        { query: 'Early-stage startups', count: 892 },
        { query: 'Equity opportunities', count: 756 },
        { query: 'Technical co-founders', count: 645 }
    ];

    const industries = ['FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'SaaS', 'Web3', 'CleanTech'];
    const skills = ['React', 'Node.js', 'Python', 'Design', 'Marketing', 'Sales', 'Product', 'Data Science'];

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Advanced Search
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Find exactly what you're looking for with powerful filters
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filters
                        </h3>

                        <div className="space-y-4">
                            {/* Search Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Search In</label>
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value as any)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                                >
                                    <option value="all">All</option>
                                    <option value="startups">Startups</option>
                                    <option value="professionals">Professionals</option>
                                    <option value="projects">Projects</option>
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Location
                                </label>
                                <Input
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    placeholder="City or country"
                                />
                            </div>

                            {/* Industry */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Industry</label>
                                <div className="flex flex-wrap gap-2">
                                    {industries.map((industry) => (
                                        <Badge
                                            key={industry}
                                            variant={filters.industry === industry ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                            onClick={() => setFilters({ ...filters, industry: filters.industry === industry ? '' : industry })}
                                        >
                                            {industry}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Skills</label>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant={filters.skills.includes(skill) ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                            onClick={() => setFilters({
                                                ...filters,
                                                skills: filters.skills.includes(skill)
                                                    ? filters.skills.filter(s => s !== skill)
                                                    : [...filters.skills, skill]
                                            })}
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Filters */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Quick Filters</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.remote}
                                            onChange={(e) => setFilters({ ...filters, remote: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Remote only</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.equity}
                                            onChange={(e) => setFilters({ ...filters, equity: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Equity opportunities</span>
                                    </label>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" onClick={() => setFilters({
                                location: '',
                                industry: '',
                                skills: [],
                                availability: '',
                                equity: false,
                                remote: false
                            })}>
                                Clear All Filters
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {/* Search Bar */}
                    <Card className="p-4 mb-6">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for startups, professionals, or skills..."
                                    className="pl-10"
                                />
                            </div>
                            <Button className="gradient-primary">
                                Search
                            </Button>
                        </div>
                    </Card>

                    {/* Recent Searches */}
                    {!searchQuery && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Recent Searches
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((search, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSearchQuery(search)}
                                        >
                                            {search}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Popular Searches
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {popularSearches.map((item, index) => (
                                        <Card
                                            key={index}
                                            className="p-4 hover-lift cursor-pointer"
                                            onClick={() => setSearchQuery(item.query)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{item.query}</span>
                                                <Badge variant="glass">{item.count.toLocaleString()}</Badge>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <h3 className="font-semibold mb-3">Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Card className="p-4 hover-lift cursor-pointer">
                                        <Briefcase className="w-8 h-8 mb-2 text-primary" />
                                        <h4 className="font-medium mb-1">Browse Startups</h4>
                                        <p className="text-sm text-gray-600">Explore opportunities</p>
                                    </Card>

                                    <Card className="p-4 hover-lift cursor-pointer">
                                        <Star className="w-8 h-8 mb-2 text-accent" />
                                        <h4 className="font-medium mb-1">Top Professionals</h4>
                                        <p className="text-sm text-gray-600">Hire top talent</p>
                                    </Card>

                                    <Card className="p-4 hover-lift cursor-pointer">
                                        <DollarSign className="w-8 h-8 mb-2 text-green-500" />
                                        <h4 className="font-medium mb-1">Equity Deals</h4>
                                        <p className="text-sm text-gray-600">Find equity opportunities</p>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Results would go here */}
                    {searchQuery && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">
                                    Search Results for "{searchQuery}"
                                </h3>
                                <span className="text-sm text-gray-600">1,234 results</span>
                            </div>
                            {/* Results grid would be populated here */}
                            <p className="text-gray-600 text-center py-12">
                                Search results will appear here
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
