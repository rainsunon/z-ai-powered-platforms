import { jwtService } from '../../infrastructure/auth/jwt.service';

export interface GraphQLContext {
    user?: {
        userId: string;
        email: string;
    };
}

export const createContext = ({ req }: any): GraphQLContext => {
    const context: GraphQLContext = {};

    try {
        const authHeader = req.headers.authorization || '';
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = jwtService.verify(token);
            context.user = {
                userId: payload.userId,
                email: payload.email,
            };
        }
    } catch (error) {
        // Invalid token, continue without user
    }

    return context;
};
