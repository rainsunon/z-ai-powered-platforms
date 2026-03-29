# Migration Guide: From Monolith to Monorepo

This guide helps you migrate from the previous monolithic structure to the new Turbo Repo monorepo architecture.

## 📋 Overview

The project has been restructured from a monolithic backend/frontend setup to a microservices-based monorepo using Turbo Repo. This change provides:

- **Better Code Organization**: Clear separation between services and shared packages
- **Improved Maintainability**: Shared code in packages reduces duplication
- **Scalability**: Easy to add new services without affecting existing ones
- **Faster Development**: Turbo's caching and parallel execution speed up builds

## 🔄 Directory Changes

### Before (Monolith)
```
nova-health/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── lib/
│   │   ├── types/
│   │   └── config/
│   └── package.json
└── frontend/
    ├── src/
    └── package.json
```

### After (Monorepo)
```
nova-health/
├── apps/
│   ├── web/                    # Frontend (was frontend/)
│   └── services/               # Backend services
│       ├── admin/
│       ├── auth-service/
│       ├── client/
│       ├── billing-service/
│       ├── payment-service/
│       ├── sync-service/
│       ├── analytics-service/
│       ├── symptom-service/
│       └── order-service/
├── packages/                   # Shared code
│   ├── types/                 # Was backend/src/types/
│   ├── config/                # Was backend/src/config/
│   ├── utils/                 # Was backend/src/lib/
│   └── database/              # Database utilities
└── turbo.json
```

## 📦 Service Mapping

| Old Location | New Location | Service |
|-------------|--------------|---------|
| `backend/src/routes/auth.ts` | `apps/services/auth-service/src/routes/auth.ts` | Auth Service |
| `backend/src/routes/admin.ts` | `apps/services/admin/src/routes/admin.ts` | Admin Service |
| `backend/src/routes/users.ts` | `apps/services/client/src/routes/users.ts` | Client Service |
| `backend/src/routes/billing.ts` | `apps/services/billing-service/src/routes/billing.ts` | Billing Service |
| `backend/src/routes/health.ts` | `apps/services/symptom-service/src/routes/health.ts` | Symptom Service |
| `backend/src/routes/medications.ts` | `apps/services/order-service/src/routes/medications.ts` | Order Service |

## 🔄 Import Path Changes

### Before
```typescript
import { UserProfile } from '@/types/api';
import { hashPassword } from '@/lib/password';
import { env } from '@/config/env';
```

### After
```typescript
import { UserProfile } from '@nova-health/types';
import { hashPassword } from '@nova-health/utils';
import { getServiceConfig } from '@nova-health/config';

const config = getServiceConfig();
const env = config.env;
```

## 🚀 Running Services

### Before
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### After
```bash
# Install dependencies (from root)
pnpm install

# Run all services
pnpm dev

# Run specific service
pnpm dev --filter=@nova-health/web
pnpm dev --filter=@nova-health/auth-service
```

## 📦 Package Dependencies

### Before
```json
{
  "name": "nova-health-backend",
  "dependencies": {
    "hono": "^4.12.9",
    "drizzle-orm": "^0.36.4",
    // ... other dependencies
  }
}
```

### After
```json
{
  "name": "@nova-health/auth-service",
  "dependencies": {
    "@nova-health/types": "workspace:*",
    "@nova-health/config": "workspace:*",
    "@nova-health/utils": "workspace:*",
    "@nova-health/database": "workspace:*",
    "hono": "^4.12.9"
  }
}
```

## 🔧 Configuration Changes

### Environment Variables

Environment variables are now managed centrally in the `@nova-health/config` package.

### Before
```typescript
import { env } from '@/config/env';

console.log(env.DATABASE_URL);
```

### After
```typescript
import { getServiceConfig } from '@nova-health/config';

const config = getServiceConfig();
console.log(config.database.url);
```

## 🗄️ Database Changes

### Before
```typescript
import { db } from '@/config/database';
```

### After
```typescript
import { getDatabase } from '@nova-health/database';
import { getServiceConfig } from '@nova-health/config';

const config = getServiceConfig();
const db = getDatabase(config.database.url);
```

## 📝 TypeScript Configuration

TypeScript now uses project references for better type checking across packages.

### Before
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### After
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@nova-health/types": ["../../../packages/types/src"],
      "@nova-health/config": ["../../../packages/config/src"],
      "@nova-health/utils": ["../../../packages/utils/src"],
      "@nova-health/database": ["../../../packages/database/src"]
    }
  },
  "references": [
    { "path": "../../../packages/types" },
    { "path": "../../../packages/config" },
    { "path": "../../../packages/utils" },
    { "path": "../../../packages/database" }
  ]
}
```

## 🧪 Testing

### Before
```bash
cd backend
npm test
```

### After
```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=@nova-health/auth-service
```

## 📚 Adding New Code

### Adding a New Service

1. Create a new directory under `apps/services/`
2. Create `package.json` with workspace dependencies
3. Create `tsconfig.json` with proper references
4. Create `src/index.ts` with service setup
5. Update root `tsconfig.json` to include the new service

### Adding to Shared Packages

1. Add code to the appropriate package (`packages/types`, `packages/utils`, etc.)
2. Export from the package's `index.ts`
3. Import in services using `@nova-health/package-name`

## 🐛 Common Issues & Solutions

### Issue: Cannot find module '@nova-health/types'

**Solution**: Make sure you've run `pnpm install` from the root directory.

### Issue: TypeScript errors about missing packages

**Solution**: Ensure all packages have proper `tsconfig.json` with project references.

### Issue: Port conflicts when running services

**Solution**: Each service uses a different port. Check the service's `index.ts` or update the `PORT` environment variable.

### Issue: Database connection errors

**Solution**: Ensure `DATABASE_URL` is set in your `.env` file and the database is accessible.

## 📖 Additional Resources

- [Turbo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

## 🤝 Need Help?

If you encounter issues during migration:

1. Check this guide for common solutions
2. Review the main [README.md](./README.md)
3. Open an issue on GitHub with details about your problem

## ✅ Migration Checklist

- [ ] Install pnpm (if not already installed)
- [ ] Run `pnpm install` from root
- [ ] Update import paths in your code
- [ ] Update environment variables
- [ ] Test each service individually
- [ ] Test the entire monorepo
- [ ] Update documentation
- [ ] Remove old `backend/` and `frontend/` directories (after verification)

## 🎉 Conclusion

Congratulations! You've successfully migrated to the new monorepo architecture. Enjoy the benefits of better code organization, improved maintainability, and faster development cycles.
