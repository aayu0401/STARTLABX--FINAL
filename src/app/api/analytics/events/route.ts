import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        const body = await request.json();
        const { event, properties, timestamp } = body;

        await prisma.analyticsEvent.create({
            data: {
                event: event || 'unknown',
                userId: user?.id || null,
                properties: properties ? JSON.stringify(properties) : null,
                timestamp: timestamp ? new Date(timestamp) : new Date()
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        // Silently fail analytics if database is busy, or log it
        console.error('Analytics tracking error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
