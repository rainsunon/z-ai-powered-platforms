# Microservices E-Commerce Platform

A modern, scalable e-commerce platform built with **microservices architecture** using **Turborepo** monorepo management.

## 🚀 Overview

This project demonstrates a production-ready microservices architecture with:

- **7 Independent Services**: Auth, Product, Order, Payment, Email, Client, and Admin
- **Event-Driven Communication**: Apache Kafka (Redpanda) for asynchronous messaging
- **Multiple Databases**: PostgreSQL for products, MongoDB for orders
- **Modern Tech Stack**: Next.js, Express, Fastify, Hono, Prisma, Mongoose
- **Centralized Authentication**: Clerk for user management
- **Payment Processing**: Stripe integration
- **Monorepo Management**: Turborepo with pnpm workspaces

---

## 📚 Documentation

### Quick Links

| Document | Description |
|----------|-------------|
| **[📖 Documentation Index](./DOCUMENTATION_INDEX.md)** | **Start here!** Complete navigation guide to all documentation |
| [📘 Project Documentation](./PROJECT_DOCUMENTATION.md) | Complete technical documentation and architecture |
| [🚀 Quick Start Guide](./QUICK_START.md) | Step-by-step setup instructions |
| [🔌 API Reference](./API_REFERENCE.md) | Complete API documentation for all services |
| [📊 Architecture Diagrams](./ARCHITECTURE_DIAGRAM.md) | Visual system architecture and data flows |

### For New Developers

1. **Start Here**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) - Navigation hub for all docs
2. **Get Running**: [QUICK_START.md](./QUICK_START.md) - Set up your development environment
3. **Understand the System**: [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) - Learn the architecture
4. **Build Features**: [API_REFERENCE.md](./API_REFERENCE.md) - API endpoints and schemas

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Frontend Applications                      │
│  Client (3002)  │  Admin (3003)                        │
└────────────┬────────────────┬───────────────────────────┘
             │                │
┌────────────┴────────────────┴───────────────────────────┐
│                 Microservices                           │
│  Auth (8003) │ Product (8000) │ Order (8001)           │
│  Payment (8002) │ Email Service                        │
└────────────┬────────────────────────────────────────────┘
             │
┌────────────┴────────────────────────────────────────────┐
│         Event Bus (Kafka/Redpanda)                      │
│  Topics: user.created, order.created, payment.success   │
└─────────────────────────────────────────────────────────┘
```

See [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) for detailed visual diagrams.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TailwindCSS 4** - Styling
- **Clerk** - Authentication
- **Stripe.js** - Payment UI

### Backend Services
- **Express.js** - Auth & Product services
- **Fastify** - Order service
- **Hono** - Payment service
- **Prisma** - PostgreSQL ORM
- **Mongoose** - MongoDB ODM

### Infrastructure
- **Turborepo** - Monorepo build system
- **pnpm** - Package manager
- **Redpanda** - Kafka-compatible event streaming
- **PostgreSQL** - Product database
- **MongoDB** - Order database

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- Docker (for Kafka)
- PostgreSQL
- MongoDB

### Installation

```bash
# Install dependencies
pnpm install

# Start Kafka cluster
cd packages/kafka
docker-compose up -d

# Setup databases (see QUICK_START.md for details)

# Start all services
pnpm dev
```

**For detailed setup instructions**, see [QUICK_START.md](./QUICK_START.md)

---

## 📦 Project Structure

```
microservices-ecommerce-main/
├── apps/                    # Application services
│   ├── admin/              # Admin dashboard (Next.js)
│   ├── client/             # Customer app (Next.js)
│   ├── auth-service/       # Authentication (Express)
│   ├── product-service/    # Products & categories (Express)
│   ├── order-service/      # Order management (Fastify)
│   ├── payment-service/    # Stripe payments (Hono)
│   └── email-service/      # Email notifications (Kafka consumer)
│
├── packages/               # Shared packages
│   ├── kafka/             # Kafka client library
│   ├── product-db/        # Prisma schema & client
│   ├── order-db/          # Mongoose models
│   ├── types/             # Shared TypeScript types
│   ├── eslint-config/     # Shared ESLint config
│   └── typescript-config/ # Shared TypeScript config
│
└── Documentation files
```

---

## 🎯 Services

| Service | Port | Framework | Database | Description |
|---------|------|-----------|----------|-------------|
| **Client** | 3002 | Next.js | - | Customer-facing e-commerce app |
| **Admin** | 3003 | Next.js | - | Admin dashboard for management |
| **Auth** | 8003 | Express | - | User authentication & authorization |
| **Product** | 8000 | Express | PostgreSQL | Product & category management |
| **Order** | 8001 | Fastify | MongoDB | Order processing & tracking |
| **Payment** | 8002 | Hono | - | Stripe payment processing |
| **Email** | - | Node.js | - | Event-driven email notifications |

---

## 🔄 Event-Driven Architecture

The system uses **Kafka (Redpanda)** for asynchronous communication:

### Kafka Topics

- `user.created` - Published by Auth Service, consumed by Email Service
- `payment.success` - Published by Payment Service, consumed by Order Service
- `order.created` - Published by Order Service, consumed by Email Service

**Monitor events**: http://localhost:8080 (Kafka UI)

---

## 🔐 Authentication

- **Provider**: Clerk
- **Method**: JWT tokens
- **Roles**: User, Admin
- **Integration**: All services use Clerk middleware

---

## 💳 Payments

- **Provider**: Stripe
- **Flow**: Checkout Sessions → Webhooks → Order Creation
- **Test Mode**: Enabled by default

---

## 📊 Available Commands

```bash
# Development
pnpm dev              # Start all services
pnpm dev --filter=client  # Start specific service

# Build
pnpm build            # Build all services
pnpm build --filter=product-service

# Type Checking
pnpm check-types      # Type check all services

# Linting & Formatting
pnpm lint             # Lint all code
pnpm format           # Format all code

# Database
cd packages/product-db
pnpm db:migrate       # Run Prisma migrations
pnpm db:generate      # Generate Prisma client
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific service
pnpm test --filter=order-service
```

---

## 📖 API Documentation

All services expose REST APIs. See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation.

### Example Endpoints

- `GET /products` - List all products
- `POST /orders` - Create an order
- `POST /sessions/create-checkout-session` - Create payment session
- `GET /health` - Health check (all services)

---

## 🔍 Monitoring

- **Kafka UI**: http://localhost:8080 - Monitor topics and messages
- **Health Checks**: Each service exposes `/health` endpoint
- **Logs**: Service logs in terminal output

---

## 🚢 Deployment

See [QUICK_START.md - Production Deployment](./QUICK_START.md#production-deployment) for deployment instructions.

### Deployment Checklist

- [ ] Set production environment variables
- [ ] Run database migrations
- [ ] Configure production Kafka cluster
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipeline
- [ ] Enable HTTPS/SSL
- [ ] Set up domain and DNS

---

## 🤝 Contributing

1. Read [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) to understand the architecture
2. Follow the coding standards (ESLint + Prettier)
3. Update documentation when adding features
4. Write tests for new functionality
5. Update API documentation in [API_REFERENCE.md](./API_REFERENCE.md)

---

## 📝 License

This project is for educational and demonstration purposes.

---

## 🆘 Support

- **Documentation**: Start with [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- **Setup Issues**: Check [QUICK_START.md - Troubleshooting](./QUICK_START.md#common-issues--solutions)
- **API Questions**: See [API_REFERENCE.md](./API_REFERENCE.md)
- **Architecture**: Read [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

---

## 🌟 Features

- ✅ Microservices architecture
- ✅ Event-driven communication
- ✅ Multiple database support
- ✅ Authentication & authorization
- ✅ Payment processing
- ✅ Email notifications
- ✅ Admin dashboard
- ✅ Customer-facing app
- ✅ Type-safe with TypeScript
- ✅ Monorepo with Turborepo
- ✅ Shared packages
- ✅ Hot reload in development

---

**Built with ❤️ using modern web technologies**

For complete documentation, visit [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
# microservice-ecommerce-services
