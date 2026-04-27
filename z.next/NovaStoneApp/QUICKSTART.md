# 🚀 NovaStone Quick Start Guide

Get up and running with NovaStone in 5 minutes!

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** ([Install](https://pnpm.io/installation)): `npm install -g pnpm`
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/)) - for PostgreSQL
- **Git**

## 📦 Installation

### 1. Clone the Repository (if applicable)
```bash
cd /path/to/NovaStoneApp
```

### 2. Start PostgreSQL with Docker

```bash
cd server
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- pgAdmin on `http://localhost:5050`

**pgAdmin Credentials:**
- Email: `admin@novastone.local`
- Password: `admin`

### 3. Set Up Backend

```bash
# Still in server directory
pnpm install

# Copy and configure environment variables
cp .env.example .env

# The .env should already be configured with:
# DATABASE_URL="postgresql://novastone:novastone_dev_password@localhost:5432/novastone?schema=public"
```

### 4. Initialize Database

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with sample data
pnpm db:seed
```

### 5. Start Backend Server

```bash
pnpm dev
```

Backend is now running at:
- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/ui`
- OpenAPI Spec: `http://localhost:3000/doc`

### 6. Set Up Frontend (New Terminal)

```bash
cd ../client
pnpm install
pnpm dev
```

Frontend is now running at:
- App: `http://localhost:5173`

## 🎉 You're Ready!

Open `http://localhost:5173` in your browser.

### Demo Account

After seeding, you can create a new account or use the API with the demo user:
- Email: `demo@novastone.com`
- (No password set by seed - create via Sign Up)

## 📚 Quick Tour

### Frontend Routes
- `/` - Login/Sign Up
- `/dashboard` - Main dashboard
- `/customers` - Customer management
- `/products` - Products & services
- `/invoices` - Invoice management
- `/sales` - Sales tracking

### API Endpoints

All API endpoints require authentication (except auth routes).

**Authentication:**
```bash
POST /api/auth/sign-up
POST /api/auth/sign-in
```

**Protected Routes:**
```bash
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PATCH  /api/customers/:id
DELETE /api/customers/:id

# Similar patterns for:
# /api/products, /api/invoices, /api/sales, 
# /api/estimates, /api/purchases, /api/transactions
```

## 🧪 Testing the API

### 1. Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
```

### 2. Sign In
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

Save the JWT token from the response.

### 3. Get Customers
```bash
curl -X GET http://localhost:3000/api/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Create a Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Customer Inc",
    "email": "contact@newcustomer.com",
    "phone": "+1-555-0100",
    "address": {
      "street": "123 Main St",
      "city": "Seattle",
      "state": "WA",
      "zip": "98101",
      "country": "USA"
    }
  }'
```

## 🛠️ Development Commands

### Backend (server/)
```bash
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm start            # Run production build
pnpm db:generate      # Generate Prisma Client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create migration
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database
pnpm lint             # Type check
```

### Frontend (client/)
```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Type check
```

## 📖 Documentation

- **API Documentation**: http://localhost:3000/ui (when server running)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **API Examples**: [server/API_EXAMPLES.md](server/API_EXAMPLES.md)
- **JSONB Guide**: [server/JSONB_GUIDE.md](server/JSONB_GUIDE.md)
- **Backend README**: [server/README.md](server/README.md)

## 🗄️ Database Management

### Using Prisma Studio
```bash
cd server
pnpm db:studio
```

Opens a visual database editor at `http://localhost:5555`

### Using pgAdmin

1. Open `http://localhost:5050`
2. Login with credentials above
3. Add server:
   - Host: `postgres`
   - Port: `5432`
   - Database: `novastone`
   - Username: `novastone`
   - Password: `novastone_dev_password`

### Direct psql Access
```bash
docker exec -it novastone-postgres psql -U novastone -d novastone
```

## 🔧 Common Issues

### Port Already in Use

**Backend (3000):**
```bash
# Find process
lsof -i :3000
# Kill it
kill -9 PID
```

**Frontend (5173):**
```bash
lsof -i :5173
kill -9 PID
```

**PostgreSQL (5432):**
```bash
# Stop local PostgreSQL if running
brew services stop postgresql  # macOS
sudo service postgresql stop   # Linux
```

### Docker Issues

**Reset everything:**
```bash
cd server
docker-compose down -v
docker-compose up -d
pnpm db:push
pnpm db:seed
```

### Database Connection Error

Check `.env` file has correct credentials:
```env
DATABASE_URL="postgresql://novastone:novastone_dev_password@localhost:5432/novastone?schema=public"
```

### Prisma Client Not Generated

```bash
cd server
pnpm db:generate
```

## 🎯 Next Steps

1. **Explore the API**: Use Swagger UI at `http://localhost:3000/ui`
2. **Read the Docs**: Check out [ARCHITECTURE.md](ARCHITECTURE.md) and [server/JSONB_GUIDE.md](server/JSONB_GUIDE.md)
3. **Customize**: Add your own features and custom fields
4. **Deploy**: See deployment guides in respective README files

## 🆘 Getting Help

- Check [server/README.md](server/README.md) for backend details
- Review [server/API_EXAMPLES.md](server/API_EXAMPLES.md) for API usage
- Examine [server/JSONB_GUIDE.md](server/JSONB_GUIDE.md) for JSONB patterns
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for system overview

## 📝 Quick Reference

### Project Structure
```
NovaStoneApp/
├── client/          # React frontend
├── server/          # Hono backend
│   ├── prisma/     # Database schema & migrations
│   └── src/        # Source code
├── ARCHITECTURE.md  # System architecture
└── README.md       # Project overview
```

### Environment Variables
- Backend: `server/.env`
- Frontend: `client/.env` (if needed)

### Default Ports
- Frontend: `5173`
- Backend: `3000`
- PostgreSQL: `5432`
- pgAdmin: `5050`
- Prisma Studio: `5555`

---

**Happy Coding! 🚀**
