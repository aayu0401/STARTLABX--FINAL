import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    console.warn('WARNING: Using default JWT_SECRET. Do not use this in production.');
}
const SECRET_KEY = JWT_SECRET || 'dev_fallback_secret_only';

export interface TokenPayload {
    userId: string;
    email: string;
}

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, SECRET_KEY) as TokenPayload;
    } catch (error) {
        return null;
    }
}

export async function getUserFromRequest(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                title: true,
                accountType: true,
                role: true,
            }
        });
        return user;
    } catch (error) {
        return null;
    }
}
