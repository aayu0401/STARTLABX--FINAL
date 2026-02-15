import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const where: any = {};
        if (category && category !== 'All') {
            where.category = category;
        }

        const communities = await prisma.community.findMany({
            where,
            include: {
                _count: {
                    select: { members: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Map to match frontend expected format
        const mapped = communities.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            members: c._count.members,
            active: Math.floor(c._count.members * 0.1), // Mock active count
            category: c.category,
            image: c.image || 'bg-gradient-to-br from-blue-500 to-cyan-400',
            tags: JSON.parse(c.tags || '[]'),
        }));

        return NextResponse.json({
            communities: mapped,
            total: mapped.length
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { name, description, category, tags, image } = body;

        const community = await prisma.$transaction(async (tx) => {
            const newC = await tx.community.create({
                data: {
                    name,
                    description,
                    category,
                    image,
                    tags: JSON.stringify(tags || []),
                    ownerId: user.id
                }
            });

            // Owner automatically becomes an admin member
            await tx.communityMember.create({
                data: {
                    userId: user.id,
                    communityId: newC.id,
                    role: 'owner'
                }
            });

            return newC;
        });

        return NextResponse.json(community);
    } catch (error) {
        console.error('Create community error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
