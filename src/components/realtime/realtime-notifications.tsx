'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import realtimeService from '@/services/realtime.service';
import { useAuth } from '@/contexts/auth-context';
import { Bell, Briefcase, Zap } from 'lucide-react';
import React from 'react';

export function RealtimeNotifications() {
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (!realtimeService) return;

        // Listen for new opportunities
        const unsubscribeOpp = realtimeService.on('new_opportunity', (data) => {
            console.log('Realtime Opportunity Received:', data);
            toast({
                title: "🚀 New Opportunity!",
                description: `${data.role} at ${data.startup?.name || 'a new startup'} is now active.`,
            });
        });

        // Listen for general notifications
        const unsubscribeNotify = realtimeService.on('new_notification', (data) => {
            toast({
                title: data.title || "Message from Cortex",
                description: data.message,
            });
        });

        // Listen for presence
        const unsubscribeOnline = realtimeService.on('user_online', (data) => {
            // Only show if it's not the current user
            if (data.userId !== user?.id) {
                console.log(`User ${data.userId} is online`);
            }
        });

        // Subscribe to personal notification channel
        if (user?.id) {
            realtimeService.subscribeToNotifications(user.id);
        }

        return () => {
            unsubscribeOpp();
            unsubscribeNotify();
            unsubscribeOnline();
            if (user?.id) {
                realtimeService.unsubscribeFromNotifications(user.id);
            }
        };
    }, [toast, user?.id]);

    return null;
}
