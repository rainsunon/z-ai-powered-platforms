# Supabase Configuration Guide

## Database Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your database credentials

2. **Run the Migration Script**
   - Navigate to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `src/main/resources/db/migration/V1__init_schema.sql`
   - Execute the script to create tables with JSONB columns and GIN indexes

3. **Configure Application Properties**
   Update `src/main/resources/application.properties`:
   ```properties
   DB_URL=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

## Advanced JSONB Features

### GIN Indexes
The migration script creates GIN (Generalized Inverted Index) indexes on all JSONB columns:
- `idx_clients_preferences` - Fast queries on client preferences
- `idx_expenses_metadata` - Fast queries on expense metadata
- `idx_invoices_line_items` - Fast queries on invoice line items

### JSONB Query Operators

#### Containment (`@>`)
Find records where JSONB contains specific key-value pairs:
```sql
-- Find clients with dark theme
SELECT * FROM clients WHERE preferences @> '{"theme": "dark"}';

-- Find expenses with receipt attached
SELECT * FROM expenses WHERE metadata @> '{"hasReceipt": true}';
```

#### Key Existence (`??`)
Find records where JSONB has a specific key:
```sql
-- Find clients who have set a theme preference
SELECT * FROM clients WHERE preferences ?? 'theme';

-- Find expenses with receipt name
SELECT * FROM expenses WHERE metadata ?? 'receiptName';
```

### GraphQL Queries

The enhanced service layer exposes JSONB queries via GraphQL (you can add these to the schema):

```graphql
# Find clients with specific preferences
query {
  clientsByPreferences(filter: "{\"theme\": \"dark\"}") {
    id
    name
    preferences
  }
}

# Find expenses with specific metadata
query {
  expensesByMetadata(filter: "{\"category\": \"travel\"}") {
    id
    merchant
    metadata
  }
}
```

## Performance Tips

1. **Use GIN indexes** for JSONB queries (already configured in migration)
2. **Limit JSONB depth** - Keep nested structures shallow for better performance
3. **Use specific queries** - Prefer `@>` over complex JSON path queries when possible
4. **Monitor query performance** - Use Supabase's built-in query analyzer

## Example Data

### Client with Preferences
```json
{
  "id": "uuid",
  "name": "John Doe",
  "preferences": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": false
    },
    "language": "en"
  }
}
```

### Expense with Metadata
```json
{
  "id": "uuid",
  "merchant": "Office Supplies Inc",
  "metadata": {
    "receiptName": "receipt_2024_001.pdf",
    "merchantLogo": "https://...",
    "tags": ["office", "supplies"],
    "customFields": {
      "project": "Q1-2024",
      "department": "Engineering"
    }
  }
}
```
