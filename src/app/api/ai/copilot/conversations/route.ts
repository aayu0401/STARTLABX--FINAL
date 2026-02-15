
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json([
        {
            id: 'conv_1',
            title: 'Pitch Deck Review',
            messages: [
                { role: 'user', content: 'Can you review my pitch deck?', timestamp: new Date() },
                { role: 'assistant', content: 'Sure! Upload it or paste the content here.', timestamp: new Date() }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 'conv_2',
            title: 'Market Analysis',
            messages: [
                { role: 'user', content: 'What is the TAM for AI in 2025?', timestamp: new Date() },
                { role: 'assistant', content: 'The Total Addressable Market for AI is projected to reach...', timestamp: new Date() }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
}

export async function POST(request: Request) {
    return NextResponse.json({
        id: `conv_${Date.now()}`,
        title: 'New Conversation',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
    });
}
