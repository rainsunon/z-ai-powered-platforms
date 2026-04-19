# @nova-health/middleware

Shared middleware package for Nova Health microservices. This package provides reusable middleware for authentication, authorization, CORS, error handling, rate limiting, and validation.

## Installation

This package is part of the Nova Health monorepo and should be installed as a workspace dependency:

```bash
pnpm add @nova-health/middleware
```

## Usage

### Importing Middleware

You can import middleware in several ways:

```typescript
// Import all middleware
import * as middleware from '@nova-health/middleware';

// Import specific middleware
import { authMiddleware, errorMiddleware, corsMiddleware } from '@nova-health/middleware';

// Import from specific paths
import { authMiddleware } from '@nova-health/middleware/auth';
import { rateLimit } from '@nova-health/middleware/rateLimit';
```

### Authentication & Authorization

```typescript
import { Hono } from 'hono';
import { authMiddleware, requireRole, requirePermission } from '@nova-health/middleware';

const app = new Hono();

// Apply authentication middleware
app.use('*', authMiddleware);

// Require specific roles
app.use('/admin/*', requireRole('admin', 'super_admin'));

// Require specific permissions
app.use('/patients/*', requirePermission('view_patient_data'));
```

### CORS

```typescript
import { corsMiddleware } from '@nova-health/middleware';

const app = new Hono();

// Apply CORS middleware
app.use('*', corsMiddleware);
```

### Error Handling

```typescript
import { errorMiddleware, notFoundHandler } from '@nova-health/middleware';

const app = new Hono();

// Apply error handling middleware
app.use('*', errorMiddleware);

// Handle 404 errors
app.notFound(notFoundHandler);
```

### Rate Limiting

```typescript
import { rateLimit, rateLimits } from '@nova-health/middleware';

const app = new Hono();

// Use predefined rate limit configurations
app.use('/api/*', rateLimits.api);
app.use('/api/auth/*', rateLimits.auth);
app.use('/api/data/*', rateLimits.data);
app.use('/api/read/*', rateLimits.read);

// Or create custom rate limit
app.use('/api/custom/*', rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
}));
```

### Validation

```typescript
import { Hono } from 'hono';
import { z } from 'zod';
import { validateBody, validateQuery, validateParams } from '@nova-health/middleware';

const app = new Hono();

// Define validation schemas
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  age: z.number().min(18),
});

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

const paramsSchema = z.object({
  id: z.string().uuid(),
});

// Apply validation middleware
app.post('/users', validateBody(userSchema), async (c) => {
  const data = c.get('validatedBody');
  return c.json({ success: true, data });
});

app.get('/users', validateQuery(querySchema), async (c) => {
  const query = c.get('validatedQuery');
  return c.json({ success: true, query });
});

app.get('/users/:id', validateParams(paramsSchema), async (c) => {
  const params = c.get('validatedParams');
  return c.json({ success: true, params });
});
```

## Middleware Reference

### Authentication Middleware

- `authMiddleware` - Validates JWT tokens and adds user info to context
- `requireRole(...roles)` - Requires user to have one of the specified roles
- `requirePermission(permission)` - Requires user to have a specific permission

### CORS Middleware

- `corsMiddleware` - Handles CORS with configurable origins

### Error Handling Middleware

- `errorMiddleware` - Catches and formats errors consistently
- `notFoundHandler` - Handles 404 errors

### Rate Limiting Middleware

- `rateLimit(config)` - Creates a custom rate limiter
- `rateLimits.api` - General API rate limit (100 req/15min)
- `rateLimits.auth` - Strict auth rate limit (5 req/15min)
- `rateLimits.data` - Data operations rate limit (30 req/min)
- `rateLimits.read` - Read operations rate limit (60 req/min)

### Validation Middleware

- `validateBody(schema)` - Validates request body
- `validateQuery(schema)` - Validates query parameters
- `validateParams(schema)` - Validates route parameters
- `getValidatedBody(c)` - Helper to get validated body from context
- `getValidatedQuery(c)` - Helper to get validated query from context
- `getValidatedParams(c)` - Helper to get validated params from context

## Context Variables

After applying middleware, the following context variables are available:

### Authentication Middleware

- `c.get('userId')` - User ID from JWT token
- `c.get('email')` - User email from JWT token
- `c.get('role')` - User role from JWT token

### Validation Middleware

- `c.get('validatedBody')` - Validated request body
- `c.get('validatedQuery')` - Validated query parameters
- `c.get('validatedParams')` - Validated route parameters

## Error Types

The middleware uses standard error types from `@nova-health/types`:

- `AuthenticationError` - 401 - Authentication failed
- `AuthorizationError` - 403 - Authorization failed
- `ValidationError` - 400 - Validation failed
- `NotFoundError` - 404 - Resource not found
- `ConflictError` - 409 - Resource conflict
- `BadRequestError` - 400 - Bad request
- `UnprocessableEntityError` - 422 - Unprocessable entity
- `RateLimitError` - 429 - Rate limit exceeded
- `InternalServerError` - 500 - Internal server error

## Configuration

Most middleware uses configuration from `@nova-health/config`. Ensure your environment variables are properly configured.

## Examples

### Complete Service Setup

```typescript
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { 
  authMiddleware, 
  errorMiddleware, 
  corsMiddleware, 
  rateLimits,
  notFoundHandler 
} from '@nova-health/middleware';

const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', corsMiddleware);
app.use('*', errorMiddleware);

// Authentication
app.use('/api/*', authMiddleware);

// Rate limiting
app.use('/api/*', rateLimits.api);

// Routes
app.route('/api/users', userRoutes);

// 404 handler
app.notFound(notFoundHandler);

export default app;
```

## License

MIT
