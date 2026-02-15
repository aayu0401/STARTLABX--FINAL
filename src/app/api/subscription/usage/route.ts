import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PLANS } from '@/constants/plans';

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Get user's subscription
        const subscription = await prisma.subscription.findUnique({
            where: { userId: user.id }
        });

        const planId = subscription?.plan || 'free';
        const plan = PLANS.find(p => p.id === planId) || PLANS[0];

        // Calculate usage (MOCK for now, but logical)
        // In a real app, we would query the database for count of projects, assets, etc.
        const projectsCount = await prisma.startupProject.count({ where: { userId: user.id } });

        // Mocking other stats based on plan (simulating some usage)
        const usage = {
            aiCredits: Math.floor(Math.random() * (typeof plan.limits.aiCredits === 'number' ? plan.limits.aiCredits : 100)),
            pitchDecks: projectsCount, // 1 project = 1 pitch deck roughly
            mvpPlans: projectsCount,
            contracts: 0,
            teamMembers: 1,
            storage: projectsCount * 5 // 5MB per project
        };

        return NextResponse.json(usage);
    } catch (e) {
        console.error('Usage fetch error:', e);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
