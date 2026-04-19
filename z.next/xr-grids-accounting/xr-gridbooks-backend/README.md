# GridBooks Backend

A Node.js/TypeScript backend API built with Domain-Driven Design (DDD), Clean Architecture, Supabase, Better Auth, and PostgreSQL JSONB features.

## Features

- ✅ **DDD & Clean Architecture**: Clear separation of concerns across Domain, Application, Infrastructure, and Presentation layers
- ✅ **PostgreSQL with JSONB**: Advanced JSONB features with GIN indexes for flexible data storage
- ✅ **Better Auth + JWT**: Secure authentication with JWT tokens
- ✅ **GraphQL API**: Type-safe API with Apollo Server
- ✅ **Prisma ORM**: Type-safe database access with migrations
- ✅ **Supabase Integration**: Cloud PostgreSQL database and storage

## Project Structure

```
src/
├── domain/                 # Domain Layer (Business Logic)
│   ├── entities/          # Domain entities
│   ├── value-objects/     # Value objects
│   └── repositories/      # Repository interfaces
├── application/           # Application Layer (Use Cases)
│   ├── use-cases/        # Business use cases
│   └── dtos/             # Data Transfer Objects
├── infrastructure/        # Infrastructure Layer
│   ├── database/         # Prisma & repositories
│   ├── auth/             # Authentication
│   └── supabase/         # Supabase client
├── presentation/          # Presentation Layer (API)
│   └── graphql/          # GraphQL schema & resolvers
└── main.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (via Supabase)
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd gridbooks-backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

### Development

Start the development server:
```bash
npm run dev
```

The GraphQL API will be available at `http://localhost:4000/graphql`

### Production

Build and start:
```bash
npm run build
npm start
```

## API Documentation

### Authentication

**Sign Up:**
```graphql
mutation {
  signUp(input: {
    email: "user@example.com"
    password: "password123"
    name: "John Doe"
  }) {
    user {
      id
      email
      name
    }
    token
  }
}
```

**Sign In:**
```graphql
mutation {
  signIn(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    user {
      id
      email
    }
    token
  }
}
```

### Clients

**Create Client:**
```graphql
mutation {
  createClient(input: {
    email: "client@example.com"
    companyName: "Acme Corp"
    phone: "+1234567890"
    currency: "USD"
    sendReminders: true
  }) {
    id
    name
    contact {
      email
    }
    preferences {
      currency
      sendReminders
    }
  }
}
```

**List Clients:**
```graphql
query {
  clients {
    id
    name
    totalOutstanding
    credit
  }
}
```

### Invoices

**Create Invoice:**
```graphql
mutation {
  createInvoice(input: {
    clientId: "client_id_here"
    dueDate: "2024-12-31"
    lineItems: [
      {
        description: "Web Development"
        quantity: 10
        rate: 150
      }
    ]
  }) {
    id
    invoiceNumber
    amount
    status
  }
}
```

**List Invoices:**
```graphql
query {
  invoices {
    id
    invoiceNumber
    client {
      name
    }
    amount
    status
    dueDate
  }
}
```

## Advanced JSONB Queries

The backend supports advanced PostgreSQL JSONB queries:

**Find clients by preference:**
```graphql
query {
  clientsByPreference(key: "sendReminders", value: true) {
    id
    name
    preferences
  }
}
```

## Database Schema

The database uses PostgreSQL with JSONB columns for flexible data storage:

- **clients**: Contact info, preferences, and metadata stored as JSONB
- **invoices**: Line items stored as JSONB array
- **expenses**: Receipt data stored as JSONB
- **notifications**: Metadata stored as JSONB

GIN indexes are used on JSONB columns for optimal query performance.

## Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Open Prisma Studio
- `npm test`: Run tests

## License

MIT
