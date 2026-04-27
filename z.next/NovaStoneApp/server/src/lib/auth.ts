import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt } from "better-auth/plugins/jwt";
import { prisma } from "./prisma";
import { AUTH_CONFIG } from "./auth-config";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [
    process.env.CORS_ORIGIN || "http://localhost:5173",
    "http://localhost:3000",
  ],
  secret: process.env.BETTER_AUTH_SECRET || "default-secret-change-me",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519",
        },
      },
      jwt: {
        issuer: AUTH_CONFIG.jwtIssuer,
        audience: AUTH_CONFIG.jwtAudience,
        expirationTime: AUTH_CONFIG.jwtExpiration,
        definePayload: ({ user, session }) => ({
          email: user.email,
          name: user.name,
          role:
            (user.metadata as Record<string, unknown> | null)?.role as string ||
            AUTH_CONFIG.defaultRole,
          sessionId: session.id,
        }),
        getSubject: ({ user }) => user.id,
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
