import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const content = formData.get('content') as string;
        const type = formData.get('type') as string;
        const title = formData.get('title') as string;
        const hashtags = formData.get('hashtags') as string;

        const post = await prisma.post.create({
            data: {
                content,
                type,
                title,
                hashtags: hashtags,
                media: '[]',
                userId: user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        title: true,
                    }
                }
            }
        });

        const formattedPost: any = {
            // Use "any" to avoid strictly typing the response against service interface for now, 
            // ensuring we return all data we have.
            // In production, define a proper response DTO.
            ...post,
            hashtags: post.hashtags ? JSON.parse(post.hashtags) : [],
            media: [],
            likesCount: 0,
            commentsCount: 0,
            sharesCount: 0,
            viewsCount: 0,
            isLiked: false,
            isSaved: false,
        };

        return NextResponse.json(formattedPost);

    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
