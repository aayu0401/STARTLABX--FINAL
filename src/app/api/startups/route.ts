import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
    try {
        const startups = await prisma.startup.findMany({
            include: {
                founder: {
                    select: { name: true, avatar: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const total = await prisma.startup.count();
        return NextResponse.json({ startups, total });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { name, mission, description, website, stage, location, logo } = body;

        const startup = await prisma.startup.create({
            data: {
                name,
                mission,
                description,
                website,
                stage,
                location,
                logo,
                founderId: user.id
            }
        });

        return NextResponse.json(startup);
    } catch (error) {
        console.error('Create startup error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
