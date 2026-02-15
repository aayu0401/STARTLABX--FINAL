import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: communityId } = await params;
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Check if community exists
        const community = await prisma.community.findUnique({ where: { id: communityId } });
        if (!community) return NextResponse.json({ error: 'Community not found' }, { status: 404 });

        // Check if already a member
        const existing = await prisma.communityMember.findUnique({
            where: {
                userId_communityId: {
                    userId: user.id,
                    communityId
                }
            }
        });

        if (existing) {
            // Leave logic: If they are the owner, they can't leave without transferring ownership (simplified: error)
            if (existing.role === 'owner') {
                return NextResponse.json({ error: 'Owners cannot leave their own community' }, { status: 400 });
            }

            await prisma.communityMember.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ joined: false });
        } else {
            // Join logic
            await prisma.communityMember.create({
                data: {
                    userId: user.id,
                    communityId,
                    role: 'member'
                }
            });
            return NextResponse.json({ joined: true });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
