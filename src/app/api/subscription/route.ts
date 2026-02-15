import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const subscription = await prisma.subscription.findUnique({
            where: { userId: user.id }
        });

        if (!subscription) {
            // Return a default free subscription
            return NextResponse.json({
                plan: 'free',
                status: 'active',
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                cancelAtPeriodEnd: false
            });
        }

        return NextResponse.json(subscription);
    } catch (e) {
        console.error('Subscription fetch error:', e);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
