# PostgreSQL JSONB Usage in NovaStone

This document explains how JSONB is used throughout the NovaStone backend for flexible data storage.

## Why JSONB?

PostgreSQL's JSONB (JSON Binary) provides:

1. **Flexibility**: Store complex, nested data without rigid schema constraints
2. **Performance**: Binary format with indexing support (GIN indexes)
3. **Type Safety**: Still validated at the application level with Zod
4. **Extensibility**: Easy to add custom fields per user requirements
5. **Querying**: Rich query capabilities with JSON operators

## JSONB Fields by Model

### Customer Model

#### `address` (JSONB)
Stores complete address information:
```json
{
  "street": "123 Business Ave",
  "suite": "Suite 100",
  "city": "San Francisco",
  "state": "CA",
  "zip": "94102",
  "country": "USA",
  "coordinates": {
    "lat": 37.7749,
    "lng": -122.4194
  },
  "isVerified": true,
  "verificationDate": "2026-01-15"
}
```

#### `contacts` (JSONB)
Array of contact persons:
```json
[
  {
    "id": "contact_1",
    "name": "John Doe",
    "email": "john@company.com",
    "phone": "+1-555-0123",
    "role": "Finance Manager",
    "department": "Accounting",
    "isPrimary": true,
    "notes": "Prefers email communication"
  },
  {
    "id": "contact_2",
    "name": "Jane Smith",
    "email": "jane@company.com",
    "phone": "+1-555-0124",
    "role": "Procurement",
    "isPrimary": false
  }
]
```

#### `paymentInfo` (JSONB)
Payment methods and preferences:
```json
{
  "preferredMethod": "bank_transfer",
  "creditCards": [
    {
      "id": "card_1",
      "lastFour": "4242",
      "brand": "Visa",
      "expiryMonth": 12,
      "expiryYear": 2027,
      "isDefault": true
    }
  ],
  "bankAccounts": [
    {
      "id": "bank_1",
      "accountName": "Company Business Account",
      "accountNumber": "****1234",
      "routingNumber": "****5678",
      "bankName": "First National Bank",
      "accountType": "checking"
    }
  ],
  "creditLimit": 50000,
  "paymentTerms": "Net 30",
  "autoPayEnabled": false
}
```

#### `customFields` (JSONB)
User-defined custom fields:
```json
{
  "industryType": "Technology",
  "companySize": "50-200",
  "annualRevenue": "5M-10M",
  "website": "https://company.com",
  "linkedin": "https://linkedin.com/company/...",
  "taxId": "12-3456789",
  "referralSource": "LinkedIn Campaign",
  "accountManager": "Alice Johnson",
  "loyaltyTier": "Gold",
  "lifetimeValue": 250000,
  "preferredCommunication": "email",
  "timezone": "America/Los_Angeles"
}
```

---

### Product Model

#### `pricing` (JSONB)
Complex pricing structures:
```json
{
  "cost": 500,
  "markup": 200,
  "msrp": 2999,
  "currency": "USD",
  "tiers": [
    {
      "minQty": 1,
      "maxQty": 10,
      "price": 2999,
      "description": "Individual"
    },
    {
      "minQty": 11,
      "maxQty": 50,
      "price": 2499,
      "description": "Small Business"
    },
    {
      "minQty": 51,
      "price": 1999,
      "description": "Enterprise"
    }
  ],
  "discountRules": [
    {
      "type": "volume",
      "threshold": 10,
      "discount": 15,
      "unit": "percentage"
    },
    {
      "type": "seasonal",
      "season": "Q4",
      "discount": 10,
      "startDate": "2026-10-01",
      "endDate": "2026-12-31"
    }
  ],
  "taxRate": 0.08,
  "taxExempt": false
}
```

#### `inventory` (JSONB)
Inventory tracking:
```json
{
  "quantity": 500,
  "reserved": 50,
  "available": 450,
  "sku": "ENT-SW-2024",
  "barcode": "123456789012",
  "warehouse": {
    "id": "wh_001",
    "name": "Seattle Main",
    "location": "Building A, Aisle 5"
  },
  "reorderPoint": 50,
  "reorderQuantity": 200,
  "leadTimeDays": 14,
  "lastRestocked": "2026-04-01",
  "nextReorderDate": "2026-05-15",
  "supplier": {
    "id": "sup_001",
    "name": "TechSupply Co",
    "contactEmail": "orders@techsupply.com"
  }
}
```

#### `variants` (JSONB)
Product variations:
```json
[
  {
    "id": "var_basic",
    "name": "Basic Edition",
    "sku": "ENT-SW-2024-BASIC",
    "price": 1999,
    "inventory": 200,
    "features": [
      "Core Features",
      "Email Support",
      "Basic Analytics"
    ],
    "images": ["https://example.com/basic-1.jpg"]
  },
  {
    "id": "var_pro",
    "name": "Professional Edition",
    "sku": "ENT-SW-2024-PRO",
    "price": 2999,
    "inventory": 150,
    "features": [
      "All Basic Features",
      "Advanced Analytics",
      "Priority Support",
      "API Access"
    ],
    "images": ["https://example.com/pro-1.jpg"]
  }
]
```

---

### Invoice Model

#### `lineItems` (JSONB)
Detailed line items:
```json
[
  {
    "id": "line_1",
    "productId": "prod_123",
    "description": "IT Consulting Services - April 2026",
    "quantity": 40,
    "unit": "hours",
    "price": 150,
    "subtotal": 6000,
    "tax": 0.08,
    "taxAmount": 480,
    "discount": 0,
    "discountAmount": 0,
    "total": 6480,
    "notes": "Includes project planning and implementation"
  },
  {
    "id": "line_2",
    "productId": "prod_456",
    "description": "Software License - Annual",
    "quantity": 5,
    "unit": "licenses",
    "price": 2999,
    "subtotal": 14995,
    "tax": 0.08,
    "taxAmount": 1199.6,
    "discount": 0.10,
    "discountAmount": 1499.5,
    "total": 14695.1,
    "notes": "Volume discount applied"
  }
]
```

#### `payments` (JSONB)
Payment history:
```json
{
  "payments": [
    {
      "id": "pay_1",
      "date": "2026-04-24T15:30:00Z",
      "amount": 5000,
      "method": "credit_card",
      "transactionId": "txn_abc123",
      "status": "completed",
      "cardLastFour": "4242",
      "receiptUrl": "https://storage.com/receipt_1.pdf"
    },
    {
      "id": "pay_2",
      "date": "2026-05-01T10:15:00Z",
      "amount": 10000,
      "method": "bank_transfer",
      "transactionId": "txn_def456",
      "status": "completed",
      "bankReference": "REF-2026-5001"
    }
  ],
  "totalPaid": 15000,
  "balance": 4175.1
}
```

#### `taxDetails` (JSONB)
Tax breakdown:
```json
{
  "subtotal": 20995,
  "taxRate": 0.08,
  "taxAmount": 1679.6,
  "taxType": "Sales Tax",
  "taxJurisdiction": "CA",
  "itemizedTaxes": [
    {
      "description": "State Tax",
      "rate": 0.06,
      "amount": 1259.7
    },
    {
      "description": "Local Tax",
      "rate": 0.02,
      "amount": 419.9
    }
  ],
  "discountAmount": 1499.5,
  "shippingAmount": 0,
  "total": 19175.1
}
```

#### `reminders` (JSONB)
Automated reminders:
```json
{
  "enabled": true,
  "schedule": [
    {
      "id": "rem_1",
      "type": "before_due",
      "days": -7,
      "sent": true,
      "sentAt": "2026-04-17T09:00:00Z",
      "status": "delivered"
    },
    {
      "id": "rem_2",
      "type": "on_due_date",
      "days": 0,
      "sent": false,
      "scheduledFor": "2026-04-24T09:00:00Z"
    },
    {
      "id": "rem_3",
      "type": "after_due",
      "days": 7,
      "sent": false,
      "scheduledFor": "2026-05-01T09:00:00Z"
    }
  ],
  "customMessage": "Friendly reminder about your upcoming invoice",
  "escalation": {
    "enabled": true,
    "escalateAfterDays": 30,
    "escalateTo": "manager@company.com"
  }
}
```

---

### Transaction Model

#### `tags` (JSONB)
Flexible categorization:
```json
[
  "consulting",
  "q1-2026",
  "tech-innovations",
  "paid",
  "high-value",
  "west-coast",
  "project-042"
]
```

#### `relatedTo` (JSONB)
Link to other entities:
```json
{
  "type": "invoice",
  "id": "inv_clx123",
  "reference": "INV-2026-0042",
  "description": "Q1 Consulting Services",
  "amount": 15000,
  "links": [
    {
      "type": "sale",
      "id": "sle_001",
      "reference": "SLE-001"
    },
    {
      "type": "project",
      "id": "proj_042",
      "name": "Tech Innovations Q1 Project"
    }
  ]
}
```

---

## Querying JSONB in Prisma

### Basic JSONB Queries

```typescript
// Find customers in Seattle
const seattleCustomers = await prisma.customer.findMany({
  where: {
    address: {
      path: ['city'],
      equals: 'Seattle'
    }
  }
});

// Find products with Software category
const softwareProducts = await prisma.product.findMany({
  where: {
    categories: {
      path: [],
      array_contains: 'Software'
    }
  }
});

// Find invoices with total > $5000
const largeInvoices = await prisma.invoice.findMany({
  where: {
    taxDetails: {
      path: ['total'],
      gt: 5000
    }
  }
});
```

### Complex JSONB Queries

```typescript
// Find customers with Gold loyalty tier
const goldCustomers = await prisma.customer.findMany({
  where: {
    customFields: {
      path: ['loyaltyTier'],
      equals: 'Gold'
    }
  }
});

// Find products with inventory below reorder point
const lowStockProducts = await prisma.product.findMany({
  where: {
    inventory: {
      path: ['available'],
      lt: prisma.inventory.path(['reorderPoint'])
    }
  }
});

// Find transactions with specific tags
const taggedTransactions = await prisma.transaction.findMany({
  where: {
    tags: {
      path: [],
      array_contains: 'high-value'
    }
  }
});
```

---

## Benefits of JSONB Approach

### 1. **Flexibility**
Add custom fields without database migrations:
```typescript
// Add new custom field on the fly
await prisma.customer.update({
  where: { id: customerId },
  data: {
    customFields: {
      ...existingCustomFields,
      newField: 'value',
      anotherField: { nested: 'data' }
    }
  }
});
```

### 2. **Multi-tenant Support**
Different customers can have different fields:
```json
// Customer A
{ "customFields": { "industry": "Tech", "certifications": ["ISO9001"] } }

// Customer B
{ "customFields": { "veteranOwned": true, "minorityOwned": true } }
```

### 3. **Versioning**
Store historical data snapshots:
```json
{
  "customerInfo": {
    "snapshot": "2026-04-24",
    "data": { /* customer data at time of sale */ }
  }
}
```

### 4. **Complex Relationships**
Store denormalized data for performance:
```json
{
  "lineItems": [
    {
      "productSnapshot": {
        /* Full product details at time of invoice */
      }
    }
  ]
}
```

---

## Best Practices

1. **Validate JSONB data** with Zod schemas at the application level
2. **Index frequently queried fields** using GIN indexes
3. **Keep JSONB documents relatively small** (< 1MB)
4. **Use consistent structure** across similar JSONB fields
5. **Document JSONB schemas** in your code comments
6. **Consider partitioning** for large JSONB arrays

---

## Performance Considerations

### Adding GIN Indexes (PostgreSQL)

```sql
-- Index on customer address
CREATE INDEX idx_customer_address ON customers USING GIN (address);

-- Index on product categories
CREATE INDEX idx_product_categories ON products USING GIN (categories);

-- Index on invoice line items
CREATE INDEX idx_invoice_line_items ON invoices USING GIN ("lineItems");
```

### Query Optimization

```typescript
// Good: Specific path query
where: {
  address: { path: ['city'], equals: 'Seattle' }
}

// Avoid: Full JSONB scan
where: {
  address: { contains: 'Seattle' } // Slow!
}
```

---

This JSONB approach provides NovaStone with the flexibility of NoSQL databases while maintaining the ACID guarantees and relational capabilities of PostgreSQL.
