import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        const body = await request.json();
        const { element, properties, timestamp } = body;

        await prisma.analyticsEvent.create({
            data: {
                event: 'click',
                userId: user?.id || null,
                properties: JSON.stringify({ element, ...properties }),
                timestamp: timestamp ? new Date(timestamp) : new Date()
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false });
    }
}
