# Quick Start Guide

Get up and running with the Nova Health monorepo in minutes.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0

### Installing pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm
```

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nova-health
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all packages and applications.

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

### Required Environment Variables

```env
# Node Environment
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nova_health

# JWT
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Ports (optional, defaults shown)
PORT=3000
```

### Optional Environment Variables

```env
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
EMAIL_FROM=noreply@novahealth.com

# Kafka (for sync service)
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=nova-health
KAFKA_GROUP_ID=nova-health-group

# Redis (for caching)
REDIS_URL=redis://localhost:6379
```

## 🎯 Running the Project

### Run All Services

```bash
pnpm dev
```

This will start:
- Frontend web app on port 3000
- All backend services on their respective ports

### Run Specific Service

```bash
# Frontend only
pnpm dev --filter=@nova-health/web

# Auth service only
pnpm dev --filter=@nova-health/auth-service

# Multiple services
pnpm dev --filter=@nova-health/web --filter=@nova-health/auth-service
```

## 🌐 Accessing Services

Once running, you can access:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Admin Service | http://localhost:3001 |
| Auth Service | http://localhost:3002 |
| Client Service | http://localhost:3003 |
| Billing Service | http://localhost:3004 |
| Payment Service | http://localhost:3005 |
| Sync Service | http://localhost:3006 |
| Analytics Service | http://localhost:3007 |
| Symptom Service | http://localhost:3008 |
| Order Service | http://localhost:3009 |

### Health Checks

Each service has a health check endpoint:

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
# ... etc
```

## 🔧 Common Tasks

### Building the Project

```bash
# Build all packages and apps
pnpm build

# Build specific service
pnpm build --filter=@nova-health/web
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=@nova-health/types
```

### Type Checking

```bash
# Type check all packages
pnpm type-check

# Type check specific service
pnpm type-check --filter=@nova-health/auth-service
```

### Linting

```bash
# Lint all packages
pnpm lint

# Lint specific service
pnpm lint --filter=@nova-health/web
```

### Database Operations

```bash
# Generate migrations
pnpm db:generate

# Push migrations to database
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

## 🏗️ Project Structure

```
nova-health/
├── apps/
│   ├── web/                    # Frontend React app
│   └── services/               # Backend services
│       ├── admin/              # Admin management
│       ├── auth-service/       # Authentication
│       ├── client/             # Client API
│       ├── billing-service/     # Billing
│       ├── payment-service/     # Payments
│       ├── sync-service/       # Data sync
│       ├── analytics-service/   # Analytics
│       ├── symptom-service/    # Symptoms
│       └── order-service/      # Orders
├── packages/                   # Shared packages
│   ├── types/                 # TypeScript types
│   ├── config/                # Configuration
│   ├── utils/                 # Utilities
│   └── database/              # Database helpers
└── turbo.json                 # Turbo configuration
```

## 📚 Working with Packages

### Importing from Packages

```typescript
// Import types
import { UserProfile, ApiResponse } from '@nova-health/types';

// Import utilities
import { hashPassword, verifyToken } from '@nova-health/utils';

// Import config
import { getServiceConfig } from '@nova-health/config';

// Import database
import { getDatabase } from '@nova-health/database';
```

### Adding New Code to Packages

1. Navigate to the package directory (e.g., `packages/utils`)
2. Add your code to `src/`
3. Export from `src/index.ts`
4. Import in services using `@nova-health/package-name`

## 🐛 Troubleshooting

### Issue: `Cannot find module '@nova-health/types'`

**Solution**: Run `pnpm install` from the root directory.

### Issue: Port already in use

**Solution**: Either stop the process using the port or change the `PORT` environment variable.

### Issue: Database connection failed

**Solution**: 
1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Verify database exists and credentials are correct

### Issue: TypeScript errors

**Solution**: 
1. Run `pnpm install` to ensure all dependencies are installed
2. Run `pnpm type-check` to see specific errors
3. Ensure `tsconfig.json` files are properly configured

## 📖 Next Steps

1. **Read the Documentation**: Check out [README.md](./README.md) for detailed architecture information
2. **Explore the Code**: Browse through the services and packages to understand the structure
3. **Make Changes**: Start making changes to the codebase
4. **Run Tests**: Ensure your changes don't break existing functionality
5. **Build**: Build the project to ensure everything compiles correctly

## 🤝 Getting Help

- **Documentation**: [README.md](./README.md)
- **Migration Guide**: [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)
- **Issues**: Open an issue on GitHub

## 🎉 You're Ready!

You're now ready to start developing with the Nova Health monorepo. Happy coding! 🚀
