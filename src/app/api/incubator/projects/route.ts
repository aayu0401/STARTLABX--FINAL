
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { idea, name } = await request.json();

        // 1. Create the project
        const project = await prisma.startupProject.create({
            data: {
                name: name || `Venture ${Date.now().toString().slice(-4)}`,
                description: idea,
                status: 'ideation',
                currentStage: 'concept',
                userId: user.id
            }
        });

        // 2. Automatically trigger the CEO agent to analyze the idea
        // We do this asynchronously or immediately? For MVP, we'll queue it as a "Initial Task"
        // In a real system, we'd fire an event. Here, we create a pending task.
        /*
        await prisma.agentTask.create({
            data: {
                projectId: project.id,
                agentRole: 'CEO',
                action: 'analyze_idea',
                status: 'pending',
                input: JSON.stringify({ idea })
            }
        });
        */

        return NextResponse.json(project);
    } catch (e) {
        console.error('Failed to create project', e);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const projects = await prisma.startupProject.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { tasks: true, assets: true }
                }
            }
        });

        return NextResponse.json(projects);
    } catch (e) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
