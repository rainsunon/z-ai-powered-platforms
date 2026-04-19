# Nova Health Backend API

A modern, type-safe backend API for the Nova Health healthcare management platform, built with Node.js, Hono, TypeScript, PostgreSQL, and Drizzle ORM.

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Hono 4.x (Ultra-fast web framework)
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16+
- **ORM**: Drizzle ORM 0.30+ (Type-safe, zero runtime overhead)
- **Validation**: Zod 4.x
- **Authentication**: JWT (Access tokens + Refresh tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Vitest

## 📋 Features

- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Comprehensive API validation with Zod
- ✅ Rate limiting for security
- ✅ PostgreSQL JSONB optimization for flexible data storage
- ✅ Type-safe database operations with Drizzle ORM
- ✅ Error handling middleware
- ✅ CORS support
- ✅ Request logging

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Database connection setup
│   │   ├── env.ts        # Environment variables
│   │   └── jwt.ts        # JWT token utilities
│   ├── db/               # Database schemas and migrations
│   │   └── schema/       # Drizzle ORM schemas
│   ├── lib/              # Utility libraries
│   │   ├── jsonb.ts      # JSONB helper functions
│   │   ├── password.ts   # Password hashing
│   │   └── validators.ts # Zod validation schemas
│   ├── middleware/       # Express/Hono middleware
│   │   ├── auth.ts       # Authentication middleware
│   │   ├── cors.ts       # CORS configuration
│   │   ├── error.ts      # Error handling
│   │   ├── rateLimit.ts  # Rate limiting
│   │   └── validation.ts # Request validation
│   ├── routes/           # API route handlers
│   │   ├── auth.ts       # Authentication routes
│   │   ├── users.ts      # User management
│   │   ├── appointments.ts
│   │   ├── medications.ts
│   │   ├── family.ts
│   │   ├── billing.ts
│   │   ├── health.ts
│   │   ├── communications.ts
│   │   ├── support.ts
│   │   └── admin.ts
│   ├── types/            # TypeScript type definitions
│   │   ├── api.ts        # API response types
│   │   └── errors.ts     # Error classes
│   └── index.ts          # Application entry point
├── drizzle/              # Generated database migrations
├── .env.example          # Environment variables template
├── drizzle.config.ts      # Drizzle ORM configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 16 or higher
- npm or pnpm

### Setup Steps

1. **Clone the repository and navigate to the backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nova_health

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Optional: File upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Optional: Email service (for verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@novahealth.com

# Optional: Stripe for payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

4. **Set up the database**

Create a PostgreSQL database named `nova_health`:

```sql
CREATE DATABASE nova_health;
```

5. **Generate and run database migrations**

```bash
# Generate migrations from schema
npm run db:generate

# Push schema to database (development only)
npm run db:push

# Or run migrations (production)
npm run db:migrate
```

6. **Start the development server**

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Base URL

```
http://localhost:3001/api
```

### Health Check

```
GET /health
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification-token"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "newPassword": "NewSecurePass123!"
}
```

### User Endpoints (Protected)

All user endpoints require authentication via JWT token in the `Authorization` header:

```
Authorization: Bearer <access-token>
```

#### Get Current User
```http
GET /api/users/me
```

#### Update Profile
```http
PUT /api/users/me/profile
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "+1234567890"
}
```

#### Update Security Settings
```http
PUT /api/users/me/security
Content-Type: application/json

{
  "twoFactorEnabled": true
}
```

#### Update Preferences
```http
PUT /api/users/me/preferences
Content-Type: application/json

{
  "language": "en",
  "timezone": "UTC",
  "theme": "dark",
  "notifications": {
    "email": true,
    "sms": false,
    "push": true
  }
}
```

#### Get Emergency Contacts
```http
GET /api/users/me/emergency-contacts
```

#### Add Emergency Contact
```http
POST /api/users/me/emergency-contacts
Content-Type: application/json

{
  "name": "Jane Doe",
  "relationship": "Spouse",
  "phoneNumber": "+1234567890",
  "email": "jane@example.com",
  "isPrimary": true
}
```

### Other Feature Endpoints

The following endpoints are structured similarly but are currently placeholders:

- **Appointments**: `/api/appointments`
- **Medications**: `/api/medications`
- **Family**: `/api/family`
- **Billing**: `/api/billing`
- **Health**: `/api/health`
- **Communications**: `/api/communications`
- **Support**: `/api/support`
- **Admin**: `/api/admin` (Admin only)

## 🔒 Security Features

### Authentication
- JWT access tokens (15-minute expiry)
- JWT refresh tokens (7-day expiry)
- Password hashing with bcrypt (12 salt rounds)
- Account lockout after 5 failed login attempts (15-minute lock)

### Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Data operations: 30 requests per minute
- Read operations: 60 requests per minute

### CORS
- Configured to allow requests from frontend
- Credentials supported
- Proper headers exposed

### Validation
- All request bodies validated with Zod
- Type-safe validation
- Detailed error messages

## 🗄️ Database Schema

The database uses PostgreSQL with JSONB columns for flexible data storage:

### Core Tables
- `users` - User accounts and profiles
- `emergency_contacts` - Emergency contact information
- `refresh_tokens` - JWT refresh tokens

### Feature Tables
- `appointments` - Medical appointments
- `medications` - Medication management
- `medication_schedules` - Medication schedules
- `families` - Family groups
- `family_members` - Family member relationships
- `family_invitations` - Family invitations
- `payment_methods` - Payment methods
- `subscriptions` - User subscriptions
- `invoices` - Billing invoices
- `payment_transactions` - Payment records
- `vital_readings` - Health vital readings
- `symptoms` - Health symptoms
- `health_goals` - Health goals
- `health_records` - Health records
- `conversations` - Communication conversations
- `messages` - Chat messages
- `notifications` - User notifications
- `documents` - Document storage
- `support_tickets` - Support tickets
- `ticket_messages` - Support ticket messages
- `security_logs` - Security audit logs
- `system_alerts` - System alerts
- `access_requests` - Data access requests

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Building
npm run build            # Build for production

# Database
npm run db:generate      # Generate migrations from schema
npm run db:push         # Push schema to database (dev only)
npm run db:pull         # Pull schema from database
npm run db:studio       # Open Drizzle Studio (database GUI)
npm run db:seed         # Seed database with sample data

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Linting
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
```

## 🚢 Deployment

### Environment Variables

Ensure all required environment variables are set in production:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
```

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "nova-health-api" -- start

# View logs
pm2 logs nova-health-api

# Monitor
pm2 monit

# Restart
pm2 restart nova-health-api

# Stop
pm2 stop nova-health-api
```

### Using Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t nova-health-api .
docker run -p 3001:3001 --env-file .env nova-health-api
```

## 📝 JSONB Optimization

The backend extensively uses PostgreSQL JSONB for flexible data storage:

### Benefits
- Schema flexibility for evolving data structures
- Efficient querying with GIN indexes
- Type-safe access with Drizzle ORM
- Reduced need for migrations

### Query Examples

```typescript
// Query JSONB field
const user = await db
  .select()
  .from(users)
  .where(eq(users.profileData->>'firstName', 'John'));

// Update JSONB field
await db
  .update(users)
  .set({
    profileData: sql`${users.profileData} || ${JSON.stringify({ age: 30 })}`
  })
  .where(eq(users.id, userId));
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.

## 🔗 Related Projects

- [Nova Health Frontend](../frontend) - React-based frontend application
- [Backend Architecture Documentation](../doc/BACKEND-ARCHITECTURE.md) - Detailed architecture documentation
