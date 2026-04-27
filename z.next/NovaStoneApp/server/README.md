# NovaStone API Server

A modern, high-performance backend API for NovaStone financial management system built with **Hono**, **Prisma**, **PostgreSQL**, **Better Auth**, and **JWT**.

## 🚀 Features

- **Hono Framework**: Ultrafast web framework for building APIs
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **PostgreSQL JSONB**: Extensive use of JSONB for flexible data storage
- **Better Auth**: Modern authentication with session management
- **JWT Tokens**: Secure token-based authentication
- **OpenAPI Documentation**: Auto-generated API documentation with Swagger UI
- **TypeScript**: Full type safety across the stack
- **RESTful API**: Clean and intuitive API design

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- pnpm (recommended) or npm

## 🛠️ Installation

1. **Clone and navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your database connection:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/novastone?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   BETTER_AUTH_SECRET="your-super-secret-better-auth-key"
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma Client
   pnpm db:generate
   
   # Push schema to database
   pnpm db:push
   
   # Seed the database with sample data
   pnpm db:seed
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

The server will start at `http://localhost:3000`

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:

- **Swagger UI**: http://localhost:3000/ui
- **OpenAPI Spec**: http://localhost:3000/doc

## 🔐 Authentication

The API uses Better Auth for authentication with JWT tokens.

### Sign Up
```bash
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

### Sign In
```bash
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Using the Token
Include the JWT token in the Authorization header for protected routes:
```bash
Authorization: Bearer <your-jwt-token>
```

## 🗂️ API Endpoints

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create new customer
- `PATCH /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Invoices
- `GET /api/invoices` - List all invoices (filter by status)
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create new invoice
- `PATCH /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/pay` - Mark invoice as paid

### Sales
- `GET /api/sales` - List all sales (filter by status, category)
- `GET /api/sales/:id` - Get sale details
- `POST /api/sales` - Create new sale
- `PATCH /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale
- `POST /api/sales/:id/pay` - Mark sale as paid

### Estimates
- `GET /api/estimates` - List all estimates
- `GET /api/estimates/:id` - Get estimate details
- `POST /api/estimates` - Create new estimate
- `PATCH /api/estimates/:id` - Update estimate
- `DELETE /api/estimates/:id` - Delete estimate

### Purchases
- `GET /api/purchases` - List all purchases
- `GET /api/purchases/:id` - Get purchase details
- `POST /api/purchases` - Create new purchase
- `PATCH /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Transactions
- `GET /api/transactions` - List all transactions
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions` - Create new transaction
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## 💾 Database Schema

The database extensively uses **PostgreSQL JSONB** fields for flexible data storage:

### Key Models

- **User**: Authentication and user data
- **Customer**: Customer information with JSONB for addresses, contacts, payment info
- **Product**: Products/services with JSONB for pricing, inventory, variants
- **Invoice**: Invoices with JSONB for line items, payments, tax details
- **Sale**: Sales records with JSONB for line items and payment terms
- **Estimate**: Estimates/quotes with JSONB for line items and terms
- **Purchase**: Purchase records with JSONB for vendor and payment info
- **Transaction**: Financial transactions with JSONB for flexible categorization

### JSONB Benefits

- **Flexibility**: Store complex nested data without schema changes
- **Performance**: Fast queries with GIN indexes
- **Validation**: Still enforce types at the application level with Zod
- **Extensibility**: Easy to add custom fields per user requirements

## 🧪 Development

### Available Scripts

```bash
# Development with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database commands
pnpm db:generate   # Generate Prisma Client
pnpm db:push      # Push schema to database
pnpm db:migrate   # Create migration
pnpm db:studio    # Open Prisma Studio
pnpm db:seed      # Seed database

# Type checking
pnpm lint
```

### Project Structure

```
server/
├── prisma/
│   ├── schema.prisma      # Database schema with JSONB fields
│   └── seed.ts            # Database seeding script
├── src/
│   ├── index.ts           # Main server entry point
│   ├── lib/
│   │   ├── auth.ts        # Better Auth configuration
│   │   ├── jwt.ts         # JWT utilities
│   │   └── prisma.ts      # Prisma client
│   ├── middleware/
│   │   └── auth.ts        # Auth middleware
│   ├── routes/
│   │   ├── customers.ts   # Customer routes
│   │   ├── products.ts    # Product routes
│   │   ├── invoices.ts    # Invoice routes
│   │   ├── sales.ts       # Sales routes
│   │   ├── estimates.ts   # Estimate routes
│   │   ├── purchases.ts   # Purchase routes
│   │   └── transactions.ts # Transaction routes
│   └── schemas/
│       └── index.ts       # Zod validation schemas
├── .env.example           # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security

- Passwords are hashed with bcrypt
- JWT tokens for stateless authentication
- Better Auth for session management
- CORS configured for specific origins
- Input validation with Zod schemas
- SQL injection protection via Prisma

## 🚀 Deployment

### Environment Variables

Set these in your production environment:

```env
DATABASE_URL=postgresql://...
PORT=3000
NODE_ENV=production
JWT_SECRET=<strong-secret>
BETTER_AUTH_SECRET=<strong-secret>
BETTER_AUTH_URL=https://your-domain.com
CORS_ORIGIN=https://your-frontend.com
```

### Build and Run

```bash
# Build
pnpm build

# Start
NODE_ENV=production pnpm start
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or support, please contact the development team.
