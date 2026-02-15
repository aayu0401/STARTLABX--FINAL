import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const saved = await prisma.savedTalent.findMany({
            where: { userId: user.id },
            include: {
                talent: {
                    select: {
                        id: true,
                        name: true,
                        title: true,
                        avatar: true,
                        location: true,
                        skills: true
                    }
                }
            }
        });

        const mapped = saved.map(s => ({
            ...s.talent,
            skills: JSON.parse(s.talent.skills || '[]'),
            savedAt: s.createdAt
        }));

        return NextResponse.json(mapped);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { talentId } = await request.json();

        const existing = await prisma.savedTalent.findUnique({
            where: {
                userId_talentId: {
                    userId: user.id,
                    talentId
                }
            }
        });

        if (existing) {
            await prisma.savedTalent.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ saved: false });
        } else {
            await prisma.savedTalent.create({
                data: {
                    userId: user.id,
                    talentId
                }
            });
            return NextResponse.json({ saved: true });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
