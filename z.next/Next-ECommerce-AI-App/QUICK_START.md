# Quick Start Guide

This guide will help you get the microservices e-commerce platform up and running quickly.

## Prerequisites

- **Node.js**: >= 18.x
- **pnpm**: 9.0.0 or higher
- **Docker**: For running Kafka/Redpanda cluster
- **PostgreSQL**: For product database
- **MongoDB**: For order database
- **Clerk Account**: For authentication ([Sign up here](https://clerk.com))
- **Stripe Account**: For payment processing ([Sign up here](https://stripe.com))

---

## Installation Steps

### 1. Clone the Repository

```bash
cd /path/to/your/workspace
# Repository should already be cloned
cd microservices-ecommerce-main
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all services and packages in the monorepo.

---

### 3. Start Kafka/Redpanda Cluster

```bash
cd packages/kafka
docker-compose up -d
```

**Verify Kafka is running**:
- Kafka UI: http://localhost:8080
- Redpanda brokers: localhost:9094, localhost:9095, localhost:9096

---

### 4. Setup Databases

#### PostgreSQL (Product Database)

1. Create a PostgreSQL database:
```bash
createdb ecommerce_products
```

2. Set up environment variable in `packages/product-db/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_products"
```

3. Run migrations:
```bash
cd packages/product-db
pnpm db:migrate
```

#### MongoDB (Order Database)

1. Ensure MongoDB is running locally or use MongoDB Atlas

2. Set up environment variable in `apps/order-service/.env`:
```env
MONGODB_URI="mongodb://localhost:27017/ecommerce_orders"
# Or for MongoDB Atlas:
# MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/ecommerce_orders"
```

---

### 5. Configure Clerk Authentication

1. Create a Clerk application at https://dashboard.clerk.com

2. Get your API keys from the Clerk dashboard

3. Add Clerk keys to each service's `.env` file:

**Auth Service** (`apps/auth-service/.env`):
```env
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
KAFKA_BROKER=localhost:9094
```

**Product Service** (`apps/product-service/.env`):
```env
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_products"
KAFKA_BROKER=localhost:9094
```

**Order Service** (`apps/order-service/.env`):
```env
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
MONGODB_URI="mongodb://localhost:27017/ecommerce_orders"
KAFKA_BROKER=localhost:9094
```

**Payment Service** (`apps/payment-service/.env`):
```env
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
KAFKA_BROKER=localhost:9094
```

**Client App** (`apps/client/.env.local`):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:8001
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8002
```

**Admin App** (`apps/admin/.env.local`):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8003
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:8001
```

---

### 6. Configure Stripe

1. Get your Stripe API keys from https://dashboard.stripe.com/test/apikeys

2. Add to `apps/payment-service/.env`:
```env
STRIPE_SECRET_KEY=sk_test_xxxxx
```

3. Setup Stripe webhook (for local development):
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local payment service
stripe listen --forward-to localhost:8002/webhooks/stripe
```

4. Copy the webhook signing secret and add to `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

### 7. Configure Email Service

Add email configuration to `apps/email-service/.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
KAFKA_BROKER=localhost:9094
```

**For Gmail**:
- Enable 2-factor authentication
- Generate an app password: https://myaccount.google.com/apppasswords

---

### 8. Start All Services

From the root directory:

```bash
pnpm dev
```

This will start all services concurrently:
- Client App: http://localhost:3002
- Admin App: http://localhost:3003
- Product Service: http://localhost:8000
- Order Service: http://localhost:8001
- Payment Service: http://localhost:8002
- Auth Service: http://localhost:8003
- Email Service: (no HTTP server, Kafka consumer only)

---

### 9. Start Individual Services (Optional)

If you prefer to start services individually:

```bash
# Backend services
pnpm dev --filter=auth-service
pnpm dev --filter=product-service
pnpm dev --filter=order-service
pnpm dev --filter=payment-service
pnpm dev --filter=email-service

# Frontend apps
pnpm dev --filter=client
pnpm dev --filter=admin
```

---

## Verification

### Check Service Health

```bash
# Auth Service
curl http://localhost:8003/health

# Product Service
curl http://localhost:8000/health

# Order Service
curl http://localhost:8001/health

# Payment Service
curl http://localhost:8002/health
```

All should return:
```json
{
  "status": "ok",
  "uptime": <seconds>,
  "timestamp": <timestamp>
}
```

### Check Kafka UI

Visit http://localhost:8080 to see:
- Kafka cluster status
- Topics created
- Consumer groups
- Messages

---

## Initial Data Setup

### Create Categories

Use the admin app or API to create product categories:

```bash
curl -X POST http://localhost:8000/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-token>" \
  -d '{
    "name": "Electronics",
    "slug": "electronics"
  }'
```

### Create Products

```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-token>" \
  -d '{
    "name": "Laptop",
    "shortDescription": "High-performance laptop",
    "description": "A powerful laptop for professionals",
    "price": 99999,
    "sizes": ["13-inch", "15-inch"],
    "colors": ["Silver", "Space Gray"],
    "images": {"main": "url", "gallery": []},
    "categorySlug": "electronics"
  }'
```

---

## Common Issues & Solutions

### Issue: Kafka connection failed

**Solution**:
```bash
# Check if Redpanda is running
docker ps | grep redpanda

# Restart Kafka cluster
cd packages/kafka
docker-compose down
docker-compose up -d
```

### Issue: Database connection error

**Solution**:
- Verify PostgreSQL/MongoDB is running
- Check connection strings in `.env` files
- Ensure databases are created

### Issue: Clerk authentication not working

**Solution**:
- Verify API keys are correct
- Check if keys match between frontend and backend
- Ensure `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set

### Issue: Stripe webhook not receiving events

**Solution**:
```bash
# Make sure Stripe CLI is forwarding webhooks
stripe listen --forward-to localhost:8002/webhooks/stripe

# Check webhook secret matches in .env
```

### Issue: Email not sending

**Solution**:
- Verify email service is running
- Check SMTP credentials
- Look for Kafka consumer connection logs
- Verify `user.created` and `order.created` topics exist

---

## Development Workflow

### Making Changes

1. **Edit code** in any service or package
2. **Hot reload** will automatically restart the service
3. **Type check** across all services:
   ```bash
   pnpm check-types
   ```

### Adding Dependencies

```bash
# Add to specific service
pnpm add <package> --filter=product-service

# Add to workspace root
pnpm add -w <package>
```

### Database Migrations

**Product Database (Prisma)**:
```bash
cd packages/product-db

# Create migration
pnpm db:migrate

# Generate Prisma client
pnpm db:generate
```

**Order Database (Mongoose)**:
- Schema changes are automatic
- No migration system needed

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific service
pnpm test --filter=order-service
```

---

## Production Deployment

### Build All Services

```bash
pnpm build
```

### Environment Variables

Ensure all production environment variables are set:
- Use production Clerk keys
- Use production Stripe keys
- Use production database URLs
- Use production Kafka brokers
- Use production email credentials

### Database Migrations

```bash
# Product database
cd packages/product-db
pnpm db:deploy
```

### Docker Deployment (Optional)

Each service can be containerized:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

---

## Useful Commands

```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Build all services
pnpm build

# Type check
pnpm check-types

# Lint code
pnpm lint

# Format code
pnpm format

# Clean build artifacts
pnpm clean

# Update dependencies
pnpm update

# Check for outdated packages
pnpm outdated
```

---

## Next Steps

1. **Explore the Admin Dashboard**: http://localhost:3003
   - Create products and categories
   - View orders and analytics

2. **Test the Client App**: http://localhost:3002
   - Browse products
   - Add items to cart
   - Complete checkout

3. **Monitor Kafka**: http://localhost:8080
   - Watch events flow through the system
   - Debug message consumption

4. **Read Full Documentation**: See `PROJECT_DOCUMENTATION.md` for detailed architecture information

---

## Getting Help

- Check `PROJECT_DOCUMENTATION.md` for architecture details
- Review service-specific README files (if available)
- Check logs for error messages
- Verify all environment variables are set correctly
- Ensure all prerequisites are installed and running

Happy coding! 🚀
