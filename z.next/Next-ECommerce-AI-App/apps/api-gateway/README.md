# API Gateway

Centralized API Gateway for the microservices e-commerce platform.

## Overview

The API Gateway serves as the single entry point for all client and admin application requests. It handles routing, authentication, rate limiting, CORS, logging, and error handling.

## Features

- **Unified Endpoint**: Single URL for all API calls (`http://localhost:4000`)
- **Authentication**: Clerk-based JWT verification
- **Rate Limiting**: Configurable limits per route and globally
- **CORS**: Configured for client and admin apps
- **Request Logging**: Winston-based structured logging
- **Error Handling**: Consistent error responses
- **Health Checks**: Gateway and service health monitoring
- **Security**: Helmet.js security headers

## Architecture

```
Client/Admin Apps
       ↓
  API Gateway (Port 4000)
       ↓
  ┌────┴────┬────────┬─────────┬──────────┬──────────┐
  ↓         ↓        ↓         ↓          ↓          ↓
Auth    Product   Order    Payment   Discount   Inventory
:8003    :8000    :8001     :8002      :3004      :3005
```

## Routes

| Path | Target Service | Auth Required |
|------|---------------|---------------|
| `/api/auth` | Auth Service | No |
| `/api/users` | Auth Service | Yes |
| `/api/products` | Product Service | No |
| `/api/categories` | Product Service | No |
| `/api/orders` | Order Service | Yes |
| `/api/payments` | Payment Service | Yes |
| `/api/sessions` | Payment Service | Yes |
| `/api/discount` | Discount Service | Yes |
| `/api/inventory` | Inventory Service | Yes |
| `/api/analytics` | Analytics Service | Yes |
| `/api/notifications` | Notification Service | Yes |

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```env
PORT=4000
NODE_ENV=development

# Service URLs
AUTH_SERVICE_URL=http://localhost:8003
PRODUCT_SERVICE_URL=http://localhost:8000
ORDER_SERVICE_URL=http://localhost:8001
PAYMENT_SERVICE_URL=http://localhost:8002
DISCOUNT_SERVICE_URL=http://localhost:3004
INVENTORY_SERVICE_URL=http://localhost:3005

# Clerk
CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3002,http://localhost:3003

# Logging
LOG_LEVEL=info
```

### 3. Start Gateway

```bash
pnpm dev
```

## Health Checks

### Gateway Health
```bash
GET http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "service": "api-gateway",
  "timestamp": "2025-11-29T20:00:00.000Z",
  "uptime": 123.45
}
```

### Services Health
```bash
GET http://localhost:4000/health/services
```

Response:
```json
{
  "status": "ok",
  "services": [
    {
      "name": "auth",
      "url": "http://localhost:8003",
      "status": "healthy",
      "statusCode": 200
    },
    ...
  ],
  "timestamp": "2025-11-29T20:00:00.000Z"
}
```

## Rate Limiting

- **Global**: 100 requests/minute per IP
- **Auth endpoints**: 5 requests/minute
- **Write operations**: 30 requests/minute
- **Read operations**: 60 requests/minute

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Error description",
    "stack": "..." // Only in development
  }
}
```

## Logging

Logs are structured JSON with the following fields:
- `timestamp`: ISO 8601 timestamp
- `level`: Log level (info, warn, error)
- `message`: Log message
- `service`: "api-gateway"
- Additional context fields

## Development

### Project Structure

```
api-gateway/
├── src/
│   ├── config/
│   │   ├── routes.ts       # Route configuration
│   │   └── services.ts     # Service URLs
│   ├── middleware/
│   │   ├── auth.ts         # Clerk authentication
│   │   ├── cors.ts         # CORS configuration
│   │   ├── errorHandler.ts # Error handling
│   │   ├── logging.ts      # Request logging
│   │   └── rateLimit.ts    # Rate limiting
│   ├── routes/
│   │   ├── health.ts       # Health check routes
│   │   └── proxy.ts        # Proxy routes
│   ├── utils/
│   │   └── logger.ts       # Winston logger
│   └── index.ts            # Main server
├── package.json
├── tsconfig.json
└── .env
```

### Adding New Routes

1. Add service URL to `src/config/services.ts`
2. Add route mapping to `src/config/routes.ts`
3. Restart gateway

Example:
```typescript
{
  path: "/api/new-service",
  target: serviceConfig.newService,
  auth: true,
}
```

## Production Deployment

### Environment Variables

Set all required environment variables in production:
- Use production service URLs
- Set `NODE_ENV=production`
- Configure proper CORS origins
- Use secure Clerk keys

### Monitoring

- Check `/health` endpoint regularly
- Monitor `/health/services` for service availability
- Set up alerts for 5xx errors
- Track response times

### Scaling

Run multiple gateway instances behind a load balancer:

```bash
# Instance 1
PORT=4000 pnpm start

# Instance 2
PORT=4001 pnpm start

# Instance 3
PORT=4002 pnpm start
```

## Troubleshooting

### Service Unavailable (503)

Check if target service is running:
```bash
curl http://localhost:8000/health
```

### Unauthorized (401)

Verify Clerk configuration:
- Check `CLERK_SECRET_KEY` is set
- Ensure client sends valid JWT token

### Rate Limit Exceeded (429)

Reduce request frequency or increase limits in `.env`

### CORS Errors

Add origin to `ALLOWED_ORIGINS` in `.env`
