'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, Star, Verified, Send, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import resourceMarketplaceService, { Resource, ResourceFilter } from '@/services/resource-marketplace.service';
import { cn } from '@/lib/utils';

export function ResourceMarketplace() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [showHireModal, setShowHireModal] = useState(false);
    const [filters, setFilters] = useState<ResourceFilter>({});

    useEffect(() => {
        loadResources();
    }, [filters]);

    const loadResources = async () => {
        setIsLoading(true);
        try {
            const response = await resourceMarketplaceService.searchResources(filters);
            setResources(response.resources);
        } catch (error) {
            console.error('Failed to load resources:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHire = (resource: Resource) => {
        setSelectedResource(resource);
        setShowHireModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Search & Filters */}
            <Card className="p-6">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by skills, role, or name..."
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={filters.availability?.includes('immediate') ? 'gradient' : 'outline'}
                        size="sm"
                        onClick={() => setFilters({
                            ...filters,
                            availability: filters.availability?.includes('immediate') ? [] : ['immediate']
                        })}
                    >
                        <Clock className="w-3 h-3 mr-1" />
                        Available Now
                    </Button>

                    <Button
                        variant={filters.equityOnly ? 'gradient' : 'outline'}
                        size="sm"
                        onClick={() => setFilters({ ...filters, equityOnly: !filters.equityOnly })}
                    >
                        Equity Interest
                    </Button>

                    <Button
                        variant={filters.remote ? 'gradient' : 'outline'}
                        size="sm"
                        onClick={() => setFilters({ ...filters, remote: !filters.remote })}
                    >
                        Remote Only
                    </Button>

                    <Button
                        variant={filters.verified ? 'gradient' : 'outline'}
                        size="sm"
                        onClick={() => setFilters({ ...filters, verified: !filters.verified })}
                    >
                        <Verified className="w-3 h-3 mr-1" />
                        Verified
                    </Button>
                </div>
            </Card>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        </Card>
                    ))
                ) : resources.length === 0 ? (
                    <Card className="col-span-full p-12 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            No resources found. Try adjusting your filters.
                        </p>
                    </Card>
                ) : (
                    resources.map((resource) => (
                        <Card key={resource.id} className="p-6 hover-lift">
                            <div className="flex items-start gap-4 mb-4">
                                <Avatar className="w-16 h-16">
                                    {resource.avatar ? (
                                        <img src={resource.avatar} alt={resource.name} />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                                            {resource.name.charAt(0)}
                                        </div>
                                    )}
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold truncate">{resource.name}</h4>
                                        {resource.verified && (
                                            <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {resource.title}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-medium">{resource.rating.toFixed(1)}</span>
                                        <span className="text-xs text-gray-500">({resource.reviewCount})</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                                {resource.bio}
                            </p>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1 mb-4">
                                {resource.skills.slice(0, 3).map((skill, index) => (
                                    <Badge key={index} variant="glass" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                                {resource.skills.length > 3 && (
                                    <Badge variant="glass" className="text-xs">
                                        +{resource.skills.length - 3}
                                    </Badge>
                                )}
                            </div>

                            {/* Availability & Rate */}
                            <div className="flex items-center justify-between mb-4 text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="capitalize">{resource.availability.replace('_', ' ')}</span>
                                </div>

                                {resource.hourlyRate && (
                                    <div className="flex items-center gap-1 font-semibold text-primary">
                                        <DollarSign className="w-4 h-4" />
                                        <span>${resource.hourlyRate}/hr</span>
                                    </div>
                                )}
                            </div>

                            {/* Location & Equity */}
                            <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {resource.location}
                                </div>
                                {resource.equityInterest && (
                                    <Badge variant="glass" className="text-xs">
                                        Open to Equity
                                    </Badge>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="gradient"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleHire(resource)}
                                >
                                    <Send className="w-3 h-3 mr-1" />
                                    Hire
                                </Button>
                                <Button variant="outline" size="sm">
                                    View Profile
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Hire Modal */}
            {showHireModal && selectedResource && (
                <HireModal
                    resource={selectedResource}
                    onClose={() => {
                        setShowHireModal(false);
                        setSelectedResource(null);
                    }}
                />
            )}
        </div>
    );
}

function HireModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
    const [hiretype, setHireType] = useState<'hourly' | 'equity' | 'salary' | 'hybrid'>('hourly');
    const [formData, setFormData] = useState({
        role: '',
        description: '',
        hourlyRate: resource.hourlyRate || 0,
        equityPercentage: 0,
        salary: 0,
        duration: '',
        message: ''
    });

    const handleSubmit = async () => {
        try {
            await resourceMarketplaceService.sendHiringRequest({
                startupId: 'current-startup-id', // TODO: Get from context
                resourceId: resource.id,
                type: hiretype,
                role: formData.role,
                description: formData.description,
                compensation: {
                    hourlyRate: hiretype === 'hourly' || hiretype === 'hybrid' ? formData.hourlyRate : undefined,
                    equityPercentage: hiretype === 'equity' || hiretype === 'hybrid' ? formData.equityPercentage : undefined,
                    salary: hiretype === 'salary' || hiretype === 'hybrid' ? formData.salary : undefined,
                    currency: 'USD'
                },
                duration: formData.duration,
                proposalMessage: formData.message
            });

            onClose();
        } catch (error) {
            console.error('Failed to send hiring request:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h3 className="text-xl font-bold mb-4">Send Hiring Proposal to {resource.name}</h3>

                <div className="space-y-4">
                    {/* Hire Type */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Compensation Type</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['hourly', 'equity', 'salary', 'hybrid'].map((type) => (
                                <Button
                                    key={type}
                                    variant={hiretype === type ? 'gradient' : 'outline'}
                                    size="sm"
                                    onClick={() => setHireType(type as any)}
                                    className="capitalize"
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Role/Position *</label>
                        <Input
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            placeholder="e.g., Senior Full-Stack Developer"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Job Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the role, responsibilities, and requirements..."
                            className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                        />
                    </div>

                    {/* Compensation Details */}
                    {(hiretype === 'hourly' || hiretype === 'hybrid') && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Hourly Rate (USD)</label>
                            <Input
                                type="number"
                                value={formData.hourlyRate}
                                onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) })}
                            />
                        </div>
                    )}

                    {(hiretype === 'equity' || hiretype === 'hybrid') && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Equity Percentage (%)</label>
                            <Input
                                type="number"
                                step="0.1"
                                value={formData.equityPercentage}
                                onChange={(e) => setFormData({ ...formData, equityPercentage: parseFloat(e.target.value) })}
                            />
                        </div>
                    )}

                    {(hiretype === 'salary' || hiretype === 'hybrid') && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Annual Salary (USD)</label>
                            <Input
                                type="number"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) })}
                            />
                        </div>
                    )}

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Duration (Optional)</label>
                        <Input
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            placeholder="e.g., 3 months, 1 year, Ongoing"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Personal Message *</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Introduce yourself and explain why you'd like to work with them..."
                            className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={!formData.role || !formData.description || !formData.message}
                            className="flex-1 gradient-primary"
                        >
                            Send Proposal
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
