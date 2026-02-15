import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        const mappedData = {
            id: user.id,
            name: user.name,
            title: user.title || 'Professional',
            bio: user.bio || '',
            avatar: user.avatar,
            createdAt: user.createdAt.toISOString(),
            skills: ['React', 'Node.js', 'Typescript'], // Mock
            experience: 3, // Mock
            location: 'Remote', // Mock
            availability: 'available', // Mock
            rating: 4.8, // Mock
            reviewCount: 12, // Mock
            isSaved: false, // Mock
            coverImage: 'https://placehold.co/600x200', // Mock
            compensationType: ['salary', 'equity'],
            portfolio: [],
            workHistory: [],
            education: []
        };

        return NextResponse.json(mappedData);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
