'use client';

import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, X, ExternalLink } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import aiCopilotService, { Suggestion } from '@/services/ai-copilot.service';
import { cn } from '@/lib/utils';

const iconMap = {
    action: CheckCircle,
    insight: Lightbulb,
    recommendation: TrendingUp,
    warning: AlertTriangle
};

const priorityColors = {
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
};

interface SuggestionCardProps {
    suggestion: Suggestion;
    onDismiss?: (id: string) => void;
    onComplete?: (id: string) => void;
}

export function SuggestionCard({ suggestion, onDismiss, onComplete }: SuggestionCardProps) {
    const Icon = iconMap[suggestion.type];

    const handleDismiss = async () => {
        try {
            await aiCopilotService.updateSuggestion(suggestion.id, 'dismissed');
            onDismiss?.(suggestion.id);
        } catch (error) {
            console.error('Failed to dismiss suggestion:', error);
        }
    };

    const handleComplete = async () => {
        try {
            await aiCopilotService.updateSuggestion(suggestion.id, 'completed');
            onComplete?.(suggestion.id);
        } catch (error) {
            console.error('Failed to complete suggestion:', error);
        }
    };

    return (
        <Card className="p-4 hover-lift">
            <div className="flex items-start gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    priorityColors[suggestion.priority]
                )}>
                    <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            {suggestion.title}
                        </h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDismiss}
                            className="flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {suggestion.description}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="glass" className="text-xs">
                            {suggestion.category}
                        </Badge>
                        <Badge
                            variant="glass"
                            className={cn("text-xs", priorityColors[suggestion.priority])}
                        >
                            {suggestion.priority} priority
                        </Badge>
                    </div>

                    {suggestion.actionUrl && (
                        <div className="mt-3 flex gap-2">
                            <Button
                                variant="gradient"
                                size="sm"
                                onClick={() => {
                                    window.location.href = suggestion.actionUrl!;
                                    handleComplete();
                                }}
                            >
                                {suggestion.actionLabel || 'Take Action'}
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleComplete}
                            >
                                Mark Complete
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

export function SuggestionsList() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        try {
            const response = await aiCopilotService.getSuggestions({ status: 'pending' });
            setSuggestions(response.suggestions);
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDismiss = (id: string) => {
        setSuggestions(prev => prev.filter(s => s.id !== id));
    };

    const handleComplete = (id: string) => {
        setSuggestions(prev => prev.filter(s => s.id !== id));
    };

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="p-4 animate-pulse">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                    </Card>
                ))}
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <Card className="p-8 text-center">
                <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                    No suggestions at the moment. Keep up the great work!
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {suggestions.map(suggestion => (
                <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onDismiss={handleDismiss}
                    onComplete={handleComplete}
                />
            ))}
        </div>
    );
}
