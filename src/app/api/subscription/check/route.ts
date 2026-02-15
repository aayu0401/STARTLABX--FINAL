import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PLANS } from '@/constants/plans';

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        const { searchParams } = new URL(request.url);
        const feature = searchParams.get('feature');

        if (!user) return NextResponse.json({ allowed: false });

        const subscription = await prisma.subscription.findUnique({
            where: { userId: user.id }
        });

        const planId = subscription?.plan || 'free';
        const plan = PLANS.find(p => p.id === planId) || PLANS[0];

        // LOGIC FOR FEATURE GATING
        if (feature === 'incubator') {
            // Founder Plan Required for full access
            if (plan.id === 'founder') return NextResponse.json({ allowed: true });

            // Check limits for other plans
            const projectCount = await prisma.startupProject.count({ where: { userId: user.id } });
            // Free: 1 project allowed
            if (plan.id === 'free' && projectCount >= 1) return NextResponse.json({ allowed: false, reason: 'limit_reached' });

            return NextResponse.json({ allowed: true });
        }

        if (feature === 'talent_match') {
            // Only Professional and Founder
            if (['professional', 'founder'].includes(plan.id)) return NextResponse.json({ allowed: true });
            return NextResponse.json({ allowed: false, reason: 'upgrade_required' });
        }

        return NextResponse.json({ allowed: true }); // Default allow
    } catch (e) {
        return NextResponse.json({ allowed: false });
    }
}
