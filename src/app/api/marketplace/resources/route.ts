
import { NextResponse } from 'next/server';

const resources = [
    {
        id: 'r1',
        title: 'Senior React Developer',
        name: 'Alex Johnson',
        description: 'Experienced frontend developer specializing in Next.js and Tailwind.',
        category: 'talent',
        type: 'hourly',
        hourlyRate: 85,
        rating: 4.8,
        reviewCount: 24,
        availability: 'part_time',
        skills: ['React', 'Next.js', 'Typescript', 'Node.js'],
        verified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        createdAt: new Date().toISOString()
    },
    {
        id: 'r2',
        title: 'Pitch Deck Template',
        name: 'Pitch Perfect',
        description: 'The ultimate pitch deck template for raising Series A.',
        category: 'template',
        type: 'paid',
        price: 49,
        rating: 4.5,
        reviewCount: 112,
        tags: ['startup', 'fundraising', 'design'],
        imageUrl: 'https://placehold.co/600x400/png?text=Pitch+Deck',
        createdAt: new Date().toISOString()
    },
    {
        id: 'r3',
        title: 'Full Stack Engineer',
        name: 'Sarah Lee',
        description: 'Full stack wizard, formerly at Google.',
        category: 'talent',
        type: 'equity',
        equityInterest: true,
        rating: 5.0,
        reviewCount: 8,
        availability: 'full_time',
        skills: ['Python', 'Django', 'React', 'AWS'],
        verified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        createdAt: new Date().toISOString()
    }
];

export async function GET(request: Request) {
    // In a real app, we would parse query params for filtering
    // const { searchParams } = new URL(request.url);
    // const category = searchParams.get('category');

    return NextResponse.json(resources);
}
