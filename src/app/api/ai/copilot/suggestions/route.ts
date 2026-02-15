
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json([
        {
            id: 'sug_1',
            type: 'action',
            title: 'Update your profile',
            description: 'Adding a bio increases your visibility.',
            priority: 'high'
        },
        {
            id: 'sug_2',
            type: 'insight',
            title: 'Market Trend',
            description: 'AI startups are seeing 20% more engagement.',
            priority: 'medium'
        }
    ]);
}
