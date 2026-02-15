import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// GET Messages for a specific conversation
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: conversationId } = await params;
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Ensure user is participant
        const isParticipant = await prisma.conversationParticipant.findUnique({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId: user.id
                }
            }
        });

        if (!isParticipant) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            include: { sender: { select: { id: true, name: true, avatar: true } } }
        });

        const mappedMessages = messages.map(m => ({
            id: m.id,
            content: m.content,
            timestamp: m.createdAt,
            fromMe: m.senderId === user.id,
            read: m.read,
            type: m.type,
            sender: m.sender // Add sender info for UI
        }));

        return NextResponse.json(mappedMessages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

// POST Message to a conversation
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: conversationId } = await params;
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const body = await request.json();

        // 1. Send Message
        const message = await prisma.message.create({
            data: {
                content: body.content,
                type: body.type || 'text',
                conversationId,
                senderId: user.id
            },
            include: { sender: { select: { id: true, name: true, avatar: true } } }
        });

        // 2. Update Conversation Timestamp
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json({
            id: message.id,
            content: message.content,
            timestamp: message.createdAt,
            fromMe: true,
            read: false,
            type: message.type,
            sender: message.sender
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
