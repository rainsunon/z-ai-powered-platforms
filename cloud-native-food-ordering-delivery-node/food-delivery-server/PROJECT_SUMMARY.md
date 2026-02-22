# Food Delivery Server

## Overview
This services acts as a central server application, possibly serving as an API Gateway or a primary backend orchestrator for the system.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose), Redis (via `ioredis`) for caching/session store.
- **Real-time**: Socket.io
- **Security**: `helmet`, `cors`
- **Key Dependencies**: `jsonwebtoken`, `morgan`.

## Features
- **Central API**: Likely handles aggregated requests or general app logic.
- **Real-time Communication**: Uses Socket.io, possibly for chat or live tracking updates across the platform.
- **Caching**: Redis integration for performance optimization.

## Scripts
- `start`: `node app.js`
- `dev`: `nodemon app.js`
