import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Verify ownership
        const notification = await prisma.notification.findUnique({
            where: { id: id }
        });

        if (!notification || notification.userId !== user.id) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }

        const updated = await prisma.notification.update({
            where: { id: id },
            data: { isRead: true }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
