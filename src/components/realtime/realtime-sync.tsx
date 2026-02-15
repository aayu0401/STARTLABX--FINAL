'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/use-app-store';
import realtimeService from '@/services/realtime.service';

/**
 * Headless component to synchronize Socket.IO events with local Zustand store
 */
export function RealtimeSync() {
    const { setActiveUsers, setProcessing, incrementUnreadCount } = useAppStore();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Presence syncing
        const unsubscribeOnline = realtimeService.on('user_online', (data) => {
            // This is simplified; usually you'd maintain a set
            // For now, let's just log or bridge if needed
        });

        // Activity syncing
        const unsubscribeStart = realtimeService.on('processing_start', () => setProcessing(true));
        const unsubscribeEnd = realtimeService.on('processing_end', () => setProcessing(false));

        // Message notifications
        const unsubscribeNotify = realtimeService.on('new_notification', () => {
            incrementUnreadCount();
        });

        return () => {
            unsubscribeStart();
            unsubscribeEnd();
            unsubscribeNotify();
            unsubscribeOnline();
        };
    }, [setActiveUsers, setProcessing, incrementUnreadCount]);

    return null;
}
