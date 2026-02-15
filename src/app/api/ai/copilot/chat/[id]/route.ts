
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();

    // Simulate AI response
    return NextResponse.json({
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: `I received your message: "${body.message}". Since I am a mock AI, I can only echo for now!`,
        timestamp: new Date()
    });
}
