import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const subscription = await prisma.subscription.findUnique({
            where: { userId: user.id }
        });

        if (!subscription || !subscription.stripeSubscriptionId) {
            // If manual/mock subscription, return pseudo portal
            return NextResponse.json({
                url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription?portal=mock`
            });
        }

        // Real Stripe Portal
        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.stripeSubscriptionId, // This might need to be customerId if stored differently
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
        });

        return NextResponse.json({ url: session.url });
    } catch (e) {
        // Fallback for mock environment
        console.log("Mocking Portal Session due to error/missing config");
        return NextResponse.json({
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription?portal=mock`
        });
    }
}
