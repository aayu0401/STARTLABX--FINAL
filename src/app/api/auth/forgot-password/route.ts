import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emailService } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Security best practice: don't reveal if user exists
            return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
        }

        // Create token (valid for 1 hour)
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 3600000);

        await prisma.passwordResetToken.create({
            data: {
                token,
                expiresAt,
                userId: user.id
            }
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        await emailService.sendPasswordResetEmail(email, resetUrl);

        return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
