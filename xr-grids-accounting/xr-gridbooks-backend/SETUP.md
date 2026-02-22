# Quick Setup Guide

## Prerequisites

- Node.js 20+
- A Supabase account (free tier works)
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies (Already Done ✅)

```bash
npm install
```

### 2. Get Supabase Credentials

1. Go to https://supabase.com and create a new project
2. Wait for the project to be ready (~2 minutes)
3. Go to **Project Settings** > **Database**
   - Copy the **Connection String** (URI mode)
   - Replace `[YOUR-PASSWORD]` with your database password
4. Go to **Project Settings** > **API**
   - Copy **Project URL** → `SUPABASE_URL`
   - Copy **anon public** key → `SUPABASE_ANON_KEY`
   - Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
nano .env  # or use your preferred editor
```

Required variables:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Generate secrets:
```bash
# For AUTH_SECRET and JWT_SECRET
openssl rand -base64 32
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Run Database Migrations

```bash
npm run prisma:migrate
```

When prompted for a migration name, enter: `init`

This creates all tables with JSONB columns and GIN indexes.

### 6. Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Server ready at http://localhost:4000/graphql
📊 Health check at http://localhost:4000/health
```

### 7. Test the API

Open http://localhost:4000/graphql in your browser.

Try this query:
```graphql
mutation {
  signUp(input: {
    email: "test@example.com"
    password: "password123"
    name: "Test User"
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

## Common Issues

### "Prisma Client not found"
```bash
npm run prisma:generate
```

### "Can't reach database server"
- Check your `DATABASE_URL` in `.env`
- Verify your Supabase project is active
- Check if your IP is whitelisted in Supabase

### "Migration failed"
- Ensure `DATABASE_URL` is correct
- Check database is accessible
- Try: `npm run prisma:migrate -- --create-only` then apply manually

## Next Steps

1. ✅ Test authentication (signUp, signIn)
2. ✅ Create a client
3. ✅ Create an invoice
4. ✅ Explore GraphQL schema
5. ✅ Connect your frontend

## Useful Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI

# Production
npm run build           # Build for production
npm start              # Start production server

# Testing
npm test               # Run tests
```

## GraphQL Playground

Once the server is running, visit:
- **GraphQL API**: http://localhost:4000/graphql
- **Health Check**: http://localhost:4000/health

## Documentation

See [README.md](./README.md) for full API documentation and examples.

## Support

If you encounter issues:
1. Check the [walkthrough.md](../.gemini/antigravity/brain/fbd56fe0-335f-4c96-954b-157c7d8d3f27/walkthrough.md)
2. Review Supabase project settings
3. Verify all environment variables are set
4. Check Prisma migrations ran successfully
