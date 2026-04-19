import jwt from 'jsonwebtoken';

export interface JWTPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

export class JWTService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'your-jwt-secret-key-min-32-chars';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    }

    sign(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
        return jwt.sign(payload, this.secret, {
            expiresIn: this.expiresIn,
        });
    }

    verify(token: string): JWTPayload {
        try {
            return jwt.verify(token, this.secret) as JWTPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    decode(token: string): JWTPayload | null {
        try {
            return jwt.decode(token) as JWTPayload;
        } catch {
            return null;
        }
    }
}

export const jwtService = new JWTService();
