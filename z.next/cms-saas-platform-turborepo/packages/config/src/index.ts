import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env from project root
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// ─── Schema Definitions ───────────────────────────────────

const DatabaseSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(5432),
  user: z.string().default('cms_admin'),
  password: z.string().min(1),
  database: z.string().default('cms_platform'),
  ssl: z.coerce.boolean().default(false),
  poolMin: z.coerce.number().default(2),
  poolMax: z.coerce.number().default(20),
});

const MongoSchema = z.object({
  uri: z.string().url().default('mongodb://localhost:27017/cms_content'),
  user: z.string().optional(),
  password: z.string().optional(),
});

const RedisSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(6379),
  password: z.string().optional(),
  db: z.coerce.number().default(0),
  cluster: z.coerce.boolean().default(false),
});

const ElasticSchema = z.object({
  node: z.string().url().default('http://localhost:9200'),
  user: z.string().optional(),
  password: z.string().optional(),
});

const S3Schema = z.object({
  endpoint: z.string().default('http://localhost:9000'),
  accessKey: z.string().min(1),
  secretKey: z.string().min(1),
  bucket: z.string().default('cms-media'),
  region: z.string().default('us-east-1'),
});

const JwtSchema = z.object({
  secret: z.string().min(32),
  expiresIn: z.string().default('15m'),
  refreshSecret: z.string().min(32),
  refreshExpiresIn: z.string().default('7d'),
});

const EncryptionSchema = z.object({
  key: z.string().min(32),
  algorithm: z.string().default('aes-256-gcm'),
});

const KafkaSchema = z.object({
  brokers: z.string().default('localhost:9092'),
  clientId: z.string().default('cms-platform'),
  groupId: z.string().default('cms-consumers'),
});

const SmtpSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(587),
  user: z.string().optional(),
  password: z.string().optional(),
  from: z.string().default('noreply@cms-platform.local'),
});

const RateLimitSchema = z.object({
  windowMs: z.coerce.number().default(60000),
  maxRequests: z.coerce.number().default(100),
});

const StripeSchema = z.object({
  secretKey: z.string().default(''),
  webhookSecret: z.string().default(''),
  publishableKey: z.string().default(''),
});

const AiSchema = z.object({
  apiKey: z.string().default(''),
  model: z.string().default('gpt-4'),
  baseUrl: z.string().default('https://api.openai.com/v1'),
});

const ServiceUrlsSchema = z.object({
  auth: z.string().default('http://localhost:3001'),
  user: z.string().default('http://localhost:3002'),
  tenant: z.string().default('http://localhost:3003'),
  content: z.string().default('http://localhost:3004'),
  media: z.string().default('http://localhost:3005'),
  analytics: z.string().default('http://localhost:3006'),
  comment: z.string().default('http://localhost:3007'),
  notification: z.string().default('http://localhost:3008'),
  search: z.string().default('http://localhost:3009'),
  workflow: z.string().default('http://localhost:3010'),
  plugin: z.string().default('http://localhost:3011'),
  feature: z.string().default('http://localhost:3012'),
  audit: z.string().default('http://localhost:3013'),
  settings: z.string().default('http://localhost:3014'),
  ai: z.string().default('http://localhost:3015'),
});

const ConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  port: z.coerce.number().default(3000),
  apiVersion: z.string().default('v1'),
  logLevel: z.enum(['error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

// ─── Parse Configuration ───────────────────────────────────

function loadConfig() {
  const env = process.env;

  const app = ConfigSchema.parse({
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    apiVersion: env.API_VERSION,
    logLevel: env.LOG_LEVEL,
  });

  const database = DatabaseSchema.parse({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    ssl: env.POSTGRES_SSL,
    poolMin: env.POSTGRES_POOL_MIN,
    poolMax: env.POSTGRES_POOL_MAX,
  });

  const mongo = MongoSchema.parse({
    uri: env.MONGO_URI,
    user: env.MONGO_USER,
    password: env.MONGO_PASSWORD,
  });

  const redis = RedisSchema.parse({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
    cluster: env.REDIS_CLUSTER,
  });

  const elastic = ElasticSchema.parse({
    node: env.ELASTICSEARCH_NODE,
    user: env.ELASTICSEARCH_USER,
    password: env.ELASTICSEARCH_PASSWORD,
  });

  const s3 = S3Schema.parse({
    endpoint: env.S3_ENDPOINT,
    accessKey: env.S3_ACCESS_KEY,
    secretKey: env.S3_SECRET_KEY,
    bucket: env.S3_BUCKET,
    region: env.S3_REGION,
  });

  const jwt = JwtSchema.parse({
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });

  const encryption = EncryptionSchema.parse({
    key: env.ENCRYPTION_KEY,
    algorithm: env.ENCRYPTION_ALGORITHM,
  });

  const kafka = KafkaSchema.parse({
    brokers: env.KAFKA_BROKERS,
    clientId: env.KAFKA_CLIENT_ID,
    groupId: env.KAFKA_GROUP_ID,
  });

  const smtp = SmtpSchema.parse({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.SMTP_FROM,
  });

  const rateLimit = RateLimitSchema.parse({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  });

  const stripe = StripeSchema.parse({
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    publishableKey: env.STRIPE_PUBLISHABLE_KEY,
  });

  const ai = AiSchema.parse({
    apiKey: env.AI_API_KEY,
    model: env.AI_MODEL,
    baseUrl: env.AI_BASE_URL,
  });

  const services = ServiceUrlsSchema.parse({
    auth: env.AUTH_SERVICE_URL,
    user: env.USER_SERVICE_URL,
    tenant: env.TENANT_SERVICE_URL,
    content: env.CONTENT_SERVICE_URL,
    media: env.MEDIA_SERVICE_URL,
    analytics: env.ANALYTICS_SERVICE_URL,
    comment: env.COMMENT_SERVICE_URL,
    notification: env.NOTIFICATION_SERVICE_URL,
    search: env.SEARCH_SERVICE_URL,
    workflow: env.WORKFLOW_SERVICE_URL,
    plugin: env.PLUGIN_SERVICE_URL,
    feature: env.FEATURE_SERVICE_URL,
    audit: env.AUDIT_SERVICE_URL,
    settings: env.SETTINGS_SERVICE_URL,
    ai: env.AI_SERVICE_URL,
  });

  return {
    app,
    database,
    mongo,
    redis,
    elastic,
    s3,
    jwt,
    encryption,
    kafka,
    smtp,
    rateLimit,
    stripe,
    ai,
    services,
    isProduction: app.nodeEnv === 'production',
    isDevelopment: app.nodeEnv === 'development',
    isTest: app.nodeEnv === 'test',
  };
}

export type AppConfig = ReturnType<typeof loadConfig>;

let _config: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (!_config) {
    _config = loadConfig();
  }
  return _config;
}

export function resetConfig(): void {
  _config = null;
}

export {
  ConfigSchema,
  DatabaseSchema,
  MongoSchema,
  RedisSchema,
  ElasticSchema,
  S3Schema,
  JwtSchema,
  EncryptionSchema,
  KafkaSchema,
  SmtpSchema,
  RateLimitSchema,
  StripeSchema,
  AiSchema,
  ServiceUrlsSchema,
};
