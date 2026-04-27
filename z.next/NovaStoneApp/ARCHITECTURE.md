# NovaStone Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React 19 + TypeScript + TailwindCSS                      │  │
│  │  - Zustand (State Management)                             │  │
│  │  - React Query (Data Fetching)                            │  │
│  │  - Better Auth Client                                     │  │
│  │  - Vite (Build Tool)                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Components:                                                      │
│  • Auth Pages (Login/SignUp)                                    │
│  • Dashboard                                                     │
│  • Customers Management                                          │
│  • Products/Services                                             │
│  • Invoices                                                      │
│  • Sales                                                         │
│  • Estimates                                                     │
│  • Purchases                                                     │
│  • Transactions                                                  │
│  • Reports                                                       │
│  • Settings                                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST API ↓
┌─────────────────────────────────────────────────────────────────┐
│                         Backend Layer                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Hono Web Framework + TypeScript                          │  │
│  │  - OpenAPI/Swagger Documentation                          │  │
│  │  - Zod Validation                                         │  │
│  │  - Better Auth Server                                     │  │
│  │  - JWT Token Management                                   │  │
│  │  - CORS & Security Middleware                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  API Routes:                                                      │
│  • /api/auth/*        - Authentication                          │
│  • /api/customers     - Customer CRUD                           │
│  • /api/products      - Product CRUD                            │
│  • /api/invoices      - Invoice Management                      │
│  • /api/sales         - Sales Tracking                          │
│  • /api/estimates     - Estimate/Quote Management               │
│  • /api/purchases     - Purchase Tracking                       │
│  • /api/transactions  - Transaction Management                  │
│  • /doc              - OpenAPI Specification                    │
│  • /ui               - Swagger UI                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Prisma ORM ↓
┌─────────────────────────────────────────────────────────────────┐
│                         Database Layer                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL 14+ with JSONB                                │  │
│  │  - ACID Transactions                                      │  │
│  │  - JSONB for Flexible Data                                │  │
│  │  - GIN Indexes for JSONB                                  │  │
│  │  - Full-text Search Support                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Data Models:                                                     │
│  • users, sessions, accounts                                    │
│  • customers (with JSONB: address, contacts, paymentInfo)      │
│  • products (with JSONB: pricing, inventory, variants)         │
│  • invoices (with JSONB: lineItems, payments, taxDetails)      │
│  • sales (with JSONB: lineItems, paymentTerms)                 │
│  • estimates, purchases, transactions                           │
│  • settings                                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 19
- **Language**: TypeScript 5.8
- **Styling**: TailwindCSS 4.1
- **State Management**: Zustand 5.0
- **Data Fetching**: React Query 5.99
- **Authentication**: Better Auth 1.6 (client)
- **Forms**: React Hook Form 7.73 + Zod 4.3
- **Animation**: Motion 12.23
- **Icons**: Lucide React 0.546
- **Build Tool**: Vite 6.2
- **i18n**: i18next 26.0

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Hono 4.7
- **Language**: TypeScript 5.8
- **ORM**: Prisma 6.3
- **Database**: PostgreSQL 14+
- **Authentication**: Better Auth 1.6 + JWT
- **Validation**: Zod 4.3
- **API Documentation**: OpenAPI 3.0 + Swagger UI
- **Security**: bcrypt, CORS, Helmet

### DevOps
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose
- **Database Admin**: pgAdmin 4
- **Version Control**: Git

## Data Flow

### Authentication Flow
```
1. User enters credentials → Frontend
2. Frontend sends POST /api/auth/sign-in → Backend
3. Backend validates credentials with Better Auth
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Subsequent requests include JWT in Authorization header
```

### API Request Flow
```
1. User action in UI → React Component
2. React Query hook triggers → API call
3. Request → Hono Server → Auth Middleware (verify JWT)
4. Route handler → Zod validation
5. Business logic → Prisma ORM
6. Database query (with JSONB support)
7. Response ← Database ← Prisma ← Hono ← Frontend
8. UI updates with new data
```

## JSONB Usage Strategy

### Why JSONB?
1. **Flexibility**: Store complex nested objects without rigid schema
2. **Performance**: Binary format with GIN indexing
3. **Developer Experience**: Easy to add features without migrations
4. **Multi-tenancy**: Different users can have different field requirements

### JSONB Fields
- **Customer**: address, contacts, paymentInfo, customFields
- **Product**: pricing (tiers, discounts), inventory, variants, categories
- **Invoice**: lineItems, payments, taxDetails, reminders
- **Sale**: lineItems, paymentTerms, customerInfo
- **Transaction**: tags, relatedTo, account, attachments

## Security Features

### Authentication & Authorization
- ✅ Better Auth for session management
- ✅ JWT tokens with configurable expiration
- ✅ Bcrypt password hashing
- ✅ Auth middleware on protected routes
- ✅ CORS configuration
- ✅ Email verification support

### Data Protection
- ✅ Zod schema validation
- ✅ SQL injection protection (Prisma)
- ✅ XSS prevention
- ✅ HTTPS in production
- ✅ Secure headers (Helmet)

## Scalability Considerations

### Database
- JSONB with GIN indexes for fast queries
- Connection pooling via Prisma
- Efficient pagination support
- Query optimization

### API
- Lightweight Hono framework (fast startup)
- Stateless JWT authentication
- Horizontal scaling ready
- Rate limiting (can be added)

### Frontend
- Code splitting with React.lazy
- Optimistic UI updates
- React Query caching
- Lazy loading images

## Development Workflow

### Setup
```bash
# Backend
cd server
pnpm install
cp .env.example .env
docker-compose up -d  # Start PostgreSQL
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev

# Frontend
cd client
pnpm install
pnpm dev
```

### Database Changes
```bash
# 1. Edit prisma/schema.prisma
# 2. Generate Prisma Client
pnpm db:generate

# 3. Push to database (dev)
pnpm db:push

# 4. Or create migration (production)
pnpm db:migrate
```

### API Documentation
- Swagger UI: http://localhost:3000/ui
- OpenAPI spec: http://localhost:3000/doc
- Auto-generated from Zod schemas

## Deployment Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│  Load Balancer  │─────▶│  Frontend        │      │  CDN        │
│  (nginx)        │      │  (React/Vite)    │◀─────│  (Static)   │
└─────────────────┘      └──────────────────┘      └─────────────┘
        │
        │
        ▼
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│  API Gateway    │─────▶│  Backend API     │─────▶│  PostgreSQL │
│  (optional)     │      │  (Hono)          │      │  (Primary)  │
└─────────────────┘      └──────────────────┘      └─────────────┘
                                 │                         │
                                 │                         ▼
                                 │                  ┌─────────────┐
                                 │                  │  PostgreSQL │
                                 │                  │  (Replica)  │
                                 │                  └─────────────┘
                                 ▼
                         ┌──────────────────┐
                         │  Redis Cache     │
                         │  (optional)      │
                         └──────────────────┘
```

## Key Features

### Business Features
- ✅ Multi-user authentication
- ✅ Customer relationship management
- ✅ Product/service catalog
- ✅ Invoice generation & tracking
- ✅ Sales pipeline management
- ✅ Estimate/quote creation
- ✅ Purchase order tracking
- ✅ Transaction recording
- ✅ Flexible custom fields per entity
- ✅ Payment tracking & reminders

### Technical Features
- ✅ RESTful API design
- ✅ OpenAPI documentation
- ✅ Type-safe end-to-end (TypeScript)
- ✅ JSONB for flexible schema
- ✅ Database seeding
- ✅ Error handling & validation
- ✅ CORS & security headers
- ✅ JWT authentication
- ✅ Hot reload development

## Performance Metrics

### Target Performance
- API Response Time: < 100ms (avg)
- Database Query Time: < 50ms (avg)
- Frontend Load Time: < 2s
- Time to Interactive: < 3s

### Optimization Strategies
- Database indexing (especially JSONB GIN indexes)
- React Query caching
- Prisma query optimization
- Code splitting
- Image optimization
- Compression (gzip/brotli)

## Future Enhancements

### Planned Features
- [ ] Real-time notifications (WebSocket)
- [ ] File upload & management (S3/CloudFlare R2)
- [ ] Batch operations
- [ ] Export to PDF/CSV
- [ ] Email integration (SendGrid/Resend)
- [ ] Webhooks for integrations
- [ ] Advanced reporting & analytics
- [ ] Multi-currency support
- [ ] Tax calculation engine
- [ ] Recurring invoices
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Mobile app (React Native)
- [ ] AI-powered insights

### Infrastructure
- [ ] Redis caching layer
- [ ] Rate limiting
- [ ] API versioning
- [ ] Database replication
- [ ] Monitoring & logging (DataDog/Sentry)
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Load testing
- [ ] Backup automation

## Conclusion

NovaStone is built with modern, scalable technologies that provide:
- **Developer Experience**: TypeScript, hot reload, type safety
- **Performance**: Fast framework (Hono), efficient queries, caching
- **Flexibility**: JSONB fields, custom fields, extensible architecture
- **Security**: JWT, password hashing, validation, CORS
- **Maintainability**: Clear structure, documentation, OpenAPI

The combination of PostgreSQL JSONB with a typed ORM (Prisma) provides the best of both worlds: the flexibility of NoSQL with the reliability and querying power of SQL.
