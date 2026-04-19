# Nova-Health Backend Architecture

## Overview

A modern, high-performance backend API built with Node.js, Hono, TypeScript, PostgreSQL with Drizzle ORM, and JSONB optimization for flexible data storage.

## Technology Stack

### Core Technologies
- **Runtime:** Node.js 20+ (LTS)
- **Framework:** Hono 4.x (Ultra-fast web framework)
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL 16+
- **ORM:** Drizzle ORM 0.30+
- **Validation:** Zod 4.x
- **Authentication:** JWT (JSON Web Tokens)
- **HTTP Server:** Hono's built-in server

### Why This Stack?

1. **Hono** - 2x faster than Express, built for edge computing
   - Minimal overhead
   - Native TypeScript support
   - Built-in middleware support
   - Excellent for serverless/edge deployments

2. **Drizzle ORM** - Type-safe, performant ORM
   - Zero runtime overhead (compiled to SQL)
   - Excellent TypeScript integration
   - Supports PostgreSQL JSONB natively
   - Migration system included
   - Query builder pattern

3. **PostgreSQL JSONB** - Flexible schema with relational performance
   - Store complex nested data without table proliferation
   - Queryable with GIN indexes
   - Perfect for form data, preferences, settings
   - Matches frontend Zustand store structure

4. **Zod** - Runtime type validation
   - TypeScript-first schema validation
   - Zero dependencies
   - Excellent error messages
   - Works seamlessly with Drizzle

## Architecture Diagram

```mermaid
graph TB
    subgraph Client[Client Layer]
        FE[React Frontend]
        MF[Mobile Apps]
    end

    subgraph API[API Layer]
        Hono[Hono Server]
        CORS[CORS Middleware]
        Auth[JWT Auth]
        Rate[Rate Limiting]
        Logger[Request Logging]
    end

    subgraph Business[Business Logic Layer]
        Routes[API Routes]
        Services[Business Services]
        Validators[Zod Validation]
    end

    subgraph Data[Data Access Layer]
        Drizzle[Drizzle ORM]
        Postgres[(PostgreSQL Database]
        Redis[(Redis Cache - Optional)]
    end

    FE -->|HTTPS|Hono
    MF -->|HTTPS|Hono

    Hono --> CORS
    Hono --> Auth
    Hono --> Rate
    Hono --> Logger

    CORS --> Routes
    Auth --> Routes
    Rate --> Routes
    Logger --> Routes

    Routes --> Services
    Routes --> Validators
    Routes --> Drizzle

    Services --> Drizzle
    Validators --> Drizzle

    Drizzle --> Postgres
    Drizzle --> Redis
```

## Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── config/                  # Configuration files
│   │   ├── database.ts           # Database connection
│   │   ├── env.ts                # Environment variables
│   │   └── jwt.ts                # JWT configuration
│   ├── db/                      # Database layer
│   │   ├── schema/              # Drizzle schemas
│   │   │   ├── users.ts
│   │   │   ├── appointments.ts
│   │   │   ├── medications.ts
│   │   │   ├── family.ts
│   │   │   ├── billing.ts
│   │   │   ├── communications.ts
│   │   │   └── index.ts
│   │   ├── migrations/           # Database migrations
│   │   └── seed/                # Seed data
│   ├── lib/                     # Utility libraries
│   │   ├── auth.ts              # JWT utilities
│   │   ├── password.ts           # Password hashing
│   │   ├── jsonb.ts             # JSONB helpers
│   │   └── validators.ts         # Zod schemas
│   ├── middleware/              # Hono middleware
│   │   ├── auth.ts              # Authentication middleware
│   │   ├── cors.ts              # CORS middleware
│   │   ├── error.ts             # Error handling
│   │   └── rate-limit.ts         # Rate limiting
│   ├── routes/                  # API routes
│   │   ├── index.ts             # Route aggregation
│   │   ├── auth/                # Authentication routes
│   │   ├── users/               # User management
│   │   ├── appointments/        # Appointments
│   │   ├── medications/         # Medications
│   │   ├── family/              # Family management
│   │   ├── billing/             # Billing & payments
│   │   ├── communications/       # Chat & notifications
│   │   ├── documents/           # Medical documents
│   │   ├── vitals/             # Health vitals
│   │   ├── health-plans/        # Health plans
│   │   ├── habits/              # Habit tracking
│   │   ├── challenges/           # Family challenges
│   │   ├── support/             # Support tickets
│   │   └── admin/               # Admin dashboard
│   ├── services/                # Business logic
│   │   ├── auth.service.ts      # Authentication logic
│   │   ├── user.service.ts      # User operations
│   │   ├── appointment.service.ts
│   │   ├── medication.service.ts
│   │   └── ...
│   └── types/                   # TypeScript types
│       ├── api.ts               # API response types
│       ├── errors.ts            # Error types
│       └── index.ts
├── tests/                     # Test files
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                  # End-to-end tests
├── drizzle.config.ts           # Drizzle configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema Strategy

### JSONB Optimization

The database uses **PostgreSQL JSONB columns** for flexible, nested data storage while maintaining relational integrity and queryability.

#### When to Use JSONB:
1. **Form Data** - Profile settings, preferences, health plans
2. **Nested Structures** - Medication interactions, notification actions
3. **Variable Schemas** - Different data shapes per record
4. **Queryable Fields** - Data that needs filtering/indexing
5. **Frontend Alignment** - Matches Zustand store structure

#### When to Use Relational Columns:
1. **Foreign Keys** - Relationships between tables
2. **Indexed Fields** - Frequently queried data
3. **Date/Time** - Time-series data
4. **Status Fields** - Boolean/enum status flags
5. **IDs** - Primary and foreign keys

### JSONB Schema Validation

All JSONB columns are validated using Zod schemas:
```typescript
// Example: users.profile_data
const profileDataSchema = z.object({
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  height: z.string(),
  weight: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default('US')
  }),
  memberSince: z.string()
});

// Validate before insert
const validatedData = profileDataSchema.parse(jsonData);
```

### JSONB Querying

Using PostgreSQL's JSONB operators for efficient queries:
```sql
-- Query nested JSONB field
SELECT * FROM users
WHERE profile_data ->> 'bloodType' = 'O+';

-- GIN index for JSONB array queries
CREATE INDEX idx_users_preferences
ON users USING GIN ((preferences -> 'notifications'));

-- JSONB aggregation
SELECT
  jsonb_agg_key(profile_data, 'bloodType') as blood_type_count
FROM users
GROUP BY jsonb_agg_key(profile_data, 'bloodType');
```

## Authentication Strategy

### JWT Implementation

```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;  // Issued at
  exp: number;  // Expires at
}

// Access Token (15 minutes)
const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });

// Refresh Token (7 days)
const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
```

### Auth Middleware Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as Database

    C->>S: 1. Login Request
    S->>DB: 2. Validate Credentials
    DB-->>S: 3. User Found
    S->>S: 4. Generate JWTs
    S->>C: 5. Return Tokens
    C->>S: 6. API Request (with Access Token)
    S->>S: 7. Verify JWT
    S->>DB: 8. Fetch User Data
    DB-->>S: 9. Return Data
    S->>C: 10. API Response
```

## API Design Principles

### RESTful Conventions

1. **Resource Naming:** Plural nouns (`/users`, `/appointments`)
2. **HTTP Methods:**
   - GET: Retrieve resources
   - POST: Create resources
   - PUT: Update entire resource
   - PATCH: Partial updates
   - DELETE: Remove resources
3. **Status Codes:**
   - 200: Success
   - 201: Created
   - 400: Bad Request (validation error)
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 409: Conflict
   - 422: Unprocessable Entity
   - 429: Too Many Requests (rate limit)
   - 500: Internal Server Error
4. **Pagination:** `?page=1&limit=20`
5. **Filtering:** `?status=active&sort=created_at:desc`
6. **Versioning:** `/api/v1/...`

### Response Format

```typescript
// Success Response
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Response
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Security Measures

### 1. Authentication & Authorization
- JWT with short-lived access tokens (15 min)
- Refresh tokens for long-term sessions (7 days)
- Role-based access control (client, support, manager, admin)
- Password hashing with bcrypt (cost factor 12)

### 2. Input Validation
- Zod schemas for all inputs
- SQL injection prevention (Drizzle parameterized queries)
- XSS protection (Hono built-in sanitization)
- File upload validation (type, size, content)

### 3. Rate Limiting
- Per-IP rate limiting
- Per-user rate limiting
- Different limits by endpoint type
- Redis-backed for distributed systems

### 4. CORS Configuration
- Whitelist frontend origins
- Allow specific methods (GET, POST, PUT, DELETE)
- Expose only necessary headers

### 5. Security Headers
```typescript
app.use('*', async (c, next) => {
  c.header('X-Content-Type-Options', 'application/json');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header('X-XSS-Protection', '1; mode=block');
  await next();
});
```

## Performance Optimization

### 1. Database Level
- **GIN Indexes** on JSONB columns for fast queries
- **Composite Indexes** on frequently queried columns
- **Connection Pooling** with pg (node-postgres)
- **Prepared Statements** via Drizzle query builder

### 2. Application Level
- **Response Caching** with Redis (optional)
- **Query Result Caching** for frequently accessed data
- **Lazy Loading** for large datasets
- **Pagination** for all list endpoints

### 3. JSONB Optimization
```sql
-- Create GIN index for JSONB queries
CREATE INDEX idx_users_profile_data
ON users USING GIN (profile_data);

-- Query with JSONB path
SELECT id, email, profile_data
FROM users
WHERE profile_data @> '{bloodType, address}' @> '{"bloodType": "O+"}';

-- Efficient JSONB aggregation
SELECT
  user_id,
  jsonb_path_query_first(profile_data, '$.notifications.email') as email_notif,
  jsonb_path_query_first(profile_data, '$.notifications.sms') as sms_notif
FROM users
WHERE is_active = true;
```

## Error Handling Strategy

### Global Error Handler

```typescript
app.onError((err, c) => {
  console.error('API Error:', err);

  // Zod validation errors
  if (err instanceof z.ZodError) {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: err.errors
      }
    }, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return c.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token'
      }
    }, 401);
  }

  // Database errors
  if (err.code === '23505') { // Unique violation
    return c.json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'Resource already exists'
      }
    }, 409);
  }

  // Default error
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  }, 500);
});
```

## API Endpoints Overview

### Authentication (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh` - Refresh access token
- `POST /forgot-password` - Initiate password reset
- `POST /reset-password` - Complete password reset
- `POST /verify-email` - Verify email address

### Users (`/api/v1/users`)
- `GET /me` - Get current user profile
- `PATCH /me` - Update current user profile
- `GET /me/emergency-contacts` - Get emergency contacts
- `POST /me/emergency-contacts` - Add emergency contact
- `PATCH /me/emergency-contacts/:id` - Update emergency contact
- `DELETE /me/emergency-contacts/:id` - Remove emergency contact

### Appointments (`/api/v1/appointments`)
- `GET /` - List appointments (paginated, filterable)
- `POST /` - Create appointment
- `GET /:id` - Get appointment details
- `PATCH /:id` - Update appointment
- `DELETE /:id` - Cancel appointment

### Medications (`/api/v1/medications`)
- `GET /` - List medications
- `POST /` - Add medication
- `GET /:id` - Get medication details
- `PATCH /:id` - Update medication
- `DELETE /:id` - Delete medication
- `POST /:id/toggle` - Toggle medication taken status
- `GET /:id/interactions` - Get drug interactions
- `GET /:id/history` - Get medication history

### Family (`/api/v1/family`)
- `GET /members` - List family members
- `POST /members` - Add family member
- `GET /members/:id` - Get member details
- `PATCH /members/:id` - Update member
- `DELETE /members/:id` - Remove member
- `POST /invitations` - Send family invitation
- `GET /invitations` - List invitations
- `POST /invitations/:id/accept` - Accept invitation
- `POST /invitations/:id/decline` - Decline invitation
- `GET /challenges` - List family challenges
- `POST /challenges` - Create challenge

### Billing (`/api/v1/billing`)
- `GET /subscription` - Get current subscription
- `POST /subscription` - Create/update subscription
- `GET /payment-methods` - List payment methods
- `POST /payment-methods` - Add payment method
- `DELETE /payment-methods/:id` - Remove payment method
- `GET /invoices` - List invoices
- `POST /invoices/:id/pay` - Pay invoice
- `GET /transactions` - List transactions
- `POST /payment-methods/ach/verify` - Verify ACH account
- `POST /payment-methods/card/verify` - Verify card

### Communications (`/api/v1/communications`)
- `GET /conversations` - List conversations
- `POST /conversations` - Create conversation
- `GET /conversations/:id/messages` - Get messages
- `POST /conversations/:id/messages` - Send message
- `GET /notifications` - List notifications
- `PATCH /notifications/:id/read` - Mark notification read
- `PATCH /notifications/read-all` - Mark all read
- `GET /documents` - List documents
- `POST /documents` - Upload document
- `DELETE /documents/:id` - Delete document

### Health Data (`/api/v1/health`)
- `GET /vitals` - List vital readings
- `POST /vitals` - Log vital reading
- `GET /vitals/latest` - Get latest readings
- `GET /symptoms` - List symptoms
- `POST /symptoms` - Log symptom
- `GET /health-plans` - Get health plans
- `POST /health-plans` - Create/update plan
- `GET /activity-logs` - List activity
- `POST /activity-logs` - Log activity
- `GET /sleep-records` - List sleep records
- `POST /sleep-records` - Log sleep

### Support (`/api/v1/support`)
- `GET /tickets` - List support tickets
- `POST /tickets` - Create ticket
- `GET /tickets/:id` - Get ticket details
- `PATCH /tickets/:id` - Update ticket
- `POST /tickets/:id/messages` - Add message to ticket

### Admin (`/api/v1/admin`)
- `GET /users` - List all users (admin only)
- `GET /users/:id` - Get user details
- `PATCH /users/:id` - Update user (admin)
- `GET /security-logs` - List security logs
- `GET /system-alerts` - List system alerts
- `GET /access-requests` - List access requests
- `PATCH /access-requests/:id/approve` - Approve request
- `GET /metrics` - Get system metrics

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nova_health
DATABASE_POOL_SIZE=10

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Optional: Redis
REDIS_URL=redis://localhost:6379

# Optional: File Upload
MAX_FILE_SIZE=10485760  # 100MB
UPLOAD_DIR=./uploads
```

## Development Workflow

### 1. Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run database migrations
npm run db:push

# Seed database (optional)
npm run db:seed
```

### 2. Development
```bash
# Start development server
npm run dev

# Run tests
npm run test
npm run test:watch

# Type checking
npm run type-check
```

### 3. Database Management
```bash
# Generate migration
npm run db:generate

# Push migrations
npm run db:push

# Pull migrations (for production)
npm run db:pull

# Studio (database GUI)
npm run db:studio
```

## Testing Strategy

### Unit Tests
- Test business logic in services
- Mock database calls
- Test validation schemas
- Test utility functions

### Integration Tests
- Test API endpoints with real database
- Test database operations
- Test authentication flow

### E2E Tests
- Test critical user flows
- Test error scenarios
- Performance testing

## Deployment Considerations

### 1. Platform Options
- **Vercel** - Serverless functions (Hono optimized)
- **Railway** - Container deployment with PostgreSQL
- **Render** - Full-stack deployment
- **AWS Lambda** - Serverless with API Gateway
- **DigitalOcean App Platform** - Container deployment

### 2. Performance
- Enable HTTP/2
- Use CDN for static assets
- Implement response compression
- Database connection pooling
- Enable query caching

### 3. Monitoring
- Application performance monitoring (APM)
- Error tracking (Sentry)
- Database query monitoring
- Uptime monitoring

## Next Steps

1. Initialize project structure
2. Set up Drizzle ORM with PostgreSQL
3. Create database schemas with JSONB optimization
4. Implement authentication system with JWT
5. Create API routes for all features
6. Implement middleware (CORS, auth, rate limiting, error handling)
7. Add comprehensive validation with Zod
8. Write tests for all endpoints
9. Create API documentation (OpenAPI/Swagger)
10. Set up CI/CD pipeline
