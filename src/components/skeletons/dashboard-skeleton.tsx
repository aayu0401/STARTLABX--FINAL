import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 animate-shimmer" />
                    <Skeleton className="h-4 w-64 animate-shimmer" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-32 animate-shimmer" />
                    <Skeleton className="h-9 w-32 animate-shimmer" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="border-muted/40 bg-card/50 overflow-hidden">
                        <CardContent className="p-6 relative">
                            <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-20" />
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24 animate-shimmer" />
                                    <Skeleton className="h-8 w-16 animate-shimmer" />
                                </div>
                                <Skeleton className="h-10 w-10 rounded-xl animate-shimmer" />
                            </div>
                            <Skeleton className="h-4 w-32 mt-4 animate-shimmer" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Chart */}
                <Card className="lg:col-span-4 border-muted/40 bg-card/50 overflow-hidden">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2 animate-shimmer" />
                        <Skeleton className="h-4 w-48 animate-shimmer" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full rounded-xl animate-shimmer" />
                    </CardContent>
                </Card>

                {/* Feed */}
                <Card className="lg:col-span-3 border-muted/40 bg-card/50 overflow-hidden">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 animate-shimmer" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-9 w-9 rounded-full animate-shimmer" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-full animate-shimmer" />
                                    <Skeleton className="h-3 w-2/3 animate-shimmer" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
