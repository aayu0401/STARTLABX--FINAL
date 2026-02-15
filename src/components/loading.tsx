'use client';

import React from 'react';
import { Loader2, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    fullScreen?: boolean;
    variant?: 'spinner' | 'dots' | 'pulse' | 'brand';
    className?: string;
}

export function Loading({
    size = 'md',
    text,
    fullScreen = false,
    variant = 'spinner',
    className
}: LoadingProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
    };

    const content = (
        <div className={cn(
            "flex flex-col items-center justify-center gap-4",
            className
        )}>
            {variant === 'spinner' && (
                <Loader2 className={cn(
                    "animate-spin text-primary",
                    sizeClasses[size]
                )} />
            )}

            {variant === 'dots' && (
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "rounded-full bg-primary animate-bounce",
                                size === 'sm' && "h-2 w-2",
                                size === 'md' && "h-3 w-3",
                                size === 'lg' && "h-4 w-4",
                                size === 'xl' && "h-5 w-5"
                            )}
                            style={{
                                animationDelay: `${i * 0.1}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {variant === 'pulse' && (
                <div className={cn(
                    "rounded-full bg-gradient-premium animate-pulse",
                    sizeClasses[size]
                )} />
            )}

            {variant === 'brand' && (
                <div className="relative">
                    <div className={cn(
                        "absolute inset-0 rounded-full bg-gradient-premium opacity-20 animate-ping",
                        sizeClasses[size]
                    )} />
                    <div className={cn(
                        "relative rounded-full bg-gradient-premium flex items-center justify-center animate-pulse",
                        sizeClasses[size]
                    )}>
                        <Rocket className={cn(
                            "text-white",
                            size === 'sm' && "h-2 w-2",
                            size === 'md' && "h-4 w-4",
                            size === 'lg' && "h-6 w-6",
                            size === 'xl' && "h-8 w-8"
                        )} />
                    </div>
                </div>
            )}

            {text && (
                <p className={cn(
                    "text-muted-foreground font-medium animate-pulse",
                    textSizeClasses[size]
                )}>
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return content;
}

// Skeleton loader for content
export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={cn(
            "animate-pulse rounded-md bg-muted",
            className
        )} />
    );
}

// Card skeleton
export function CardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    );
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Page loading component
export function PageLoading({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loading size="lg" text={text} variant="brand" />
        </div>
    );
}
