export const serviceConfig = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:8003",
  product: process.env.PRODUCT_SERVICE_URL || "http://localhost:8000",
  order: process.env.ORDER_SERVICE_URL || "http://localhost:8001",
  payment: process.env.PAYMENT_SERVICE_URL || "http://localhost:8002",
  discount: process.env.DISCOUNT_SERVICE_URL || "http://localhost:3004",
  inventory: process.env.INVENTORY_SERVICE_URL || "http://localhost:3005",
};

export const gatewayConfig = {
  port: parseInt(process.env.PORT || "4000"),
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
};

export const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
};

export const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3002",
    "http://localhost:3003",
  ],
  credentials: true,
};
