Plan: Refactor Order-Service with DDD and Event-Driven Architecture
I've completed comprehensive research on the order-service and created a detailed implementation plan. Here's the strategic approach:

TL;DR
Transform order-service from an anemic CRUD service into a domain-driven, event-sourced microservice using Kafka for reliable order fulfillment. The refactoring implements a choreography-based saga pattern to coordinate inventory reservation, payment processing, and shipment creation with automatic compensation on failures. Following CAP theorem, we choose CP (Consistency + Partition Tolerance) with eventual consistency across services.

Steps
Phase 1: Kafka Infrastructure (Foundation - no dependencies)
Add spring-kafka and reactor-kafka dependencies to pom.xml
Create KafkaConstant.java with order topics: ORDER_CREATED, ORDER_CONFIRMED, ORDER_CANCELLED, INVENTORY_RESERVED, PAYMENT_COMPLETED, SHIPMENT_CREATED, etc.
Implement EventProducer using reactor-kafka KafkaSender (follow payment-service pattern)
Implement EventConsumer with KafkaReceiver (follow notification-service pattern)
Configure Kafka bootstrap-servers, consumer-group-id, producer config in application.yml
Define domain event records: OrderCreatedEvent, OrderConfirmedEvent, OrderCancelledEvent with orderId, timestamp, payload
Phase 2: DDD Aggregate (depends on Phase 1)
Create value objects package: OrderId, Money, ProductReference, Quantity, Address (all Java 21 records with validation)
Refactor Order entity to aggregate root:
Add OrderStatus enum: PENDING → CONFIRMED → PAID → SHIPPED → DELIVERED → CANCELLED
Add business methods: create(), confirm(), cancel(), markAsPaid(), markAsShipped(), complete()
Enforce invariants: min 1 item, totalAmount > 0, valid state transitions
Create OrderItem entity within Order aggregate (item_id, product_id, quantity, unit_price, line_total)
Remove Cart FK relationship - Cart is pre-checkout, Order is post-checkout (separate bounded contexts)
Update schema: Add order_status, total_amount, user_id columns; create order_items table; remove cart_id FK
Phase 3: Saga Orchestration (depends on Phase 2)
Create OrderSagaOrchestrator to coordinate order fulfillment workflow
Define saga compensation pairs:
Reserve Inventory ↔ Release Inventory
Process Payment ↔ Refund Payment
Create Shipment ↔ Cancel Shipment
Implement OrderCreatedEventHandler: consume ORDER_CREATED → publish RESERVE_INVENTORY_REQUEST
Implement compensation handlers for INVENTORY_RESERVATION_FAILED, PAYMENT_FAILED, SHIPMENT_FAILED
Implement success handlers: INVENTORY_RESERVED → request payment, PAYMENT_COMPLETED → request shipment, SHIPMENT_CREATED → complete order
Add idempotency: processed_events table with event_id uniqueness constraint, check before processing
Store saga state in order_saga_state table (saga_id, order_id, current_step, status, timestamps)
Phase 4: Cart Bounded Context (parallel with Phase 3)
Separate Cart into distinct bounded context (keep in order-service as separate package, or extract to cart-service)
Cart aggregate with addItem(), removeItem(), updateQuantity(), clear(), checkout() methods
Update Order creation: Accept CreateOrderRequest(userId, items, shippingAddress) - no Cart reference
Publish ORDER_CREATED event immediately on order creation
Deprecate Cart endpoints in order-service, migrate to cart-service
Phase 5: Event Sourcing (depends on Phase 2, optional)
Create event_store table: event_id, aggregate_id, event_type, event_data (JSON), version, timestamps
Implement OrderEventStore: save(event), getEvents(orderId), rebuild(orderId) from events
Update Order aggregate to emit domain events on all state changes
Implement event replay for debugging and temporal queries
Add snapshot optimization: Store state snapshot every 10 events in order_snapshots table
Phase 6: CAP Theorem - CP Strategy (depends on Phase 3)
Strong consistency within order-service database (REPEATABLE_READ isolation, optimistic locking with @Version)
Eventual consistency across services via Kafka events
Accept unavailability if Kafka partitioned (no orders > inconsistent orders)
Configure Kafka: replication factor 3, min.insync.replicas 2, producer idempotence, transactional publishing
Implement retry logic with exponential backoff (3 retries: 1s, 2s, 4s)
Add reconciliation job to detect stuck sagas (alerts if >5 min in same state)
Monitoring: Track saga completion time (<30s), event processing lag (<1000 msgs), stuck saga detection
Phase 7: Update Related Services (parallel with Phase 3, coordinate with other teams)
inventory-service: Add KafkaConsumer for RESERVE_INVENTORY_REQUEST, implement reserve/release with optimistic locking, publish INVENTORY_RESERVED/_FAILED
payment-service: Add KafkaConsumer for PROCESS_PAYMENT_REQUEST, refactor from immediate publish to saga-based, add REFUND_PAYMENT_REQUEST consumer (compensation)
shipping-service: Add KafkaConsumer for CREATE_SHIPMENT_REQUEST, implement createShipment/cancelShipment, publish SHIPMENT_CREATED/_FAILED
notification-service: Add consumers for ORDER_CREATED, ORDER_CONFIRMED, ORDER_CANCELLED, ORDER_COMPLETED - send email at each state
user-service: Add consumer for ORDER_COMPLETED to update user order history and loyalty points
bff-service: Update to handle new Order schema (no cart_id), add order status tracking endpoint, display saga progress ("Reserving inventory", "Processing payment")
api-gateway: Update routing if cart-service extracted, add retry logic and rate limiting on order creation
Phase 8: Testing & Validation (depends on all previous phases)
Unit tests: Order aggregate state transitions, value object validations, event handlers
Integration tests: Saga happy path, all compensation paths (inventory/payment/shipping failures), idempotency, optimistic locking
Chaos engineering: Kafka broker failure, service down during saga, database connection loss, network partition
Performance tests: Order creation <200ms, saga completion <5s, 100 orders/sec concurrent, 1000 events/sec processing
Data migration: Backfill order_status for existing orders, migrate cart_id to order_items, archive old Cart records
Relevant Files
Order Service (Modify)
pom.xml - Add Kafka dependencies
Order.java - Refactor to aggregate root with business logic
OrderServiceImpl.java - Use aggregate methods instead of direct entity manipulation
OrderController.java - Update endpoints for new schema
application.yml - Add Kafka configuration
database.sql - Schema changes
New Files to Create
order-service/domain/aggregate/Order.java - Rich domain model
order-service/domain/valueobject/{OrderId, Money, ProductReference, Quantity, Address}.java
order-service/domain/entity/OrderItem.java
order-service/domain/event/{OrderCreatedEvent, OrderConfirmedEvent, OrderCancelledEvent}.java
order-service/event/{EventProducer, EventConsumer}.java - Kafka integration
order-service/saga/{OrderSagaOrchestrator, SagaState}.java - Saga coordination
order-service/constant/KafkaConstant.java - Topic names
order-service/repository/{OrderEventStore, OrderSagaStateRepository}.java
Other Services (Update)
payment-service/PaymentServiceImpl.java - Add saga event handling
notification-service/EventConsumer.java - Add order consumers
inventory-service/* - Add reservation logic with Kafka
shipping-service/* - Add shipment creation with Kafka
bff-service/* - Handle new order schema
Reference Patterns
payment-service/EventProducer.java - Reactor-Kafka producer using KafkaSender
notification-service/EventConsumer.java - KafkaReceiver with topic subscription
PaymentServiceImpl.java - Event publishing in save() method
Verification
Phase 1: Kafka topics created, EventProducer sends test message successfully
Phase 2: Order aggregate unit tests pass, schema migration applied, Order.create() validates rules
Phase 3: Create order → ORDER_CREATED published → saga steps execute → order transitions to COMPLETED (or CANCELLED with compensation)
Phase 6: Kill Kafka → service unavailable (CP), restore Kafka → pending events processed
Phase 7: End-to-end test: Order created → inventory reserved → payment processed → shipment created → order completed → emails sent
Phase 8: All unit/integration/chaos/performance tests pass, production deployment successful

Decisions
DDD Bounded Contexts: Order (fulfillment), Cart (shopping), Payment, Inventory, Shipping - clear boundaries
Saga Pattern: Choreography-based (services react to events) vs Orchestration → better decoupling, easier to extend
CAP Trade-off: CP (Consistency + Partition Tolerance) - strong consistency in order DB, eventual consistency across services, unavailable > inconsistent
Event-Driven: Kafka over RabbitMQ (already used, better for event streaming and replay)
Technology: Reactor-Kafka (non-blocking), Event Sourcing (optional Phase 5), Optimistic Locking (no distributed locks)
Breaking Change: Remove cart_id FK → migrate data before removal, keep Cart read-only for 2 releases before deletion
Idempotency: Event-based (event_id deduplication) + API-based (idempotency-key header in POST /orders)

Further Considerations
Immediate (after Phase 1)

Set up local Kafka cluster (Docker Compose)
Define event schema versioning strategy (Avro/JSON Schema)
Medium-term

CQRS: Separate read model for fast order queries
Dead Letter Queue for poison messages
Event replay endpoint for debugging
Saga state dashboard UI
Long-term

GraphQL API for flexible queries
Multi-region Kafka replication
Time-travel queries using event sourcing
Cost optimization: Archive old events to S3
Risks & Mitigations

Complex debugging → Correlation IDs, centralized logging, saga state table
Schema evolution breaks consumers → Schema registry, compatibility checks
Kafka outage → HA setup, circuit breaker fallback to sync mode, alerts
Long saga duration → Async order creation (202 Accepted), websocket status updates, 60s timeout
Event loss → Kafka acknowledgment, producer idempotence, reconciliation job
List of Services Requiring Updates
Critical (Saga Participants)
✅ order-service - Core refactoring target
✅ inventory-service - Add reservation/release with Kafka events
✅ payment-service - Refactor to saga-based event handling
✅ shipping-service - Add shipment creation with Kafka events
Important (Support)
✅ notification-service - Add order event consumers
✅ bff-service - Handle new order schema, display saga progress
Optional
user-service - Order history, loyalty points
api-gateway - Routing, rate limiting (if cart-service extracted)
Infrastructure
Kafka - New topics, replication, monitoring
Database - Schema migrations for all affected services
Monitoring - Saga metrics dashboards, alerting
Estimated Effort: 8-12 weeks (Phases 1-3: 3-5 weeks foundation; Phases 4-7: 4-6 weeks integration; Phase 8: 1-2 weeks testing)

Priority Recommendation: Start with Phases 1-3 (Kafka + DDD + Saga) - they provide the most value and enable parallel work on other services in Phase 7.


✅ Phase 2 Complete: DDD, Saga & Outbox Pattern Implementation
Successfully implemented comprehensive DDD refactoring with saga choreography and transactional outbox pattern across three services!

Implementation Summary:
order-service (DDD Aggregate Root)

✅ Value Objects: Money, Address, Quantity, ProductReference (Java 21 records)
✅ OrderStatus enum with state machine validation
✅ Order aggregate root with business logic (create, confirm, markAsPaid, markAsShipped, cancel)
✅ OrderItem entity with automatic line total calculation
✅ Transactional Outbox Pattern: OutboxEvent entity + OutboxPublisher (5-second polling)
✅ Database schema: outbox_events, order_items tables, refactored orders table
inventory-service (Saga Participant)

✅ Kafka infrastructure added (producer/consumer configs)
✅ Event handlers for inventory.reserve.request and inventory.release.request
✅ InventoryReservationService with reservation tracking
✅ Publishes inventory.reserved or inventory.reservation.failed events
✅ Compensation logic for inventory release (saga rollback)
payment-service (Saga Participant)

✅ Event handlers for payment.process.request and payment.refund.request
✅ Publishes payment.completed or payment.failed events
✅ Payment processing with automatic Payment record creation
✅ Refund support for saga compensation
✅ PaymentStatus extended with FAILED and REFUNDED
Architecture Patterns:
Domain-Driven Design: Aggregate roots, value objects, domain events
Transactional Outbox: Atomicity between DB writes and event publishing
Saga Choreography: Order → Inventory → Payment → Shipping with compensation
Event-Driven: Asynchronous communication via Kafka with reactor-kafka
CAP Theorem (CP Strategy): Strong consistency + partition tolerance, eventual consistency via events
Saga Flow Example:
Happy Path:

Compensation (Payment Fails):

Compilation Status:
Files Created/Modified: 53 total
order-service: 34 files (value objects, domain model, outbox, events, config)
inventory-service: 12 files (Kafka setup, events, reservation service)
payment-service: 7 files (event handlers, DTOs, status enum)
📄 Full documentation: PHASE2_DDD_SAGA_OUTBOX_IMPLEMENTATION.md

Production-Ready Features:
✅ Retry logic in outbox publisher
✅ Idempotency via eventId
✅ Automatic cleanup (7-day retention)
✅ State machine validation
✅ Compensation/rollback logic
✅ Non-blocking reactive Kafka