import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [posts, total, userProject] = await Promise.all([
            prisma.post.findMany({
                skip,
                take: limit, // We will filter this later based on consequence
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            title: true,
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        }
                    }
                }
            }),
            prisma.post.count(),
            // V5: Consequence Engine Check
            // We need userId. For now, we assume public feed or session user. 
            // Since we don't have request.user easily here without session auth lookup:
            // We will skip strict enforcement for this step to avoid breaking public feed.
            // But ideally: prisma.startupProject.findFirst({ where: { userId } })
            Promise.resolve(null)
        ]);

        // V5 Consequence Logic (Simulated)
        // If we had userProject, we would do:
        // const isRestricted = (userProject?.executionStreak || 0) < 3;
        // if (isRestricted) { posts = posts.slice(0, 3); }


        const formattedPosts = posts.map((post: any) => ({
            id: post.id,
            content: post.content,
            title: post.title,
            type: post.type,
            hashtags: post.hashtags ? JSON.parse(post.hashtags) : [],
            media: post.media ? JSON.parse(post.media) : [],
            createdAt: post.createdAt,
            user: post.user,
            likesCount: post._count.likes,
            commentsCount: post._count.comments,
            sharesCount: 0,
            viewsCount: post.viewsCount,
            isLiked: false,
            isSaved: false,
        }));

        return NextResponse.json({
            posts: formattedPosts,
            total
        });
    } catch (error) {
        console.error('Fetch feed error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
