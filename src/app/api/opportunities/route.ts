import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, type, role, description, compensation, skills, startupId } = body;

        // Basic validation
        if (!userId || !role || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create the opportunity
        const opportunity = await prisma.opportunity.create({
            data: {
                creatorId: userId,
                type,
                role,
                description,
                compensation,
                skills: JSON.stringify(skills || []),
                startupId
            },
            include: {
                startup: true,
                creator: true
            }
        });

        // Real-time Broadcast to all connected clients
        const io = (global as any).io;
        if (io) {
            io.emit('new_opportunity', opportunity);

            // Also create a notification for the creator
            io.to(`notifications:${userId}`).emit('new_notification', {
                title: "Job Posted!",
                message: `Your ${role} position is now live.`,
                timestamp: new Date()
            });
        }

        return NextResponse.json(opportunity);
    } catch (e) {
        console.error('Opportunity Create Error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        const where = type ? { type } : {};

        const opps = await prisma.opportunity.findMany({
            where,
            include: { creator: true, startup: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(opps);
    } catch (e) {
        console.error('Opportunities Fetch Error:', e);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
