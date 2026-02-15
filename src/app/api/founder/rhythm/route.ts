import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { founderRhythmService } from '@/services/founder-rhythm.service';

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { action, type } = body;

        // Ensure user has a project
        const project = await prisma.startupProject.findFirst({
            where: { userId: user.id }
        });

        if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

        if (type === 'create') {
            if (!action) return NextResponse.json({ error: 'Action content required' }, { status: 400 });
            await founderRhythmService.setDailyAction(project.id, action);
            return NextResponse.json({ success: true });

        } else if (type === 'complete') {
            // Find today's action
            const status = await founderRhythmService.getFounderStatus(project.id);

            if (status.todaysAction) {
                await founderRhythmService.completeDailyAction(status.todaysAction.id);
                return NextResponse.json({ success: true, status: 'completed' });
            } else {
                return NextResponse.json({ error: 'No active action found for today' }, { status: 404 });
            }
        }

        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });

    } catch (error) {
        console.error("Founder Rhythm Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
