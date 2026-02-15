import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);

        // Admin protection
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const [userCount, startupCount, postCount, communityCount] = await Promise.all([
            prisma.user.count(),
            prisma.startup.count(),
            prisma.post.count(),
            prisma.community.count()
        ]);

        return NextResponse.json({
            stats: {
                totalUsers: userCount,
                totalStartups: startupCount,
                totalPosts: postCount,
                totalCommunities: communityCount,
                growth: 12.5 // Mock for now
            },
            recentActivity: [] // Could add logic to fetch latest events
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
