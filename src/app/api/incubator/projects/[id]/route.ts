
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const project = await prisma.startupProject.findUnique({
            where: { id },
            include: {
                tasks: { orderBy: { createdAt: 'desc' }, take: 20 },
                assets: { orderBy: { createdAt: 'desc' }, take: 20 }
            }
        });

        if (!project || project.userId !== user.id) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (e) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
