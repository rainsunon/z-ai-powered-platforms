import rateLimit from "express-rate-limit";
import { rateLimitConfig } from "../config/services.js";

// Global rate limiter
export const globalRateLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.maxRequests,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 5,
  message: "Too many authentication attempts, please try again later.",
  skipSuccessfulRequests: true,
});

// Rate limiter for write operations
export const writeRateLimiter = rateLimit({
  windowMs: 60000,
  max: 30,
  message: "Too many write requests, please slow down.",
});

// Rate limiter for read operations
export const readRateLimiter = rateLimit({
  windowMs: 60000,
  max: 60,
  message: "Too many read requests, please slow down.",
});
