'use client';

import React from 'react';
import { Wifi, WifiOff, RefreshCw, Zap } from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';
import realtimeService from '@/services/realtime.service';
import { cn } from '@/lib/utils';

interface RealtimeStatusProps {
    className?: string;
    showText?: boolean;
    position?: 'fixed' | 'relative';
}

export function RealtimeStatus({
    className,
    showText = true,
    position = 'fixed'
}: RealtimeStatusProps) {
    const { isConnected, reconnecting } = useRealtime();
    const [isProcessing, setIsProcessing] = React.useState(false);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const unsubscribeStart = realtimeService.on('processing_start', () => setIsProcessing(true));
        const unsubscribeEnd = realtimeService.on('processing_end', () => setIsProcessing(false));

        return () => {
            unsubscribeStart();
            unsubscribeEnd();
        };
    }, []);

    if (position === 'fixed') {
        return (
            <div className={cn(
                "fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass border transition-all duration-300",
                isProcessing ? "border-primary/50 bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.2)]" :
                    isConnected ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10",
                className
            )}>
                {reconnecting ? (
                    <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
                ) : isProcessing ? (
                    <Zap className="h-4 w-4 text-primary animate-pulse" />
                ) : isConnected ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                )}

                {showText && (
                    <span className={cn(
                        "text-sm font-medium",
                        reconnecting ? "text-yellow-500" :
                            isProcessing ? "text-primary" :
                                isConnected ? "text-green-500" : "text-red-500"
                    )}>
                        {reconnecting ? 'Reconnecting...' :
                            isProcessing ? 'AI Thinking...' :
                                isConnected ? 'Live' : 'Offline'}
                    </span>
                )}

                {isConnected && !isProcessing && (
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                )}
            </div>
        );
    }

    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border text-sm",
            isConnected ? "border-green-500/30" : "border-red-500/30",
            className
        )}>
            {reconnecting ? (
                <RefreshCw className="h-3 w-3 text-yellow-500 animate-spin" />
            ) : isConnected ? (
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            ) : (
                <div className="h-2 w-2 rounded-full bg-red-500" />
            )}

            {showText && (
                <span className={cn(
                    "font-medium",
                    reconnecting ? "text-yellow-500" : isConnected ? "text-green-500" : "text-red-500"
                )}>
                    {reconnecting ? 'Reconnecting' : isConnected ? 'Live' : 'Offline'}
                </span>
            )}
        </div>
    );
}

// Compact version for headers/navbars
export function RealtimeStatusBadge({ className }: { className?: string }) {
    const { isConnected } = useRealtime();

    return (
        <div className={cn(
            "flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium",
            isConnected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500",
            className
        )}>
            <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            )} />
            <span>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
        </div>
    );
}

// Notification badge for new updates
export function RealtimeUpdateBadge({
    count,
    onClick,
    className
}: {
    count: number;
    onClick?: () => void;
    className?: string;
}) {
    if (count === 0) return null;

    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 py-1 rounded-full bg-gradient-premium text-white text-xs font-bold",
                "hover:scale-110 transition-transform cursor-pointer animate-bounce-in",
                "shadow-lg shadow-primary/50",
                className
            )}
        >
            {count} new {count === 1 ? 'update' : 'updates'}
        </button>
    );
}
