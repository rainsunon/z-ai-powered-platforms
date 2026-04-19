import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../database/prisma/client';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true in production
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    advanced: {
        generateId: () => {
            return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        },
    },
    secret: process.env.AUTH_SECRET || 'your-secret-key-min-32-chars-long',
    baseURL: process.env.AUTH_URL || 'http://localhost:4000',
});

export type AuthSession = typeof auth.$Infer.Session;
