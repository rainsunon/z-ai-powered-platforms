import bcrypt from 'bcryptjs';
import { prisma } from '../../../infrastructure/database/prisma/client';
import { jwtService } from '../../../infrastructure/auth/jwt.service';

export const authResolvers = {
    Query: {
        me: async (_: any, __: any, context: any) => {
            if (!context.user) {
                return null;
            }

            const user = await prisma.user.findUnique({
                where: { id: context.user.userId },
            });

            return user;
        },
    },

    Mutation: {
        signUp: async (
            _: any,
            { input }: { input: { email: string; password: string; name: string } }
        ) => {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Hash password
            const passwordHash = await bcrypt.hash(input.password, 10);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email: input.email,
                    passwordHash,
                    name: input.name,
                },
            });

            // Generate JWT
            const token = jwtService.sign({
                userId: user.id,
                email: user.email,
            });

            return {
                user,
                token,
            };
        },

        signIn: async (_: any, { input }: { input: { email: string; password: string } }) => {
            // Find user
            const user = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Verify password
            const isValid = await bcrypt.compare(input.password, user.passwordHash);

            if (!isValid) {
                throw new Error('Invalid email or password');
            }

            // Generate JWT
            const token = jwtService.sign({
                userId: user.id,
                email: user.email,
            });

            return {
                user,
                token,
            };
        },
    },
};
