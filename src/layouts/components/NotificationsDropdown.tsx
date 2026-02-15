"use client";

import React from 'react';
import { Bell, Check, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRealtimeNotifications } from '@/hooks/useRealtime';
import { useAuth } from '@/contexts/auth-context';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function NotificationsDropdown() {
    const { userProfile } = useAuth();
    // Assuming the hook might need a fix for initial fetch, but let's use it as is for now
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useRealtimeNotifications(userProfile?.id || null);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 sm:h-10 sm:w-10 transition-all hover:bg-primary/10">
                    <Bell className="h-5 w-5 sm:h-5 sm:w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-4 w-4 bg-primary text-[10px] text-white font-black flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in duration-300">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px] sm:w-[400px] p-0 shadow-2xl overflow-hidden border-none rounded-2xl animate-in fade-in slide-in-from-top-2 duration-400">
                <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-background p-5 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary">Live Activity</h3>
                            <Badge variant="glass" className="h-4 p-1 rounded-full"><div className="h-1 w-1 rounded-full bg-primary animate-pulse" /></Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="h-auto py-1 text-[10px] font-black uppercase tracking-widest transition-all hover:text-primary disabled:opacity-30"
                        >
                            Mark all read
                        </Button>
                    </div>
                </div>
                <div className="max-h-[450px] overflow-y-auto scrollbar-thin">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center bg-background/50 flex flex-col items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                                <Bell className="h-6 w-6 text-muted-foreground opacity-30" />
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">All quiet on the front</p>
                        </div>
                    ) : (
                        notifications.map((n, i) => (
                            <div
                                key={n.id || i}
                                className={cn(
                                    "p-5 border-b last:border-0 hover:bg-muted/50 transition-all flex gap-4 cursor-pointer relative group",
                                    !n.read && "bg-primary/5"
                                )}
                            >
                                <div className={cn(
                                    "h-1.5 w-1.5 rounded-full mt-2 shrink-0 transition-all",
                                    !n.isRead ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" : "bg-transparent"
                                )} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            {n.type || 'System'}
                                        </span>
                                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
                                            {formatDate(n.createdAt)}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-sm leading-relaxed",
                                        !n.isRead ? "font-bold text-foreground" : "text-muted-foreground font-medium"
                                    )}>
                                        {n.message || n.content || "New update available"}
                                    </p>

                                    {/* Action button visible on hover */}
                                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-6 px-2 text-[10px] font-black uppercase tracking-tighter"
                                            onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                                        >
                                            Dismiss
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {notifications.length > 0 && (
                    <div className="p-3 border-t bg-muted/20 text-center">
                        <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">
                            View All History
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
