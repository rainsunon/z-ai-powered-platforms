GridBooks Backend Implementation Plan
A Node.js/TypeScript backend with Domain-Driven Design (DDD), Clean Architecture, Supabase for data storage, Better Auth for authentication, and advanced PostgreSQL JSONB features.

Overview
Based on the frontend analysis, the GridBooks application is a comprehensive accounting and invoicing platform. The backend will support:

Client Management: CRUD operations for clients with detailed contact information
Invoice Management: Create, send, track, and manage invoices
Expense Tracking: Record and categorize business expenses
Time Tracking: Log billable hours for projects
Notifications: System-wide notification management
Authentication: Secure user authentication with Better Auth and JWT
User Review Required
IMPORTANT

Technology Stack Confirmation

Runtime: Node.js with TypeScript
Architecture: DDD + Clean Architecture
Database: Supabase (PostgreSQL) with JSONB features
Authentication: Better Auth with JWT
API: GraphQL (Apollo Server)
ORM: Prisma (for type-safe database access)
Please confirm this stack or suggest modifications.

WARNING

Supabase Configuration Required You'll need to provide:

Supabase project URL
Supabase anon/public key
Supabase service role key (for admin operations)
These will be configured in .env file after project setup.

Proposed Changes
Project Structure
gridbooks-backend/
├── src/
│   ├── domain/                    # Domain Layer (Enterprise Business Rules)
│   │   ├── entities/              # Domain entities
│   │   │   ├── Client.ts
│   │   │   ├── Invoice.ts
│   │   │   ├── Expense.ts
│   │   │   ├── TimeEntry.ts
│   │   │   ├── Notification.ts
│   │   │   └── User.ts
│   │   ├── value-objects/         # Value objects
│   │   │   ├── Email.ts
│   │   │   ├── Money.ts
│   │   │   ├── Address.ts
│   │   │   └── DateRange.ts
│   │   ├── repositories/          # Repository interfaces
│   │   │   ├── IClientRepository.ts
│   │   │   ├── IInvoiceRepository.ts
│   │   │   ├── IExpenseRepository.ts
│   │   │   ├── ITimeEntryRepository.ts
│   │   │   └── INotificationRepository.ts
│   │   └── events/                # Domain events
│   │       ├── InvoiceCreated.ts
│   │       ├── PaymentReceived.ts
│   │       └── ClientUpdated.ts
│   ├── application/               # Application Layer (Use Cases)
│   │   ├── use-cases/
│   │   │   ├── client/
│   │   │   │   ├── CreateClient.ts
│   │   │   │   ├── UpdateClient.ts
│   │   │   │   ├── GetClient.ts
│   │   │   │   └── ListClients.ts
│   │   │   ├── invoice/
│   │   │   │   ├── CreateInvoice.ts
│   │   │   │   ├── SendInvoice.ts
│   │   │   │   ├── MarkAsPaid.ts
│   │   │   │   └── ListInvoices.ts
│   │   │   ├── expense/
│   │   │   ├── time-entry/
│   │   │   └── notification/
│   │   ├── dtos/                  # Data Transfer Objects
│   │   └── services/              # Application services
│   ├── infrastructure/            # Infrastructure Layer
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   └── repositories/      # Repository implementations
│   │   │       ├── SupabaseClientRepository.ts
│   │   │       ├── SupabaseInvoiceRepository.ts
│   │   │       └── ...
│   │   ├── auth/
│   │   │   ├── better-auth.config.ts
│   │   │   ├── jwt.service.ts
│   │   │   └── auth.middleware.ts
│   │   ├── supabase/
│   │   │   └── client.ts
│   │   └── external-services/
│   ├── presentation/              # Presentation Layer (API)
│   │   ├── graphql/
│   │   │   ├── schema/
│   │   │   │   ├── client.graphql
│   │   │   │   ├── invoice.graphql
│   │   │   │   ├── expense.graphql
│   │   │   │   ├── time-entry.graphql
│   │   │   │   └── auth.graphql
│   │   │   ├── resolvers/
│   │   │   │   ├── client.resolver.ts
│   │   │   │   ├── invoice.resolver.ts
│   │   │   │   └── ...
│   │   │   └── context.ts
│   │   └── http/
│   │       ├── server.ts
│   │       └── routes/
│   ├── shared/                    # Shared utilities
│   │   ├── errors/
│   │   ├── validators/
│   │   └── utils/
│   └── main.ts                    # Application entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
Domain Layer
Entities with JSONB Support
[NEW] 
Client.ts
Domain entity for Client with rich metadata stored in JSONB:

export class Client {
  id: string;
  name: string;
  contact: ContactInfo;
  preferences: ClientPreferences; // Stored as JSONB
  metadata: Record<string, any>;  // Stored as JSONB for extensibility
  totalOutstanding: Money;
  credit: Money;
  createdAt: Date;
  updatedAt: Date;
}
interface ClientPreferences {
  sendReminders: boolean;
  lateFees: boolean;
  currency: string;
  language: string;
  attachments: boolean;
  customSettings?: Record<string, any>; // JSONB for future extensions
}
[NEW] 
Invoice.ts
Invoice entity with line items in JSONB:

export class Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  lineItems: LineItem[];  // Stored as JSONB array
  metadata: InvoiceMetadata; // JSONB for custom fields
  status: InvoiceStatus;
  amount: Money;
  dueDate: Date;
  createdAt: Date;
}
interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  metadata?: Record<string, any>;
}
Infrastructure Layer
Database Schema (Prisma)
[NEW] 
schema.prisma
Prisma schema leveraging PostgreSQL JSONB:

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
generator client {
  provider = "prisma-client-js"
}
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String
  metadata      Json      @default("{}")  // JSONB for user preferences
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  clients       Client[]
  invoices      Invoice[]
  expenses      Expense[]
  timeEntries   TimeEntry[]
  
  @@map("users")
}
model Client {
  id                String   @id @default(uuid())
  userId            String
  name              String
  contact           Json     // JSONB: { firstName, lastName, email, phone, etc. }
  preferences       Json     @default("{}") // JSONB: reminders, fees, currency, etc.
  metadata          Json     @default("{}") // JSONB: custom fields, tags, etc.
  totalOutstanding  Decimal  @default(0)
  credit            Decimal  @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user              User     @relation(fields: [userId], references: [id])
  invoices          Invoice[]
  
  @@index([userId])
  @@index([preferences(ops: JsonbPathOps)], type: Gin) // GIN index for JSONB queries
  @@map("clients")
}
model Invoice {
  id              String   @id @default(uuid())
  invoiceNumber   String   @unique
  userId          String
  clientId        String
  lineItems       Json     // JSONB array: [{ description, qty, rate, amount }]
  metadata        Json     @default("{}") // JSONB: custom fields, notes, etc.
  status          String   // 'Draft' | 'Sent' | 'Paid' | 'Overdue'
  amount          Decimal
  dueDate         DateTime
  paidAt          DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
  client          Client   @relation(fields: [clientId], references: [id])
  
  @@index([userId])
  @@index([clientId])
  @@index([status])
  @@index([lineItems(ops: JsonbPathOps)], type: Gin) // GIN index for JSONB
  @@map("invoices")
}
model Expense {
  id              String   @id @default(uuid())
  userId          String
  date            DateTime
  merchant        String
  category        String
  amount          Decimal
  status          String
  receipt         Json?    // JSONB: { url, name, metadata }
  metadata        Json     @default("{}")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([category])
  @@map("expenses")
}
model TimeEntry {
  id              String   @id @default(uuid())
  userId          String
  clientId        String?
  project         String
  description     String
  startTime       DateTime
  endTime         DateTime
  duration        Int      // in minutes
  status          String   // 'Billed' | 'Unbilled'
  metadata        Json     @default("{}")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([status])
  @@map("time_entries")
}
model Notification {
  id              String   @id @default(uuid())
  userId          String
  type            String   // 'Billing' | 'Messages' | 'System'
  priority        String   // 'High' | 'Medium' | 'Low'
  title           String
  message         String
  metadata        Json     @default("{}")  // JSONB: sender info, links, etc.
  read            Boolean  @default(false)
  createdAt       DateTime @default(now())
  
  @@index([userId])
  @@index([read])
  @@map("notifications")
}
Advanced PostgreSQL JSONB Features:

GIN Indexes: For fast JSONB queries on preferences, lineItems, and metadata
JSONB Operators: Support for @> (contains), ? (key exists), -> (field access)
Flexible Schema: Store complex nested data without rigid structure
Better Auth Configuration
[NEW] 
better-auth.config.ts
Better Auth setup with JWT:

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../database/prisma/client";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  jwt: {
    enabled: true,
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  socialProviders: {
    // Optional: Add Google, GitHub, etc.
  },
});
Application Layer
Use Cases
[NEW] 
CreateClient.ts
Use case demonstrating JSONB operations:

export class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}
  async execute(dto: CreateClientDTO): Promise<Client> {
    // Validate input
    const email = new Email(dto.email);
    const address = dto.address ? new Address(dto.address) : null;
    // Create domain entity with JSONB fields
    const client = new Client({
      name: dto.companyName || `${dto.firstName} ${dto.lastName}`,
      contact: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: email.value,
        phone: dto.phone,
        businessPhone: dto.businessPhone,
        mobilePhone: dto.mobilePhone,
        address: address?.toJSON(),
      },
      preferences: {
        sendReminders: dto.sendReminders || false,
        lateFees: dto.lateFees || false,
        currency: dto.currency || 'CAD',
        language: dto.language || 'English (Canada)',
        attachments: dto.attachments || false,
      },
      metadata: {
        source: 'web',
        tags: dto.tags || [],
        customFields: dto.customFields || {},
      },
    });
    return await this.clientRepository.save(client);
  }
}
Presentation Layer
GraphQL Schema
[NEW] 
client.graphql
GraphQL schema with JSONB support:

type Client {
  id: ID!
  name: String!
  contact: ContactInfo!
  preferences: ClientPreferences!
  metadata: JSON!
  totalOutstanding: Float!
  credit: Float!
  createdAt: DateTime!
  updatedAt: DateTime!
}
type ContactInfo {
  firstName: String
  lastName: String
  email: String!
  phone: String
  businessPhone: String
  mobilePhone: String
  address: Address
}
type ClientPreferences {
  sendReminders: Boolean!
  lateFees: Boolean!
  currency: String!
  language: String!
  attachments: Boolean!
  customSettings: JSON
}
type Address {
  street: String
  city: String
  state: String
  zip: String
  country: String
}
input CreateClientInput {
  firstName: String
  lastName: String
  companyName: String
  email: String!
  phone: String
  businessPhone: String
  mobilePhone: String
  address: AddressInput
  preferences: ClientPreferencesInput
  customFields: JSON
}
input ClientPreferencesInput {
  sendReminders: Boolean
  lateFees: Boolean
  currency: String
  language: String
  attachments: Boolean
}
type Query {
  client(id: ID!): Client
  clients(
    filter: ClientFilter
    pagination: PaginationInput
  ): ClientConnection!
  
  # Advanced JSONB query
  clientsByPreference(
    preference: String!
    value: JSON!
  ): [Client!]!
}
type Mutation {
  createClient(input: CreateClientInput!): Client!
  updateClient(id: ID!, input: UpdateClientInput!): Client!
  deleteClient(id: ID!): Boolean!
}
[NEW] 
invoice.graphql
Invoice schema with line items:

type Invoice {
  id: ID!
  invoiceNumber: String!
  client: Client!
  lineItems: [LineItem!]!
  metadata: JSON!
  status: InvoiceStatus!
  amount: Float!
  dueDate: DateTime!
  paidAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}
type LineItem {
  description: String!
  quantity: Float!
  rate: Float!
  amount: Float!
  metadata: JSON
}
enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
}
input CreateInvoiceInput {
  clientId: ID!
  lineItems: [LineItemInput!]!
  dueDate: DateTime!
  metadata: JSON
}
input LineItemInput {
  description: String!
  quantity: Float!
  rate: Float!
}
type Query {
  invoice(id: ID!): Invoice
  invoices(
    filter: InvoiceFilter
    pagination: PaginationInput
  ): InvoiceConnection!
}
type Mutation {
  createInvoice(input: CreateInvoiceInput!): Invoice!
  sendInvoice(id: ID!): Invoice!
  markInvoiceAsPaid(id: ID!): Invoice!
  deleteInvoice(id: ID!): Boolean!
}
Repository Implementation with JSONB Queries
[NEW] 
SupabaseClientRepository.ts
Repository demonstrating advanced JSONB queries:

export class SupabaseClientRepository implements IClientRepository {
  constructor(private prisma: PrismaClient) {}
  async save(client: Client): Promise<Client> {
    const data = await this.prisma.client.create({
      data: {
        name: client.name,
        userId: client.userId,
        contact: client.contact as any,
        preferences: client.preferences as any,
        metadata: client.metadata as any,
        totalOutstanding: client.totalOutstanding.amount,
        credit: client.credit.amount,
      },
    });
    return this.toDomain(data);
  }
  // Advanced JSONB query: Find clients with specific preference
  async findByPreference(key: string, value: any): Promise<Client[]> {
    const clients = await this.prisma.$queryRaw`
      SELECT * FROM clients
      WHERE preferences @> ${JSON.stringify({ [key]: value })}::jsonb
    `;
    return clients.map(this.toDomain);
  }
  // JSONB containment query
  async findByMetadataContains(criteria: Record<string, any>): Promise<Client[]> {
    const clients = await this.prisma.client.findMany({
      where: {
        metadata: {
          path: [],
          contains: criteria,
        },
      },
    });
    return clients.map(this.toDomain);
  }
  // Check if JSONB key exists
  async findClientsWithCustomField(fieldName: string): Promise<Client[]> {
    const clients = await this.prisma.$queryRaw`
      SELECT * FROM clients
      WHERE metadata ? ${fieldName}
    `;
    return clients.map(this.toDomain);
  }
}
Configuration Files
[NEW] 
package.json
{
  "name": "gridbooks-backend",
  "version": "1.0.0",
  "description": "GridBooks Backend API with DDD, Clean Architecture, and Supabase",
  "main": "dist/main.js",
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "@apollo/server": "^4.10.0",
    "@prisma/client": "^5.9.0",
    "@supabase/supabase-js": "^2.39.0",
    "better-auth": "^0.8.0",
    "graphql": "^16.8.1",
    "graphql-scalars": "^1.22.4",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "dotenv": "^16.4.1",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20.11.5",
    "prisma": "^5.9.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "eslint": "^8.56.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.11"
  }
}
[NEW] 
tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@domain/*": ["domain/*"],
      "@application/*": ["application/*"],
      "@infrastructure/*": ["infrastructure/*"],
      "@presentation/*": ["presentation/*"],
      "@shared/*": ["shared/*"]
    },
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
[NEW] 
.env.example
# Database
DATABASE_URL="postgresql://postgres:[password]@[host]:[port]/[database]?schema=public"
# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
# Better Auth
AUTH_SECRET="your-secret-key-min-32-chars"
AUTH_URL="http://localhost:4000"
# JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
# Server
PORT=4000
NODE_ENV="development"
# CORS
CORS_ORIGIN="http://localhost:5173"
Verification Plan
Automated Tests
Unit Tests

npm test -- --testPathPattern=domain
npm test -- --testPathPattern=application
Integration Tests

npm test -- --testPathPattern=infrastructure
E2E Tests

npm test -- --testPathPattern=e2e
Manual Verification
Database Setup

Run Prisma migrations
Verify JSONB columns and GIN indexes
Test JSONB queries in Prisma Studio
Authentication Flow

Test user registration
Test login with JWT
Verify token validation
GraphQL API

Test all queries and mutations in GraphQL Playground
Verify JSONB field queries
Test pagination and filtering
JSONB Operations

Test containment queries (@>)
Test key existence queries (?)
Test nested field access (->, ->>)
Performance Testing
Benchmark JSONB queries with GIN indexes
Test query performance with large datasets
Verify index usage with EXPLAIN ANALYZE