# Order Service

## Overview
The Order Service manages the core business logic for the application: the shopping cart and order lifecycle. It handles everything from adding items to a cart to placing an order and tracking its status.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Real-time**: WebSocket (`ws`) for real-time updates.
- **Key Dependencies**: `amqplib` (possibly for RabbitMQ, though file list showed Kafka elsewhere, package.json lists `ws`), `express-validator`, `bcryptjs`.

## Key Features
- **Cart Management**: Add/Update/Remove items, clear cart (Single restaurant constraint).
- **Order Processing**: Create orders, link payment methods, address handling.
- **Order Tracking**: Status updates (`PLACED`, `PREPARING`, `OUT_FOR_DELIVERY`, etc.).
- **Role Integration**: Different views/actions for Customers, Restaurants, and Delivery Drivers.
- **Real-time Updates**: Uses WebSockets to push order status changes.

## API Endpoints (Highlights)
- `GET /cart`: Retrieve current cart.
- `POST /orders`: Place a new order.
- `GET /orders`: List user's orders.
- `PATCH /orders/:id/status`: Update order status (Restaurant).
- `PATCH /orders/:id/delivery-person`: Assign driver.

## Scripts
- `start`: `nodemon index.js`
