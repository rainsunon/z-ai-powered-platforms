Event-Driven Notification Service:
A scalable event-driven notification system built with Node.js, Hono, TypeScript, PostgreSQL, RabbitMQ and Redis. This system is designed for asynchronous processing, idempotency, retry mechanisms with exponential backoff, and Dead-Letter Queue (DLQ) handling.

What This Project Does
    Accepts events through an HTTP API
    Queues jobs with RabbidMQ
    Processes notifications asynchronously in a worker
    Stores notification history in PostgreSQL
    Applies simple per-user rate limiting
    Prevents duplicate processing with queue-level and database-level idempotency
    Exposes a RabbitMQ Board dashboard for queue monitoring

Flow
    A client sends an event to POST /notification/api/events.
    The producer validates the payload using Zod.
    The producer adds the event to the RabbitMQ queue.
    The worker consumes the job.
    The worker reads user preferences from PostgreSQL.
    The worker selects channels: EMAIL, SMS, and/or PUSH.
    The worker applies a Redis-based rate limit of 5 notifications per minute per user.
    The worker writes notification records to PostgreSQL.
    The worker marks each notification as SENT or FAILED.
    You can inspect queue state in Rabbit Board and fetch notification history through the API.

Features
    Event Publishing: REST API to accept events and publish to RabbitMQ.
    Asynchronous Consumption: Dedicated consumer service processes events from the queue.
    Idempotency: Ensures events are processed exactly once using a unique event_id.
    Reliability:
        Retries: Automatic retries with simulated exponential backoff (via retry queue/TTL).
        Dead-Letter Queue (DLQ): Failed messages after max retries are moved to a DLQ.
    Persistence: Event status tracked in PostgreSQL (PENDING, PROCESSED, FAILED, RETRYING).
    Containerized: Fully Dockerized setup with docker-compose.
Architecture
    Publisher API (publisher-api): Exposes POST /api/v1/events and GET /api/v1/notifications/:id. Publishes to events_exchange.
    RabbitMQ: Message Broker with events_exchange (Topic), notifications_queue (Main), notifications_retry_queue (Wait/TTL), and notifications_dlq (Dead Letter).
    Consumer: Consumes from notifications_queue. Checks DB for idempotency. Processes logic. Updates DB. Ack/Nack functionality.
    Database (database): PostgreSQL storing notification states.

Configuration

    MAX_RETRIES: Number of retries before DLQ.


Tech Stack
    Node.js
    TypeScript
    Hono
    RabbitMQ
    Redis
    PostgreSQL
    Drizzle
    Zod
    Docker Compose

Project Structure
.
├── apps
├── packages
│   └── notificationDB
│       ├── drizzle
│       └── src
│           └── drizzle.config.ts
│── services
│        └──notification-service
│           └── src
│             ├── producer
│             ├── worker
│             │    │── handlers
│             │    ├── email.ts
│             │    ├── push.ts
│             │    ├── sms.ts
│             │    └── index.ts
│             │
│             ├── docker-compose.yml
│             ├── package.json
│             ├── test-event.ps1
│             └── tsconfig.json