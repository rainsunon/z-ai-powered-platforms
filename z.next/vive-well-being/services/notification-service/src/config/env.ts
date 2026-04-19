import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  DATABASE_URL: z.string(),

  RABBITMQ_URL: z.string().default("amqp://guest:guest@localhost:5672"),

  REDIS_URL: z.string().default("redis://localhost:6379"),

  SMTP_HOST: z.string().default("smtp.example.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default("noreply@vive-wellbeing.com"),

  MAX_RETRIES: z.coerce.number().default(3),
  RATE_LIMIT_PER_MINUTE: z.coerce.number().default(5),

  // API authentication
  API_KEY: z.string().min(1, "API_KEY is required"),

  // HTTP-level rate limiting (requests per minute per caller)
  HTTP_RATE_LIMIT_PER_MINUTE: z.coerce.number().default(100),

  // Worker health server port
  WORKER_HEALTH_PORT: z.coerce.number().default(3002),
});

export const env = envSchema.parse(process.env);
