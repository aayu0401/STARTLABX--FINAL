
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Mock generic search for resources
    // Reuse the same logic as the main list for now
    const resources = [
        {
            id: 'r1',
            title: 'Senior React Developer',
            name: 'Alex Johnson',
            description: 'Experienced frontend developer.',
            category: 'talent',
            type: 'hourly',
            hourlyRate: 85,
            rating: 4.8,
            reviewCount: 24,
            availability: 'part_time',
            skills: ['React', 'Next.js'],
            verified: true,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            createdAt: new Date().toISOString()
        }
    ];
    return NextResponse.json({ resources });
}
