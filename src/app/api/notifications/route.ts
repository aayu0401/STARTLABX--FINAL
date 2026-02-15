import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// GET: Fetch notifications
export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const limit = parseInt(searchParams.get('limit') || '50');

        const whereClause: any = { userId: user.id };
        if (unreadOnly) {
            whereClause.isRead = false;
        }

        const notifications = await prisma.notification.findMany({
            where: whereClause,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        const unreadCount = await prisma.notification.count({
            where: { userId: user.id, isRead: false }
        });

        return NextResponse.json({
            notifications,
            unreadCount
        });

    } catch (error) {
        console.error('Fetch notifications error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST: Mark all as read OR Delete all (if query param action=delete_all)
// Although standard REST usually separates these, grouping for simplicity
