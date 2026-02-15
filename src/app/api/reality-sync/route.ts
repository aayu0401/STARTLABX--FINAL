import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// POST: Trigger a Reality Sync Refresh
export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const project = await prisma.startupProject.findFirst({
            where: { userId: user.id },
            include: { realitySync: true }
        });

        if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

        // MOCK: Integration Workers
        // In production, these would be calls to GitHub/Stripe APIs using stored OAuth tokens.
        // For now, we simulate "Verified" data ingestion.

        const mockGithubData = {
            commits: Math.floor(Math.random() * 50) + 10, // 10-60 commits
            velocity: Math.floor(Math.random() * 5) + 1   // 1-6 PRs
        };

        const mockStripeData = {
            mrr: parseFloat((Math.random() * 1000 + 500).toFixed(2)), // $500 - $1500 MRR
            churn: 2.5
        };

        // Update or Create RealitySync Record
        const updatedSync = await prisma.realitySync.upsert({
            where: { projectId: project.id },
            create: {
                projectId: project.id,
                githubConnected: true,
                stripeConnected: true,
                codeCommits: mockGithubData.commits,
                codeVelocity: mockGithubData.velocity,
                mrr: mockStripeData.mrr,
                churnRate: mockStripeData.churn,
                lastSyncedAt: new Date()
            },
            update: {
                codeCommits: mockGithubData.commits,
                codeVelocity: mockGithubData.velocity,
                mrr: mockStripeData.mrr,
                churnRate: mockStripeData.churn,
                lastSyncedAt: new Date()
            }
        });

        // Update Traction Score based on Reality
        // Simple Algorithm: MRR * 0.1 + Commits * 0.5
        const newScore = Math.min(100, Math.floor((updatedSync.mrr * 0.05) + (updatedSync.codeCommits * 2)));

        await prisma.tractionMetrics.upsert({
            where: { projectId: project.id },
            create: {
                projectId: project.id,
                score: newScore,
                market: Math.floor(updatedSync.mrr / 10),
                development: updatedSync.codeCommits
            },
            update: {
                score: newScore,
                market: Math.floor(updatedSync.mrr / 10),
                development: updatedSync.codeCommits
            }
        });

        return NextResponse.json({ success: true, sync: updatedSync, newScore });

    } catch (error) {
        console.error("Reality Sync Failed:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
