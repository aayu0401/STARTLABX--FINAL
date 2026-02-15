'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'gradient' | 'dots';
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

export function LoadingSpinner({ size = 'md', variant = 'default', className }: LoadingSpinnerProps) {
    if (variant === 'dots') {
        return (
            <div className={cn('flex gap-2', className)}>
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            'rounded-full bg-primary animate-bounce',
                            size === 'sm' && 'w-2 h-2',
                            size === 'md' && 'w-3 h-3',
                            size === 'lg' && 'w-4 h-4',
                            size === 'xl' && 'w-5 h-5'
                        )}
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={cn('relative', sizeClasses[size], className)}>
            <div
                className={cn(
                    'absolute inset-0 rounded-full border-4 border-t-transparent animate-spin',
                    variant === 'gradient'
                        ? 'border-primary bg-gradient-to-r from-primary to-secondary'
                        : 'border-primary'
                )}
            />
        </div>
    );
}

interface LoadingScreenProps {
    message?: string;
    fullScreen?: boolean;
}

export function LoadingScreen({ message = 'Loading...', fullScreen = true }: LoadingScreenProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm',
                fullScreen ? 'fixed inset-0 z-50' : 'w-full h-full'
            )}
        >
            <div className="relative">
                {/* Outer ring */}
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 animate-spin border-t-primary" />

                {/* Inner glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 blur-xl animate-pulse" />
                </div>
            </div>

            <div className="text-center">
                <p className="text-lg font-semibold text-foreground animate-pulse">{message}</p>
            </div>
        </div>
    );
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
}

export function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
    const variantClasses = {
        default: 'h-4 w-full',
        card: 'h-48 w-full rounded-xl',
        text: 'h-4 w-3/4',
        avatar: 'h-12 w-12 rounded-full',
        button: 'h-10 w-32 rounded-lg',
    };

    return (
        <div
            className={cn(
                'animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]',
                variantClasses[variant],
                className
            )}
            {...props}
        />
    );
}
