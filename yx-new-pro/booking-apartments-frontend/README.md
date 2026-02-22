# Booking Apartments Platform - Frontend

Modern React frontend application for the Booking Apartments Platform, built with TypeScript, TailwindCSS, and Redux Toolkit.

## Features

- 🔐 **Authentication** - Login, register, and session management with JWT
- 🏢 **Apartment Search** - Search available apartments by city, capacity, and dates
- 📅 **Booking Management** - Create, confirm, and cancel bookings with Hold mechanism
- 🔄 **Idempotency Support** - Automatic idempotency key generation for POST requests
- 🎨 **Modern UI** - Built with ShadCN UI components and TailwindCSS
- 📱 **Responsive Design** - Mobile-first responsive layout
- ⚡ **Performance** - Lazy loading, code splitting, and optimized bundle size
- 🧪 **Testing** - Jest and React Testing Library setup

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling with Zod validation
- **Axios** - HTTP client with interceptors
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN UI** - Accessible component library
- **React Router** - Client-side routing
- **Jest** - Testing framework

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── ui/             # ShadCN UI components
│   └── layout/         # Layout components
├── features/           # Feature-based modules
│   ├── auth/           # Authentication features
│   ├── apartments/     # Apartment features
│   ├── bookings/       # Booking features
│   └── availability/   # Availability search
├── store/              # Redux store and slices
│   ├── authSlice.ts
│   ├── apartmentsSlice.ts
│   ├── bookingsSlice.ts
│   └── index.ts
├── lib/                # Utilities and configurations
│   ├── apiClient.ts    # Axios client with idempotency
│   └── utils.ts        # Helper functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── __tests__/          # Test files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on http://localhost:8080

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

## Key Features

### Idempotency Support

The API client automatically adds idempotency keys to all POST, PUT, and PATCH requests:

```typescript
// Automatic idempotency key generation
await apiClient.post('/api/bookings/hold', data);

// Or provide custom key
await apiClient.post('/api/bookings/hold', data, {
  idempotencyKey: 'custom-key-123'
});
```

### Authentication

- JWT-based authentication with automatic token refresh
- Secure token storage in localStorage
-Protected routes with automatic redirect

### State Management

Redux Toolkit slices for:
- Authentication state
- Apartments and availability
- Bookings management

### Form Validation

React Hook Form with Zod schemas for type-safe validation:

```typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
```

## API Integration

The frontend integrates with the following backend endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/availability/search` - Search apartments
- `GET /api/apartments/:id` - Get apartment details
- `POST /api/bookings/hold` - Create booking hold (with idempotency)
- `POST /api/bookings/:id/confirm` - Confirm booking
- `POST /api/bookings/:id/cancel` - Cancel booking

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8080
```

## Development

### Adding New Features

1. Create feature folder in `src/features/`
2. Add Redux slice in `src/store/`
3. Create UI components
4. Add routes in `App.tsx`
5. Write tests in `__tests__/`

### Component Development

All UI components follow the ShadCN UI pattern with TailwindCSS styling:

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Author

XRS Cloud Native Team
