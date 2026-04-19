# Nova Health - Monorepo Architecture

A modern healthcare platform built with Turbo Repo, featuring a microservices architecture with shared packages for maximum code reusability and maintainability.

## 🏗️ Architecture Overview

This monorepo uses [Turbo](https://turbo.build/) to manage multiple applications and shared packages efficiently. The architecture follows a microservices pattern with clear separation of concerns.

### Directory Structure

```
nova-health/
├── apps/
│   ├── web/                          # Frontend React application
│   └── services/                     # Backend microservices
│       ├── admin/                     # Admin management service
│       ├── auth-service/              # Authentication & authorization
│       ├── client/                   # Client-facing API
│       ├── billing-service/           # Billing & invoicing
│       ├── payment-service/           # Payment processing
│       ├── sync-service/             # Data synchronization
│       ├── analytics-service/         # Analytics & reporting
│       ├── symptom-service/           # Symptom tracking
│       └── order-service/            # Order management
├── packages/                         # Shared packages
│   ├── types/                       # TypeScript types & interfaces
│   ├── config/                      # Configuration management
│   ├── utils/                       # Utility functions
│   └── database/                   # Database utilities
├── turbo.json                       # Turbo configuration
├── package.json                     # Root package.json
├── tsconfig.json                    # Root TypeScript config
└── pnpm-workspace.yaml             # PNPM workspace config
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

### Development

```bash
# Run all services in development mode
pnpm dev

# Run specific service
pnpm dev --filter=@nova-health/web
pnpm dev --filter=@nova-health/auth-service
```

### Building

```bash
# Build all packages and apps
pnpm build

# Build specific service
pnpm build --filter=@nova-health/web
```

## 📦 Packages

### @nova-health/types
Shared TypeScript types and interfaces used across all services.

**Exports:**
- API types (ApiResponse, ApiError, PaginationParams, etc.)
- Domain types (User, Appointment, Medication, etc.)
- Error classes (HttpError, ValidationError, etc.)
- Zod validators

### @nova-health/config
Configuration management with environment variable validation.

**Exports:**
- `loadEnv()` - Load and validate environment variables
- `getServiceConfig()` - Get service-specific configuration
- Environment schema validation

### @nova-health/utils
Common utility functions used across services.

**Exports:**
- Password hashing and verification
- JWT token generation and verification
- Validation utilities (email, phone, UUID)
- String utilities (slugify, truncate)
- Date utilities (formatDate, addDays, etc.)

### @nova-health/database
Database connection and utilities.

**Exports:**
- `getDatabase()` - Get database connection
- `checkDatabaseHealth()` - Health check utility
- `withTransaction()` - Transaction helper

## 🌐 Services

### Web App (`apps/web`)
Frontend React application built with Vite, React Router, and Tailwind CSS.

**Features:**
- User authentication and authorization
- Appointment management
- Medication tracking
- Family health management
- Billing and payments
- Health data visualization

**Tech Stack:**
- React 19
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- shadcn/ui

### Admin Service (`apps/services/admin`)
Administrative interface for managing users, roles, and permissions.

**Port:** 3001

### Auth Service (`apps/services/auth-service`)
Handles authentication, authorization, and user management.

**Port:** 3002

**Features:**
- User registration and login
- JWT token management
- Password reset
- Email verification
- Two-factor authentication

### Client Service (`apps/services/client`)
Client-facing API for user operations.

**Port:** 3003

**Features:**
- User profile management
- Appointment booking
- Medication management
- Health data tracking

### Billing Service (`apps/services/billing-service`)
Handles billing, invoicing, and subscription management.

**Port:** 3004

**Features:**
- Invoice generation
- Subscription management
- Payment method management
- Billing history

### Payment Service (`apps/services/payment-service`)
Processes payments and handles Stripe integration.

**Port:** 3005

**Features:**
- Payment processing
- Refunds
- Stripe webhooks
- Transaction history

### Sync Service (`apps/services/sync-service`)
Handles data synchronization between services.

**Port:** 3006

**Features:**
- Event-driven architecture
- Kafka integration
- Data consistency
- Cross-service communication

### Analytics Service (`apps/services/analytics-service`)
Provides analytics and reporting capabilities.

**Port:** 3007

**Features:**
- Health metrics
- Usage analytics
- Custom reports
- Dashboard data

### Symptom Service (`apps/services/symptom-service`)
Manages symptom tracking and vital signs.

**Port:** 3008

**Features:**
- Symptom logging
- Vital signs tracking
- Health trends
- AI-powered insights

### Order Service (`apps/services/order-service`)
Manages orders and prescriptions.

**Port:** 3009

**Features:**
- Order management
- Prescription tracking
- Order fulfillment
- Delivery status

## 🔧 Configuration

### Environment Variables

Each service requires specific environment variables. See `.env.example` for a complete list.

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `NODE_ENV` - Environment (development/production/test)

**Optional Variables:**
- `STRIPE_SECRET_KEY` - Stripe API key
- `SMTP_HOST` - Email server host
- `KAFKA_BROKERS` - Kafka broker addresses
- `REDIS_URL` - Redis connection string

### Service Ports

| Service | Port |
|---------|-------|
| Web | 3000 |
| Admin Service | 3001 |
| Auth Service | 3002 |
| Client Service | 3003 |
| Billing Service | 3004 |
| Payment Service | 3005 |
| Sync Service | 3006 |
| Analytics Service | 3007 |
| Symptom Service | 3008 |
| Order Service | 3009 |

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm test --filter=@nova-health/types
```

## 📝 Scripts

```bash
# Development
pnpm dev              # Start all services in dev mode
pnpm build            # Build all packages and apps
pnpm start            # Start all services in production mode

# Code Quality
pnpm lint             # Run linter
pnpm format           # Format code with Prettier
pnpm type-check       # Run TypeScript type checking

# Database
pnpm db:generate      # Generate database migrations
pnpm db:push         # Push migrations to database
pnpm db:studio       # Open Drizzle Studio
```

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript 5.8
- Vite 6
- Tailwind CSS 4
- React Router 7
- TanStack Query 5

### Backend
- Hono 4 (Web framework)
- TypeScript 5.8
- Drizzle ORM (Database)
- PostgreSQL (Database)
- Kafka (Message queue)
- Stripe (Payments)

### Infrastructure
- Turbo (Monorepo management)
- pnpm (Package manager)
- Docker (Containerization)

## 📚 Documentation

- [Backend Architecture](./doc/BACKEND-ARCHITECTURE.md)
- [Backend Plan](./doc/BACKEND-PLAN.md)
- [Frontend Feature Analysis](./doc/FRONTEND-FEATURE-ANALYSIS.md)
- [Project Plan](./doc/PLAN.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Turbo](https://turbo.build/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
