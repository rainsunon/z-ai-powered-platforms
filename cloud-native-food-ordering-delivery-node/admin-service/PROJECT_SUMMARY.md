# Admin Service

## Overview
The Admin Service is a backend microservice built with Node.js and Express, designed to handle administrative tasks and user management within the food delivery platform.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Key Dependencies**:
  - `axios`: For making HTTP requests
  - `cors`: For Cross-Origin Resource Sharing
  - `dotenv`: For environment configuration
  - `node-cron`: For scheduling periodic tasks

## Scripts
- `start`: `node server.js` - Starts the server
- `dev`: `nodemon server.js` - Starts the server in development mode with auto-reload

## Features
- Administrative APIs (implied by name)
- Scheduled tasks (via `node-cron`)
