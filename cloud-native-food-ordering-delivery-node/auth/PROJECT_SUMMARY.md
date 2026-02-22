# Auth Service

## Overview
The Authentication Service handles user registration, login, and identity management for the entire platform. It supports different user roles including customers, restaurant managers, delivery drivers, and admins.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens), `bcryptjs` for password hashing
- **Key Dependencies**: `cookie-parser`, `cors`, `dotenv`, `morgan`

## Key Features
- **User Registration**: Support for Customer, Restaurant, and Delivery roles (with NIC verification for the latter).
- **Authentication**: Login with email/password, JWT token generation (Access & Refresh tokens).
- **Password Management**: Forgot/Reset password functionality.
- **Role Management**: Role-based access control (RBAC).

## API Endpoints (Highlights)
- `POST /api/auth/register`: Register new user.
- `POST /api/auth/login`: Authenticate user.
- `POST /api/auth/refresh-token`: Rotate access tokens.
- `GET /api/users/me`: Get current user profile.
- `PUT /api/users/:id/approve`: Admin approval for drivers/restaurants.

## Scripts
- `start`: `node index.js`
- `dev`: `nodemon index.js`
- `seed:admin`: `node utils/seedAdmin.js` (Seeds an initial admin user)
