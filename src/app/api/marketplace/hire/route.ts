
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Hiring request received:', body);

        // Mock success
        return NextResponse.json({ message: 'Hiring request sent successfully', id: 'hire_123' });
    } catch (error) {
        return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
    }
}
