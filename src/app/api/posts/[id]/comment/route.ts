import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: postId } = await params;
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { content } = await request.json();

        if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { user: true }
        });

        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        const comment = await prisma.comment.create({
            data: {
                content,
                userId: user.id,
                postId
            }
        });

        // Trigger notification
        if (post.userId !== user.id) {
            await createNotification(
                post.userId,
                'system',
                'New Comment',
                `${user.name} commented: "${content.substring(0, 30)}..."`,
                { postId, commentId: comment.id }
            );
        }

        return NextResponse.json(comment);

    } catch (error) {
        console.error('Comment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const comments = await prisma.comment.findMany({
            where: { postId: id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        title: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
