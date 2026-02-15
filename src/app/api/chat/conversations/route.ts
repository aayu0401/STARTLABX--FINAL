import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Find all conversations where the user is a participant
        const participations = await prisma.conversationParticipant.findMany({
            where: { userId: user.id },
            include: {
                conversation: {
                    include: {
                        participants: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        avatar: true,
                                        title: true
                                    }
                                }
                            }
                        },
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            },
            orderBy: {
                conversation: { updatedAt: 'desc' }
            }
        });

        // Format for frontend
        const conversations = participations.map(p => {
            const conv = p.conversation;
            const otherParticipant = conv.participants.find(part => part.userId !== user.id)?.user;
            const lastMsg = conv.messages[0];

            return {
                id: conv.id,
                user: otherParticipant || { id: 'deleted', name: 'Deleted User', avatar: '', title: '' }, // The "other" user
                lastMessage: {
                    content: lastMsg?.content || 'No messages yet',
                    timestamp: lastMsg?.createdAt || conv.createdAt,
                    read: lastMsg?.read || false,
                    fromMe: lastMsg?.senderId === user.id
                },
                unreadCount: 0 // TODO: Calculate real unread 
            };
        });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error('Fetch conversations error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Create a new conversation (or get existing) with a specific user
export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { targetUserId } = await request.json();

        // Check if conversation already exists (1-on-1)
        // complex query: find conversation where both users are participants
        const existing = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId: user.id } } },
                    { participants: { some: { userId: targetUserId } } }
                ]
            }
        });

        if (existing) {
            return NextResponse.json({ id: existing.id });
        }

        // Create new
        const newConv = await prisma.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: user.id },
                        { userId: targetUserId }
                    ]
                }
            }
        });

        return NextResponse.json({ id: newConv.id });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }
}
