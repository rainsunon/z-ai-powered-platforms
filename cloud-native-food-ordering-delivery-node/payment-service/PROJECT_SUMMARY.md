# Payment Service

## Overview
The Payment Service handles financial transactions for orders. It acts as a bridge between the application and payment gateways.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Payment Gateway**: Stripe (via `stripe` SDK).
- **Key Dependencies**: `axios`, `cors`, `dotenv`.

## Features
- **Payment Processing**: Securely process payments using Stripe.
- **Transaction Recording**: Store payment records in MongoDB.
- **Integration**: Likely integrates with the Order Service to confirm order payments.

## Scripts
- `start`: `node index.js`
- `dev`: `nodemon index.js`
