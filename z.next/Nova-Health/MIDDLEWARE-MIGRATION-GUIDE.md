# Middleware Migration Guide

This guide helps you migrate from duplicated middleware in individual services to the shared `@nova-health/middleware` package.

## Why Migrate?

- **Eliminate code duplication** - Remove ~4,000 lines of duplicate code
- **Consistent behavior** - All services use the same middleware implementations
- **Easier maintenance** - Updates to middleware are applied to all services
- **Better testing** - Middleware can be tested once and reused

## Migration Steps

### Step 1: Update Service Dependencies

Add the shared middleware package to your service's `package.json`:

```json
{
  "dependencies": {
    "@nova-health/middleware": "workspace:*",
    "@nova-health/config": "workspace:*",
    "@nova-health/types": "workspace:*",
    "hono": "^4.12.9",
    "zod": "^4.3.6"
  }
}
```

### Step 2: Update Imports

Replace local middleware imports with shared middleware imports:

**Before:**
```typescript
import { authMiddleware } from '@/middleware/auth';
import { corsMiddleware } from '@/middleware/cors';
import { errorMiddleware } from '@/middleware/error';
import { rateLimit, rateLimits } from '@/middleware/rateLimit';
import { validateBody } from '@/middleware/validation';
```

**After:**
```typescript
import { 
  authMiddleware, 
  corsMiddleware, 
  errorMiddleware, 
  rateLimit, 
  rateLimits,
  validateBody 
} from '@nova-health/middleware';
```

### Step 3: Remove Local Middleware Files

Delete the local middleware directory in your service:

```bash
rm -rf apps/services/your-service/src/middleware
```

### Step 4: Update TypeScript Path Aliases (if needed)

If your service uses path aliases for middleware, remove them from `tsconfig.json`:

**Before:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/middleware/*": ["./src/middleware/*"]
    }
  }
}
```

**After:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Complete Migration Example

### Before Migration

**apps/services/customer-service/src/index.ts**
```typescript
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { getServiceConfig } from '@nova-health/config';
import { authMiddleware } from './middleware/auth';
import { corsMiddleware } from './middleware/cors';
import { errorMiddleware } from './middleware/error';
import { rateLimits } from './middleware/rateLimit';

const app = new Hono();
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', corsMiddleware);
app.use('*', errorMiddleware);
app.use('/api/*', authMiddleware);
app.use('/api/*', rateLimits.api);

// ... routes
```

### After Migration

**apps/services/customer-service/src/index.ts**
```typescript
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { getServiceConfig } from '@nova-health/config';
import { 
  authMiddleware, 
  corsMiddleware, 
  errorMiddleware, 
  rateLimits 
} from '@nova-health/middleware';

const app = new Hono();
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', corsMiddleware);
app.use('*', errorMiddleware);
app.use('/api/*', authMiddleware);
app.use('/api/*', rateLimits.api);

// ... routes
```

## Validation Middleware Migration

### Before
```typescript
import { validateBody } from '@/middleware/validation';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
});

app.post('/users', validateBody(schema), async (c) => {
  const data = c.get('validatedBody');
  // ...
});
```

### After
```typescript
import { validateBody } from '@nova-health/middleware';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
});

app.post('/users', validateBody(schema), async (c) => {
  const data = c.get('validatedBody');
  // ...
});
```

**No changes needed!** The API remains exactly the same.

## Testing After Migration

After migrating, ensure your service still works correctly:

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Type check:**
   ```bash
   pnpm type-check
   ```

3. **Build:**
   ```bash
   pnpm build
   ```

4. **Run the service:**
   ```bash
   pnpm dev
   ```

5. **Test endpoints:**
   - Test authentication
   - Test rate limiting
   - Test validation
   - Test error handling

## Services to Migrate

Here's a checklist of all services that need migration:

- [x] admin-service
- [x] auth-service
- [x] analytics-service
- [x] billing-service
- [x] customer-service
- [x] order-service
- [x] payment-service
- [x] sync-service
- [x] symptom-service
- [x] notification-service (already migrated)

## Rollback Plan

If you encounter issues after migration:

1. **Restore local middleware:**
   ```bash
   git checkout apps/services/your-service/src/middleware
   ```

2. **Revert imports:**
   ```typescript
   import { authMiddleware } from './middleware/auth';
   ```

3. **Remove shared middleware dependency:**
   ```bash
   pnpm remove @nova-health/middleware
   ```

## Benefits Realized After Migration

Once all services are migrated:

- **~4,000 lines of duplicate code removed**
- **Single source of truth for middleware**
- **Consistent behavior across all services**
- **Easier to add new middleware features**
- **Simplified testing and debugging**

## Need Help?

If you encounter issues during migration:

1. Check the [`@nova-health/middleware` README](packages/middleware/README.md)
2. Review the [Architecture Analysis Report](ARCHITECTURE-ANALYSIS-REPORT.md)
3. Check the middleware source code in [`packages/middleware/src/`](packages/middleware/src/)

## Next Steps

After completing the migration:

1. Update your service documentation
2. Remove any middleware-specific tests (now handled by shared package)
3. Update CI/CD pipelines if needed
4. Celebrate removing 4,000 lines of duplicate code! 🎉
