# API Reference

Complete API documentation for all microservices in the e-commerce platform.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Auth Service API](#auth-service-api)
3. [Product Service API](#product-service-api)
4. [Order Service API](#order-service-api)
5. [Payment Service API](#payment-service-api)
6. [Kafka Events](#kafka-events)
7. [Error Handling](#error-handling)

---

## Authentication

All protected endpoints require a Clerk authentication token in the Authorization header:

```http
Authorization: Bearer <clerk-jwt-token>
```

### User Roles

- **Public**: No authentication required
- **User**: Authenticated user
- **Admin**: User with admin role in Clerk

---

## Auth Service API

**Base URL**: `http://localhost:8003`

### Health Check

```http
GET /health
```

**Response**:
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": 1234567890
}
```

### User Management

#### Get All Users

```http
GET /users
Authorization: Bearer <admin-token>
```

**Response**:
```json
{
  "users": [
    {
      "id": "user_xxx",
      "email": "user@example.com",
      "username": "johndoe",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create User

```http
POST /users
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "username": "newuser",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "id": "user_xxx",
  "email": "newuser@example.com",
  "username": "newuser"
}
```

**Kafka Event**: Publishes `user.created` event

---

## Product Service API

**Base URL**: `http://localhost:8000`

### Health Check

```http
GET /health
```

### Products

#### List All Products

```http
GET /products
```

**Query Parameters**:
- `category` (optional): Filter by category slug
- `limit` (optional): Number of products to return
- `offset` (optional): Pagination offset

**Response**:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "shortDescription": "High-performance laptop",
      "description": "A powerful laptop for professionals",
      "price": 99999,
      "sizes": ["13-inch", "15-inch"],
      "colors": ["Silver", "Space Gray"],
      "images": {
        "main": "https://example.com/image.jpg",
        "gallery": ["url1", "url2"]
      },
      "categorySlug": "electronics",
      "category": {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100
}
```

#### Get Product by ID

```http
GET /products/:id
```

**Response**:
```json
{
  "id": 1,
  "name": "Laptop",
  "shortDescription": "High-performance laptop",
  "description": "A powerful laptop for professionals",
  "price": 99999,
  "sizes": ["13-inch", "15-inch"],
  "colors": ["Silver", "Space Gray"],
  "images": {
    "main": "https://example.com/image.jpg",
    "gallery": []
  },
  "categorySlug": "electronics",
  "category": {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Create Product

```http
POST /products
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "name": "Laptop",
  "shortDescription": "High-performance laptop",
  "description": "A powerful laptop for professionals",
  "price": 99999,
  "sizes": ["13-inch", "15-inch"],
  "colors": ["Silver", "Space Gray"],
  "images": {
    "main": "https://example.com/image.jpg",
    "gallery": []
  },
  "categorySlug": "electronics"
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Laptop",
  "shortDescription": "High-performance laptop",
  "description": "A powerful laptop for professionals",
  "price": 99999,
  "sizes": ["13-inch", "15-inch"],
  "colors": ["Silver", "Space Gray"],
  "images": {
    "main": "https://example.com/image.jpg",
    "gallery": []
  },
  "categorySlug": "electronics",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### Update Product

```http
PUT /products/:id
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "name": "Updated Laptop",
  "price": 89999
}
```

**Response**: Updated product object

#### Delete Product

```http
DELETE /products/:id
Authorization: Bearer <user-token>
```

**Response**:
```json
{
  "message": "Product deleted successfully"
}
```

### Categories

#### List All Categories

```http
GET /categories
```

**Response**:
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "products": []
    }
  ]
}
```

#### Get Category by Slug

```http
GET /categories/:slug
```

**Response**:
```json
{
  "id": 1,
  "name": "Electronics",
  "slug": "electronics",
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 99999
    }
  ]
}
```

#### Create Category

```http
POST /categories
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "name": "Electronics",
  "slug": "electronics"
}
```

**Response**:
```json
{
  "id": 1,
  "name": "Electronics",
  "slug": "electronics"
}
```

#### Update Category

```http
PUT /categories/:slug
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "name": "Consumer Electronics"
}
```

#### Delete Category

```http
DELETE /categories/:slug
Authorization: Bearer <user-token>
```

---

## Order Service API

**Base URL**: `http://localhost:8001`

### Health Check

```http
GET /health
```

### Test Authentication

```http
GET /test
Authorization: Bearer <user-token>
```

**Response**:
```json
{
  "message": "Order service is authenticated!",
  "userId": "user_xxx"
}
```

### Orders

#### Get User Orders

```http
GET /orders
Authorization: Bearer <user-token>
```

**Response**:
```json
{
  "orders": [
    {
      "_id": "order_xxx",
      "userId": "user_xxx",
      "email": "user@example.com",
      "amount": 99999,
      "status": "success",
      "products": [
        {
          "name": "Laptop",
          "quantity": 1,
          "price": 99999
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get All Orders (Admin)

```http
GET /orders/all
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `status` (optional): Filter by order status (`success` or `failed`)
- `limit` (optional): Number of orders to return
- `offset` (optional): Pagination offset

**Response**:
```json
{
  "orders": [
    {
      "_id": "order_xxx",
      "userId": "user_xxx",
      "email": "user@example.com",
      "amount": 99999,
      "status": "success",
      "products": [
        {
          "name": "Laptop",
          "quantity": 1,
          "price": 99999
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 150
}
```

#### Get Order Analytics

```http
GET /orders/chart
Authorization: Bearer <admin-token>
```

**Query Parameters**:
- `startDate` (optional): Start date for analytics (ISO format)
- `endDate` (optional): End date for analytics (ISO format)

**Response**:
```json
{
  "data": [
    {
      "month": "January 2024",
      "total": 50,
      "successful": 45
    },
    {
      "month": "February 2024",
      "total": 60,
      "successful": 55
    }
  ]
}
```

---

## Payment Service API

**Base URL**: `http://localhost:8002`

### Health Check

```http
GET /health
```

### Payment Sessions

#### Create Checkout Session

```http
POST /sessions/create-checkout-session
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "products": [
    {
      "name": "Laptop",
      "price": 99999,
      "quantity": 1
    }
  ],
  "successUrl": "http://localhost:3002/success",
  "cancelUrl": "http://localhost:3002/cancel"
}
```

**Response**:
```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/pay/cs_test_xxx"
}
```

**Usage**:
1. Client receives `sessionId` and `url`
2. Redirect user to Stripe checkout page
3. User completes payment
4. Stripe sends webhook to payment service
5. Payment service publishes `payment.success` event

### Webhooks

#### Stripe Webhook

```http
POST /webhooks/stripe
Content-Type: application/json
Stripe-Signature: <stripe-signature>

{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_xxx",
      "amount_total": 99999,
      "customer_email": "user@example.com",
      "metadata": {
        "userId": "user_xxx",
        "products": "[{\"name\":\"Laptop\",\"price\":99999,\"quantity\":1}]"
      }
    }
  }
}
```

**Response**:
```json
{
  "received": true
}
```

**Kafka Event**: Publishes `payment.success` event

---

## Kafka Events

### Event Schema

All Kafka events follow this structure:

```json
{
  "topic": "event.name",
  "value": {
    // Event-specific payload
  }
}
```

### user.created

**Producer**: Auth Service  
**Consumers**: Email Service

**Payload**:
```json
{
  "userId": "user_xxx",
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Purpose**: Notify services when a new user is created

**Actions**:
- Email Service: Send welcome email

---

### order.created

**Producer**: Order Service  
**Consumers**: Email Service

**Payload**:
```json
{
  "orderId": "order_xxx",
  "userId": "user_xxx",
  "email": "user@example.com",
  "amount": 99999,
  "status": "success",
  "products": [
    {
      "name": "Laptop",
      "quantity": 1,
      "price": 99999
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Purpose**: Notify services when an order is created

**Actions**:
- Email Service: Send order confirmation email

---

### payment.success

**Producer**: Payment Service  
**Consumers**: Order Service

**Payload**:
```json
{
  "sessionId": "cs_test_xxx",
  "userId": "user_xxx",
  "email": "user@example.com",
  "amount": 99999,
  "products": [
    {
      "name": "Laptop",
      "quantity": 1,
      "price": 99999
    }
  ],
  "stripeCustomerId": "cus_xxx",
  "paymentIntentId": "pi_xxx",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Purpose**: Notify services when payment is successful

**Actions**:
- Order Service: Create order record with status "success"
- Order Service: Publish `order.created` event

---

## Error Handling

### Standard Error Response

All services return errors in this format:

```json
{
  "message": "Error description",
  "status": 400,
  "error": "Bad Request"
}
```

### HTTP Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., duplicate)
- **500 Internal Server Error**: Server error

### Common Error Scenarios

#### Authentication Error

```json
{
  "message": "Unauthorized",
  "status": 401,
  "error": "Missing or invalid authentication token"
}
```

#### Validation Error

```json
{
  "message": "Validation failed",
  "status": 400,
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### Not Found Error

```json
{
  "message": "Product not found",
  "status": 404,
  "error": "Not Found"
}
```

#### Permission Error

```json
{
  "message": "Insufficient permissions",
  "status": 403,
  "error": "Forbidden"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider:

- API Gateway with rate limiting
- Redis-based rate limiting per user
- Different limits for different endpoints

---

## Pagination

For endpoints that return lists, use these query parameters:

- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

**Example**:
```http
GET /products?limit=20&offset=40
```

**Response includes**:
```json
{
  "data": [...],
  "total": 150,
  "limit": 20,
  "offset": 40
}
```

---

## Versioning

Currently, the API is unversioned. For future versions, consider:

- URL versioning: `/v1/products`, `/v2/products`
- Header versioning: `Accept: application/vnd.api.v1+json`

---

## CORS Configuration

### Product Service
- Allowed origins: `http://localhost:3002`, `http://localhost:3003`
- Credentials: Enabled

### Order Service
- Allowed origins: `http://localhost:3002`, `http://localhost:3003`
- Credentials: Enabled

### Payment Service
- Allowed origins: `http://localhost:3002`
- Credentials: Enabled

### Auth Service
- Allowed origins: `http://localhost:3003`
- Credentials: Enabled

---

## Testing APIs

### Using cURL

```bash
# Get products
curl http://localhost:8000/products

# Create product (with auth)
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Laptop","price":99999,...}'
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables for base URLs
3. Configure Clerk authentication
4. Test endpoints

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create collections for each service
3. Set up authentication
4. Test endpoints

---

## WebSocket Support

Currently, no WebSocket support. For real-time features, consider:

- Socket.io for real-time order updates
- Server-Sent Events for notifications
- GraphQL subscriptions

---

## GraphQL Alternative

This API uses REST. For GraphQL, consider:

- Apollo Server
- GraphQL gateway over microservices
- Schema stitching

---

## Additional Resources

- **Clerk API Docs**: https://clerk.com/docs
- **Stripe API Docs**: https://stripe.com/docs/api
- **Kafka Docs**: https://kafka.apache.org/documentation/
- **Prisma Docs**: https://www.prisma.io/docs
- **Mongoose Docs**: https://mongoosejs.com/docs/

---

For more information, see the main [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).
