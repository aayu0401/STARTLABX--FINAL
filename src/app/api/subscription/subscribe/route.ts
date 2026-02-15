import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { planId } = body;

        // Fallback for missing/mock STRIPE keys
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'mock_key') {
            console.log('🚧 Stripe not configured. Updating mock subscription.');

            // SIMULATE SUCCESSFUL SUBSCRIPTION UPDATE
            const { prisma } = await import('@/lib/db');
            await prisma.subscription.upsert({
                where: { userId: user.id },
                update: {
                    plan: planId,
                    status: 'active',
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
                    updatedAt: new Date()
                },
                create: {
                    userId: user.id,
                    plan: planId,
                    status: 'active',
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            });

            return NextResponse.json({
                url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?subscription=success&mock=true`
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: planId, // Plan ID must be a Stripe Price ID (e.g., price_123...)
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
            customer_email: user.email,
            metadata: {
                userId: user.id,
                planId: planId
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (e: any) {
        console.error('Stripe Checkout Error:', e);
        return NextResponse.json({ error: e.message || 'Failed to create checkout session' }, { status: 500 });
    }
}
