# **saga-microservices-orchestrator**

A **reference implementation** of the **Saga Pattern** using **Netflix/Orkes Conductor**, **Spring Boot**, and **Kafka** to **orchestrate distributed transactions** across multiple microservices. This project demonstrates how to manage distributed transactions via **Orchestration**, where each microservice performs a **local transaction** and communicates state changes through **events**. If any step fails, **compensating transactions** roll back previously successful steps, ensuring overall data consistency.

---

## **Features**

1. **Orchestration-Based Saga**  
   - A centralized **Orchestrator** (using Netflix/Orkes Conductor) controls the saga flow across microservices.

2. **Microservices**  
   - Separate services for **Order**, **Inventory**, **Payment**, **Shipping**, **Notification**, etc.

3. **Kafka Messaging**  
   - Asynchronous event-driven communication via **Kafka** topics.

4. **CQRS**  
   - A separate **Query Service** listens to events and maintains a **read-optimized** view of data.

5. **Local Transactions & Compensations**  
   - Each service uses a local ACID transaction; compensating commands are sent on failure to revert successful steps.

---

## **Project Structure**

```
saga-microservices-orchestrator
├── common
│   └── src/main/java/com/distributedtransactions/common/dto
│       # Shared DTOs and event classes
├── orchestrator
│   └── src/main/java/com/distributedtransactions/orchestrator
│       # Orchestration logic using Conductor
├── order-service
│   └── src/main/java/com/distributedtransactions/orderservice
│       # Handles order creation and cancellation
├── inventory-service
│   └── src/main/java/com/distributedtransactions/inventoryservice
│       # Manages inventory reservations/releases
├── payment-service
│   └── src/main/java/com/distributedtransactions/paymentservice
│       # Processes payments and rollbacks
├── shipping-service
│   └── src/main/java/com/distributedtransactions/shippingservice
│       # Ships orders and handles failures
├── notification-service
│   └── src/main/java/com/distributedtransactions/notificationservice
│       # Sends success/failure notifications
├── query-service
│   └── src/main/java/com/distributedtransactions/queryservice
│       # Maintains CQRS read model
└── docker-compose.yml
    # Spins up Kafka, Conductor, etc.
```

---

## **Getting Started**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/felixojiambo/saga-microservices-orchestrator.git
   cd saga-microservices-orchestrator
   ```

2. **Set Up Infrastructure**:
   - **Kafka** and **Orkes Conductor** can be run via **Docker Compose**:
     ```bash
     docker-compose up -d
     ```
   - Verify Kafka is accessible at `localhost:9092` and Conductor at `http://localhost:8080`.

3. **Configure Conductor Credentials (Optional)**:
   - If using Orkes Conductor Cloud, update your `application.properties` in the **Orchestrator** module with **Access Key** and **Secret**:
     ```properties
     conductor.server.url=https://<orkes-conductor-cloud-url>/api
     conductor.security.client.key-id=<YOUR_KEY>
     conductor.security.client.secret=<YOUR_SECRET>
     ```
   - If using **OSS Conductor** locally, ensure the server is up on port **8080**.

4. **Build & Run**:
   ```bash
   mvn clean install
   # Start each service in its own terminal:
   mvn spring-boot:run -f orchestrator/pom.xml
   mvn spring-boot:run -f order-service/pom.xml
   mvn spring-boot:run -f inventory-service/pom.xml
   mvn spring-boot:run -f payment-service/pom.xml
   mvn spring-boot:run -f shipping-service/pom.xml
   mvn spring-boot:run -f notification-service/pom.xml
   mvn spring-boot:run -f query-service/pom.xml
   ```

---

## **Testing the Saga Flow**

### **11.1. Start All Microservices**

Each microservice can be started independently. Open separate terminal windows/tabs for each:

1. **Orchestrator Service**  
   ```bash
   cd saga-microservices-orchestrator/orchestrator
   mvn spring-boot:run
   ```

2. **Order Service**  
   ```bash
   cd saga-microservices-orchestrator/order-service
   mvn spring-boot:run
   ```

3. **Inventory Service**  
   ```bash
   cd saga-microservices-orchestrator/inventory-service
   mvn spring-boot:run
   ```

4. **Payment Service**  
   ```bash
   cd saga-microservices-orchestrator/payment-service
   mvn spring-boot:run
   ```

5. **Shipping Service**  
   ```bash
   cd saga-microservices-orchestrator/shipping-service
   mvn spring-boot:run
   ```

6. **Notification Service**  
   ```bash
   cd saga-microservices-orchestrator/notification-service
   mvn spring-boot:run
   ```

7. **Query Service**  
   ```bash
   cd saga-microservices-orchestrator/query-service
   mvn spring-boot:run
   ```

### **11.2. Register Workflows in Orkes Conductor**

- Using the Orkes Conductor UI at `http://localhost:8080`, register your workflows if you plan to use Conductor’s workflow definitions.  
- However, if you rely solely on **OrchestratorService** to manage the saga steps, you can skip defining any additional workflow in Conductor.

### **11.3. Test the Saga Flow**

**11.3.1. Send a Create Order Command**

Use **cURL** or **Postman** to send a command to create an order. For example, if your **Order Service** exposes a REST endpoint on port **8083**:

```bash
curl --location 'http://localhost:8083' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": "order-1001",
    "customerId": "customer-123",
    "amount": 45.0,
    "type": "CREATE_ORDER"
}'
```

**Alternatively**, publish a `CREATE_ORDER` command via Kafka directly:

```bash
docker exec -it saga-test_kafka_1 bash

# Inside Kafka container:
kafka-console-producer --broker-list localhost:9092 --topic order-commands \
  --property "parse.key=true" --property "key.separator=:"
>order-1001:{"orderId":"order-1001","customerId":"customer-123","amount":45.0,"type":"CREATE_ORDER"}
```

**11.3.2. Observe the Saga Progress**

1. **Order Service** creates the order and publishes `ORDER_CREATED`.  
2. **Orchestrator Service** listens to `order-events` (e.g., `ORDER_CREATED`) and sends `RESERVE_INVENTORY`.  
3. **Inventory Service** reserves inventory and publishes `INVENTORY_RESERVED`.  
4. **Orchestrator Service** sends `PROCESS_PAYMENT`.  
5. **Payment Service** processes payment and publishes `PAYMENT_SUCCESS`.  
6. **Orchestrator Service** sends `SHIP_ORDER`.  
7. **Shipping Service** ships the order and publishes `ORDER_SHIPPED`.  
8. **Orchestrator Service** sends `NOTIFY_CUSTOMER`.  
9. **Notification Service** sends a success notification.  
10. **Query Service** updates the read model accordingly.

### **11.4. View the Read Model**

Check the **Query Service** REST API (example on port **8088**):

```bash
curl --location 'http://localhost:8088/api/v1/orders/order-1001'
```

**Expected Response**:
```json
{
  "orderId": "order-1001",
  "customerId": "customer-123",
  "amount": 45.0,
  "status": "SHIPPED"
}
```

### **11.5. Simulate a Failure and Observe Compensation**

To test compensating actions, create an order with an **amount** that causes **payment failure** (e.g., `amount = 60.0` in your Payment Service logic):

```bash
# In Kafka container:
kafka-console-producer --broker-list localhost:9092 --topic order-commands \
  --property "parse.key=true" --property "key.separator=:"
>order-1002:{"orderId":"order-1002","customerId":"customer-123","amount":60.0,"type":"CREATE_ORDER"}
```

**Expected Flow**:
1. **Order Service**: Creates the order → `ORDER_CREATED`.  
2. **Orchestrator**: Sends `RESERVE_INVENTORY`.  
3. **Inventory Service**: Reserves inventory → `INVENTORY_RESERVED`.  
4. **Orchestrator**: Sends `PROCESS_PAYMENT`.  
5. **Payment Service**: Payment fails → `PAYMENT_FAILED`.  
6. **Orchestrator**: Issues `RELEASE_INVENTORY` & `CANCEL_ORDER`.  
7. **Inventory Service**: Releases inventory → `INVENTORY_RELEASED`.  
8. **Order Service**: Cancels order → `ORDER_CANCELED`.  
9. **Query Service**: Updates the read model with canceled status.  
10. **Notification Service**: Sends a failure notification.

### **11.6. Verify Compensation**

```bash
curl --location 'http://localhost:8088/api/v1/orders/order-1002'
```

**Expected Response**:
```json
{
  "orderId": "order-1002",
  "customerId": "customer-123",
  "amount": 60.0,
  "status": "CANCELED"
}
```

### **11.7. Commit Testing Steps**

```bash
cd saga-microservices-orchestrator
git add .
git commit -m "docs: add instructions for running and testing the saga orchestration flow"
```

---

## **Usage & Architecture**

- **Saga Orchestrator**: Coordinates the entire flow, listening to domain events (`ORDER_CREATED`, `INVENTORY_RESERVED`, etc.) and issuing next-step commands (`PROCESS_PAYMENT`).
- **Local Transactions**: Each microservice manages its own DB and transaction boundaries.
- **Compensation**: If a microservice step fails, the Orchestrator instructs other microservices to roll back previously successful steps.

---

## **License**

This project is licensed under the [MIT License](LICENSE), granting permission to use, modify, and distribute under typical open-source terms.

---

## **Contributing**

1. **Fork** the repository.  
2. **Create** a new feature branch (`git checkout -b feature/my-new-feature`).  
3. **Commit** your changes (`git commit -m 'Add some feature'`).  
4. **Push** to the branch (`git push origin feature/my-new-feature`).  
5. **Open** a Pull Request.

---

## **Contact**

- **Author**: Ojiambo  
- **GitHub**: [felixojiambo](https://github.com/felixojiambo)  
- **Repository**: [saga-microservices-orchestrator](https://github.com/felixojiambo/saga-microservices-orchestrator)

Enjoy building your **Saga Orchestrated Microservices** with **Netflix/Orkes Conductor** and **Kafka**!
