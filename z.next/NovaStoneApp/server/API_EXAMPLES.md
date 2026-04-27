# NovaStone API Examples

This document provides example API requests and responses for testing the NovaStone API.

## Authentication

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "clx123456789",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2026-05-01T00:00:00.000Z"
  }
}
```

---

## Customers

### Create Customer with JSONB Fields
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Innovations Inc",
    "email": "contact@techinnovations.com",
    "phone": "+1-555-0123",
    "address": {
      "street": "789 Innovation Drive",
      "city": "Seattle",
      "state": "WA",
      "zip": "98101",
      "country": "USA",
      "coordinates": {
        "lat": 47.6062,
        "lng": -122.3321
      }
    },
    "contacts": [
      {
        "name": "Alice Johnson",
        "email": "alice@techinnovations.com",
        "phone": "+1-555-0124",
        "role": "CTO",
        "isPrimary": true
      },
      {
        "name": "Bob Smith",
        "email": "bob@techinnovations.com",
        "phone": "+1-555-0125",
        "role": "Finance Director",
        "isPrimary": false
      }
    ],
    "paymentInfo": {
      "preferredMethod": "bank_transfer",
      "bankAccount": {
        "accountName": "Tech Innovations Inc",
        "accountNumber": "****1234",
        "routingNumber": "****5678",
        "bankName": "First National Bank"
      },
      "creditLimit": 50000,
      "paymentTerms": "Net 30"
    },
    "customFields": {
      "industryType": "Software",
      "companySize": "50-200",
      "annualRevenue": "5M-10M",
      "referralSource": "LinkedIn",
      "loyaltyTier": "Gold"
    }
  }'
```

### Get All Customers
```bash
curl -X GET http://localhost:3000/api/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Single Customer
```bash
curl -X GET http://localhost:3000/api/customers/CUSTOMER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Customer
```bash
curl -X PATCH http://localhost:3000/api/customers/CUSTOMER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1-555-9999",
    "customFields": {
      "loyaltyTier": "Platinum",
      "lastContactDate": "2026-04-24"
    }
  }'
```

---

## Products

### Create Product with JSONB Fields
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enterprise Software License",
    "description": "Full-featured enterprise software with support",
    "price": 2999,
    "sellThis": true,
    "buyThis": false,
    "pricing": {
      "cost": 500,
      "markup": 499.8,
      "tiers": [
        { "minQty": 1, "maxQty": 10, "price": 2999 },
        { "minQty": 11, "maxQty": 50, "price": 2499 },
        { "minQty": 51, "price": 1999 }
      ],
      "discountRules": [
        { "type": "volume", "threshold": 10, "discount": 15 },
        { "type": "seasonal", "season": "Q4", "discount": 10 }
      ],
      "taxRate": 0.08
    },
    "inventory": {
      "quantity": 500,
      "sku": "ENT-SW-2024",
      "barcode": "123456789012",
      "warehouse": "Seattle-Main",
      "reorderPoint": 50,
      "reorderQuantity": 200,
      "lastRestocked": "2026-04-01"
    },
    "categories": ["Software", "Enterprise", "Subscription"],
    "images": [
      "https://example.com/product-main.jpg",
      "https://example.com/product-detail-1.jpg",
      "https://example.com/product-detail-2.jpg"
    ],
    "variants": [
      {
        "id": "basic",
        "name": "Basic Edition",
        "price": 1999,
        "features": ["Core Features", "Email Support"]
      },
      {
        "id": "pro",
        "name": "Professional Edition",
        "price": 2999,
        "features": ["All Basic", "Advanced Analytics", "Priority Support"]
      },
      {
        "id": "enterprise",
        "name": "Enterprise Edition",
        "price": 4999,
        "features": ["All Pro", "Custom Integration", "Dedicated Support"]
      }
    ],
    "customFields": {
      "manufacturer": "TechCorp",
      "warranty": "2 years",
      "supportLevel": "24/7",
      "deploymentType": "Cloud/On-Premise"
    }
  }'
```

---

## Invoices

### Create Invoice with JSONB Line Items
```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "date": "2026-04-24",
    "dueDate": "2026-05-24",
    "status": "unpaid",
    "currency": "USD",
    "lineItems": [
      {
        "id": "1",
        "description": "IT Consulting Services - April 2026",
        "quantity": 40,
        "price": 150,
        "tax": 0.08,
        "discount": 0,
        "total": 6480
      },
      {
        "id": "2",
        "description": "Software License - Annual",
        "quantity": 5,
        "price": 2999,
        "tax": 0.08,
        "discount": 0.10,
        "total": 14545.8
      }
    ],
    "taxDetails": {
      "subtotal": 20475,
      "taxRate": 0.08,
      "taxAmount": 1638,
      "discountAmount": 2999,
      "total": 19114
    },
    "discounts": {
      "type": "percentage",
      "value": 10,
      "reason": "Volume discount",
      "appliedTo": ["item_2"]
    },
    "notes": {
      "customerNote": "Thank you for your business! Payment due within 30 days.",
      "internalNote": "VIP customer - expedite processing",
      "termsAndConditions": "Payment terms: Net 30. Late fees: 1.5% per month."
    },
    "reminders": {
      "enabled": true,
      "schedule": [
        { "days": -7, "sent": false },
        { "days": 0, "sent": false },
        { "days": 7, "sent": false }
      ]
    },
    "customFields": {
      "projectCode": "PROJ-2026-042",
      "purchaseOrder": "PO-12345",
      "department": "IT Services"
    },
    "total": 19114,
    "amountDue": 19114
  }'
```

### Mark Invoice as Paid
```bash
curl -X POST http://localhost:3000/api/invoices/INVOICE_ID/pay \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Sales

### Create Sale with Complex JSONB Data
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CUSTOMER_ID",
    "category": "Services",
    "date": "2026-04-24",
    "dueDate": "2026-05-24",
    "amount": 15000,
    "currency": "USD",
    "lineItems": [
      {
        "id": "1",
        "description": "Web Development - Phase 1",
        "quantity": 100,
        "unitPrice": 100,
        "subtotal": 10000
      },
      {
        "id": "2",
        "description": "UI/UX Design Services",
        "quantity": 50,
        "unitPrice": 100,
        "subtotal": 5000
      }
    ],
    "paymentTerms": {
      "terms": "Net 30",
      "lateFee": "1.5% per month",
      "earlyPaymentDiscount": "2% if paid within 10 days",
      "installments": {
        "enabled": true,
        "schedule": [
          { "date": "2026-05-01", "amount": 7500, "status": "pending" },
          { "date": "2026-05-15", "amount": 7500, "status": "pending" }
        ]
      }
    },
    "customerInfo": {
      "name": "Tech Innovations Inc",
      "email": "contact@techinnovations.com",
      "phone": "+1-555-0123",
      "billingAddress": {
        "street": "789 Innovation Drive",
        "city": "Seattle",
        "state": "WA",
        "zip": "98101"
      },
      "shippingAddress": {
        "street": "789 Innovation Drive",
        "city": "Seattle",
        "state": "WA",
        "zip": "98101"
      }
    },
    "reminders": {
      "schedule": "weekly",
      "nextReminder": "2026-05-01",
      "customMessage": "Friendly reminder about your upcoming payment."
    },
    "customFields": {
      "salesRep": "John Smith",
      "region": "West Coast",
      "dealSize": "Large",
      "probability": 0.95
    }
  }'
```

---

## Transactions

### Create Transaction with JSONB Tags and Relations
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "income",
    "category": "Consulting Revenue",
    "amount": 15000,
    "currency": "USD",
    "date": "2026-04-24",
    "description": "Payment received for Q1 consulting services",
    "account": {
      "id": "acc_001",
      "name": "Business Checking",
      "type": "checking",
      "bank": "First National Bank",
      "lastFourDigits": "1234"
    },
    "tags": [
      "consulting",
      "q1-2026",
      "tech-innovations",
      "paid",
      "high-value"
    ],
    "attachments": [
      {
        "type": "receipt",
        "url": "https://storage.example.com/receipts/rec_123.pdf",
        "filename": "receipt_2026-04-24.pdf",
        "size": 245678,
        "uploadedAt": "2026-04-24T10:30:00Z"
      }
    ],
    "relatedTo": {
      "type": "invoice",
      "id": "inv_clx123",
      "reference": "INV-2026-0042",
      "description": "Q1 Consulting Services"
    },
    "customFields": {
      "projectCode": "PROJ-2026-042",
      "clientRegion": "West Coast",
      "paymentMethod": "Wire Transfer",
      "reconciled": true
    }
  }'
```

---

## Filtering and Querying

### Filter Invoices by Status
```bash
curl -X GET "http://localhost:3000/api/invoices?status=unpaid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Filter Sales by Category and Status
```bash
curl -X GET "http://localhost:3000/api/sales?category=Services&status=paid" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Filter Transactions by Type
```bash
curl -X GET "http://localhost:3000/api/transactions?type=income" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## JSONB Query Examples

### PostgreSQL JSONB Queries

The backend uses Prisma which allows querying JSONB fields. Here are some examples you might implement:

```typescript
// Find customers in a specific city
const customers = await prisma.customer.findMany({
  where: {
    address: {
      path: ['city'],
      equals: 'Seattle'
    }
  }
});

// Find products with specific tags
const products = await prisma.product.findMany({
  where: {
    categories: {
      path: [],
      array_contains: ['Software']
    }
  }
});

// Find invoices with amount over $5000
const invoices = await prisma.invoice.findMany({
  where: {
    taxDetails: {
      path: ['total'],
      gt: 5000
    }
  }
});
```

---

## Testing with CURL

Save your JWT token for easier testing:
```bash
export TOKEN="your_jwt_token_here"

# Now use it in requests
curl -X GET http://localhost:3000/api/customers \
  -H "Authorization: Bearer $TOKEN"
```

---

## Postman Collection

Import this into Postman for easy API testing:

1. Create a new collection named "NovaStone API"
2. Add environment variables:
   - `base_url`: http://localhost:3000
   - `token`: (will be set after login)
3. Add all the endpoints above
4. Use `{{base_url}}` and `{{token}}` in your requests

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here",
  "details": "Additional details if available"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `500` - Internal Server Error
