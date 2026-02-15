import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const skill = searchParams.get('skill');
        const search = searchParams.get('search');
        const location = searchParams.get('location');
        const availability = searchParams.get('availability');

        const where: any = {
            accountType: 'professional'
        };

        if (skill) {
            where.skills = { contains: skill };
        }

        if (availability) {
            where.availability = availability;
        }

        if (location) {
            where.location = { contains: location };
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { title: { contains: search } },
                { bio: { contains: search } }
            ];
        }

        const professionals = await prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                title: true,
                bio: true,
                avatar: true,
                location: true,
                skills: true,
                experience: true,
                availability: true,
                hourlyRate: true,
                createdAt: true
            }
        });

        const count = await prisma.user.count({ where });

        const mappedData = professionals.map(p => ({
            id: p.id,
            name: p.name,
            title: p.title || 'Professional',
            bio: p.bio || '',
            avatar: p.avatar,
            location: p.location || 'Remote',
            skills: JSON.parse(p.skills || '["React", "Node.js", "Typescript"]'),
            experience: p.experience || 0,
            availability: p.availability || 'available',
            hourlyRate: p.hourlyRate,
            createdAt: p.createdAt.toISOString(),
            rating: 4.8, // Still mock
            reviewCount: 12, // Still mock
            isSaved: false // Logic for this should check SavedTalent model
        }));

        return NextResponse.json({
            professionals: mappedData,
            total: count
        });
    } catch (error) {
        console.error('Fetch talent error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
