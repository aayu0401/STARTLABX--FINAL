
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { getAgent } from '@/lib/agents/registry';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const project = await prisma.startupProject.findUnique({
            where: { id },
        });

        if (!project || project.userId !== user.id) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const { agentRole, action, input } = await request.json();

        // 1. Get the agent
        const agent = getAgent(agentRole);

        // 2. Execute the task
        const result = await agent.execute({
            projectId: id,
            project,
            input: { ...input, action }
        });

        return NextResponse.json(result);

    } catch (e: any) {
        console.error('Agent execution failed', e);
        return NextResponse.json({ error: e.message || 'Agent failed' }, { status: 500 });
    }
}
