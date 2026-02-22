# Notification Service

## Overview
The Notification Service is responsible for sending alerts and messages to users. It integrates with external providers for email and SMS communications and listens to Kafka topics for asynchronous event handling.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Messaging**: Apache Kafka (via `kafkajs`)
- **Key Dependencies**:
  - `nodemailer`: For sending emails.
  - `twilio`: For sending SMS messages.
  - `axios`: For HTTP requests.

## Features
- **Event-Driven Architecture**: Consumes messages from Kafka topics to trigger notifications.
- **Email Notifications**: Sends transactional emails (likely for order updates, password resets, etc.).
- **SMS Notifications**: Sends text messages via Twilio.

## Scripts
- `start`: `nodemon index.js`
