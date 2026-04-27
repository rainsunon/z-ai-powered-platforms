# NovaStone Project Structure

## Overview

NovaStone is a full-stack financial management system with a React frontend and Node.js backend.

```
NovaStoneApp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   └── lib/           # Utilities and auth
│   └── package.json
│
└── server/                 # Node.js backend
    ├── src/
    │   ├── routes/        # API routes
    │   ├── lib/           # Auth, Prisma, JWT
    │   ├── middleware/    # Auth middleware
    │   └── schemas/       # Zod schemas
    ├── prisma/
    │   └── schema.prisma  # Database schema
    └── package.json
```

## Tech Stack

### Frontend
- React 19
- TypeScript
- TailwindCSS
- Zustand (state management)
- React Query
- Better Auth (client)
- Vite

### Backend
- Node.js
- Hono (web framework)
- Prisma (ORM)
- PostgreSQL with JSONB
- Better Auth
- JWT
- OpenAPI/Swagger

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm

### Setup

1. **Backend Setup**:
   ```bash
   cd server
   pnpm install
   cp .env.example .env
   # Edit .env with your database credentials
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   pnpm dev
   ```

2. **Frontend Setup**:
   ```bash
   cd client
   pnpm install
   pnpm dev
   ```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Documentation

- Frontend: See [client/README.md](client/README.md)
- Backend: See [server/README.md](server/README.md)
- API Docs: http://localhost:3000/ui (when server is running)
