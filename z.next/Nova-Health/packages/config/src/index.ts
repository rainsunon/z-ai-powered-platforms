import { z } from 'zod';

// ============================================
// Environment Schema
// ============================================

export const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().default(10),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Kafka
  KAFKA_BROKERS: z.string().optional(),
  KAFKA_CLIENT_ID: z.string().optional(),
  KAFKA_GROUP_ID: z.string().optional(),

  // Redis (for caching)
  REDIS_URL: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // S3 / Object Storage
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),

  // CORS
  CORS_ORIGIN: z.string().default('*'),
});

export type Env = z.infer<typeof envSchema>;

// ============================================
// Load Environment Variables
// ============================================

let cachedEnv: Env | null = null;

export function loadEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  try {
    const env = envSchema.parse(process.env);
    cachedEnv = env;
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((e) => e.path.join('.'))
        .join(', ');
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}`
      );
    }
    throw error;
  }
}

// ============================================
// Service Configuration
// ============================================

export interface ServiceConfig {
  name: string;
  port: number;
  env: 'development' | 'production' | 'test';
  database: {
    url: string;
    poolSize: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  stripe?: {
    secretKey?: string;
    webhookSecret?: string;
  };
  email?: {
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    from?: string;
  };
  kafka?: {
    brokers?: string;
    clientId?: string;
    groupId?: string;
  };
  redis?: {
    url?: string;
    password?: string;
  };
  s3?: {
    bucket?: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
  };
  cors: {
    origin: string;
  };
}

export function getServiceConfig(): ServiceConfig {
  const env = loadEnv();

  return {
    name: process.env.SERVICE_NAME || 'nova-health-service',
    port: env.PORT,
    env: env.NODE_ENV,
    database: {
      url: env.DATABASE_URL,
      poolSize: env.DATABASE_POOL_SIZE,
    },
    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRES_IN,
      refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
    stripe: env.STRIPE_SECRET_KEY
      ? {
          secretKey: env.STRIPE_SECRET_KEY,
          webhookSecret: env.STRIPE_WEBHOOK_SECRET,
        }
      : undefined,
    email: env.SMTP_HOST
      ? {
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
          from: env.EMAIL_FROM,
        }
      : undefined,
    kafka: env.KAFKA_BROKERS
      ? {
          brokers: env.KAFKA_BROKERS,
          clientId: env.KAFKA_CLIENT_ID,
          groupId: env.KAFKA_GROUP_ID,
        }
      : undefined,
    redis: env.REDIS_URL
      ? {
          url: env.REDIS_URL,
          password: env.REDIS_PASSWORD,
        }
      : undefined,
    s3: env.S3_BUCKET
      ? {
          bucket: env.S3_BUCKET,
          region: env.S3_REGION,
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        }
      : undefined,
    cors: {
      origin: env.CORS_ORIGIN,
    },
  };
}
