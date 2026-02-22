# Restaurant Service

## Overview
The Restaurant Service manages restaurant profiles, menus, and operations. It allows restaurant owners to manage their business presence on the platform.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Messaging**: Kafka (via custom `shared-kafka` package).
- **Integration**: Firebase (likely for image storage or auth integration).
- **Key Dependencies**: `bcrypt`, `jsonwebtoken`.

## Features
- **Restaurant Management**: Create and update restaurant details.
- **Menu Management**: Manage food items, prices, and availability.
- **Event Publishing**: Publishes events to Kafka (via `shared-kafka`).

## Scripts
- `dev`: `nodemon index.js`
