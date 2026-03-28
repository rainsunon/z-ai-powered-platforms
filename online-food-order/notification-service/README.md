# Notification Service

Event-driven notification microservice using Kafka + PostgreSQL (JSONB) with idempotent processing.

## Features
- Kafka consumers for order and invoice events
- Idempotency key table to ensure exactly-once processing
- PostgreSQL JSONB for template variables
- Email delivery via Spring Mail
- Flyway migrations for schema management

## Local Run

```zsh
./mvnw clean test
```

## Kafka Topics
- `order-created-events`
- `order-paid-events`
- `invoice-generated-events`

## Environment Variables
- `POSTGRES_URL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `KAFKA_BOOTSTRAP_SERVERS`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`

