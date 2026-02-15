import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const memberships = await prisma.communityMember.findMany({
            where: { userId: user.id },
            include: {
                community: {
                    include: {
                        _count: {
                            select: { members: true }
                        }
                    }
                }
            }
        });

        const communities = memberships.map(m => ({
            id: m.community.id,
            name: m.community.name,
            description: m.community.description,
            role: m.role,
            members: m.community._count.members,
            image: m.community.image,
            category: m.community.category
        }));

        return NextResponse.json(communities);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
