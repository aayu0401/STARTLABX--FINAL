import { prisma } from './db';

export type NotificationType = 'mention' | 'like' | 'comment' | 'follow' | 'message' | 'system';

export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>
) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                metadata: metadata ? JSON.stringify(metadata) : null,
            }
        });

        // Trigger Socket.IO if available
        // In this architecture, we could emit via global IO instance
        // For now, it's just DB persistence
        return notification;
    } catch (error) {
        console.error('Notification creation failed:', error);
    }
}
