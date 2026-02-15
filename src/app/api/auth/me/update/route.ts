import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request: Request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate allowed fields
        const { name, bio, title, location, website, avatar } = body;

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                name,
                bio,
                title,
                location,
                website,
                avatar
            },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                title: true,
                location: true,
                website: true,
                avatar: true,
                accountType: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
