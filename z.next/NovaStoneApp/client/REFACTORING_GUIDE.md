# Frontend Refactoring Guide

## Overview

This guide documents the comprehensive refactoring of the NovaStone React frontend application. The refactoring focuses on:

1. **Centralized State Management** with Zustand
2. **Component Composition** - breaking large components into smaller, reusable pieces
3. **Consistent UI Patterns** - shared components for forms, tables, modals, etc.
4. **TypeScript Type Safety** - strong typing throughout the application

## Table of Contents

- [State Management](#state-management)
- [Component Architecture](#component-architecture)
- [Reusable Components](#reusable-components)
- [Refactored Pages](#refactored-pages)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)

---

## State Management

### Zustand Stores

The application now uses Zustand for centralized state management. All stores are defined in `/client/src/store/stores.ts`.

#### Available Stores

1. **useAuthStore** - Authentication state
```typescript
const { user, token, isAuthenticated, setUser, logout } = useAuthStore();
```

2. **useCustomerStore** - Customer management
```typescript
const { customers, addCustomer, updateCustomer, deleteCustomer, selectCustomer } = useCustomerStore();
```

3. **useProductStore** - Product/service management
```typescript
const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
```

4. **useInvoiceStore** - Invoice management
```typescript
const { invoices, addInvoice, updateInvoice, deleteInvoice } = useInvoiceStore();
```

5. **useSaleStore** - Sales tracking
```typescript
const { sales, addSale, updateSale, deleteSale } = useSaleStore();
```

6. **useTransactionStore** - Transaction management
```typescript
const { transactions, addTransaction, updateTransaction } = useTransactionStore();
```

7. **useUIStore** - UI state (modals, sidebar, theme)
```typescript
const { modal, openModal, closeModal, sidebarOpen, toggleSidebar } = useUIStore();
```

### State Persistence

- **Auth Store**: Persisted to localStorage as `novastone-auth-storage`
- **UI Store**: Persisted to localStorage as `novastone-ui-storage`
- Other stores: Not persisted (fetch from API on mount)

### Store Actions

Each entity store follows a consistent pattern:

```typescript
interface EntityStore {
  items: Entity[];           // State
  selectedItem: Entity | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items) => void;
  addItem: (item) => void;
  updateItem: (id, updates) => void;
  deleteItem: (id) => void;
  selectItem: (item) => void;
  setLoading: (loading) => void;
  setError: (error) => void;
}
```

---

## Component Architecture

### Design Principles

1. **Single Responsibility**: Each component does one thing well
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props over State**: Keep components stateless when possible
4. **TypeScript First**: All components are strongly typed

### Component Hierarchy

```
pages/                    # Page-level components
  CustomersRefactored.tsx # Uses stores + reusable components
  
components/
  ui/                     # Generic UI components
    Button.tsx
    Card.tsx
    DataTable.tsx
    FormControls.tsx
    Modal.tsx
    Common.tsx
    
  customers/              # Feature-specific components
    CustomerForm.tsx
    
  invoices/               # (To be created)
  sales/                  # (To be created)
```

---

## Reusable Components

### Form Components

**Location**: `/client/src/components/ui/FormControls.tsx`

#### FormInput
```tsx
<FormInput
  label="Customer Name"
  required
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={nameError}
  helperText="Enter the full legal name"
/>
```

#### FormTextarea
```tsx
<FormTextarea
  label="Notes"
  rows={4}
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>
```

#### FormSelect
```tsx
<FormSelect
  label="Status"
  options={[
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ]}
  value={status}
  onChange={(e) => setStatus(e.target.value)}
/>
```

#### FormCheckbox
```tsx
<FormCheckbox
  label="Send email notification"
  description="Customer will receive an email"
  checked={sendEmail}
  onChange={(e) => setSendEmail(e.target.checked)}
/>
```

### Button Components

**Location**: `/client/src/components/ui/Button.tsx`

#### Button
```tsx
<Button
  variant="primary" // primary, secondary, outline, ghost, danger
  size="md"         // sm, md, lg
  icon={Plus}
  onClick={handleClick}
  isLoading={loading}
>
  Add Customer
</Button>
```

#### IconButton
```tsx
<IconButton
  icon={Edit}
  variant="ghost"
  size="md"
  onClick={handleEdit}
/>
```

### Modal Components

**Location**: `/client/src/components/ui/Modal.tsx`

#### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Add Customer"
  size="lg"          // sm, md, lg, xl, full
>
  <form>...</form>
</Modal>
```

#### ConfirmDialog
```tsx
<ConfirmDialog
  isOpen={!!deleteItem}
  onClose={() => setDeleteItem(null)}
  onConfirm={handleConfirm}
  title="Delete Customer"
  message="Are you sure?"
  variant="danger"   // danger, warning, info
  confirmText="Delete"
  cancelText="Cancel"
/>
```

### Table Components

**Location**: `/client/src/components/ui/DataTable.tsx`

#### DataTable
```tsx
<DataTable
  data={customers}
  columns={[
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (customer) => <strong>{customer.name}</strong>
    },
    {
      key: "email",
      header: "Email",
      render: (customer) => customer.email || "-"
    }
  ]}
  onRowClick={(customer) => handleRowClick(customer)}
  emptyMessage="No customers found"
  isLoading={loading}
/>
```

#### ActionMenu
```tsx
<ActionMenu
  items={[
    {
      label: "Edit",
      icon: <Edit size={16} />,
      onClick: () => handleEdit()
    },
    { label: "---", onClick: () => {} }, // Divider
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      onClick: () => handleDelete(),
      variant: "danger"
    }
  ]}
  align="right"  // left or right
/>
```

### Card Components

**Location**: `/client/src/components/ui/Card.tsx`

#### Card
```tsx
<Card
  padding="md"
  hoverable
  onClick={handleClick}
>
  Content here
</Card>
```

#### StatCard
```tsx
<StatCard
  title="Total Revenue"
  value={12450.50}
  icon={DollarSign}
  trend={{ value: 12, isPositive: true }}
  subtitle="vs last month"
/>
```

#### DashboardCard
```tsx
<DashboardCard
  title="Recent Invoices"
  action={<Button size="sm">View All</Button>}
>
  <InvoiceList />
</DashboardCard>
```

### Common Components

**Location**: `/client/src/components/ui/Common.tsx`

#### SearchBar
```tsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search customers..."
/>
```

#### Badge
```tsx
<Badge variant="success" size="sm">
  Paid
</Badge>
```

#### EmptyState
```tsx
<EmptyState
  icon={<Inbox size={48} />}
  title="No customers yet"
  description="Add your first customer to get started"
  action={<Button>Add Customer</Button>}
/>
```

#### LoadingSpinner
```tsx
<LoadingSpinner size="lg" />
```

---

## Refactored Pages

### Customers Page

**Location**: `/client/src/pages/CustomersRefactored.tsx`

#### Before (Original)
- 400+ lines of code
- Local state with useState
- Inline table rendering
- Inline modal rendering
- Duplicated action menu code

#### After (Refactored)
- ~220 lines of code
- Zustand store for state
- Reusable DataTable component
- Extracted CustomerForm component
- ActionMenu component for actions

#### Key Improvements

1. **State Management**: Uses `useCustomerStore` instead of local useState
2. **DataTable**: Replaced 150+ lines of table code with DataTable component
3. **Modals**: Extracted to CustomerForm and ImportCustomersModal components
4. **Type Safety**: Strong TypeScript types throughout
5. **Consistency**: Uses shared Button, SearchBar, Badge components

#### Usage Example

```typescript
import { CustomersPage } from "./pages/CustomersRefactored";

// In your router
<Route path="/customers" element={<CustomersPage />} />
```

---

## Migration Guide

### Step 1: Update Imports

Replace old page imports with refactored versions:

```typescript
// Before
import { CustomersPage } from "./pages/Customers";

// After  
import { CustomersPage } from "./pages/CustomersRefactored";
```

### Step 2: Initialize Mock Data

If not using API yet, initialize stores with mock data:

```typescript
// In your page component
React.useEffect(() => {
  // TODO: Replace with actual API call
  const mockCustomers = [
    { id: "1", name: "AARON Consulting", /* ... */ }
  ];
  setCustomers(mockCustomers);
}, []);
```

### Step 3: Connect to Backend API

Replace mock data with actual API calls:

```typescript
React.useEffect(() => {
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };
  
  fetchCustomers();
}, []);
```

### Step 4: Update Modal Usage

Use the centralized modal state from useUIStore:

```typescript
const { openModal, closeModal, modal } = useUIStore();

// Open modal
<Button onClick={() => openModal("addCustomer")}>
  Add Customer
</Button>

// Render modal
<CustomerForm
  isOpen={modal.isOpen && modal.type === "addCustomer"}
  onClose={closeModal}
/>
```

---

## Best Practices

### 1. Component Composition

Break components into smaller pieces:

```typescript
// ❌ Bad: One large component
function CustomerPage() {
  return (
    <div>
      <header>...</header>
      <table>...</table>
      <form>...</form>
      <modal>...</modal>
    </div>
  );
}

// ✅ Good: Composed components
function CustomerPage() {
  return (
    <div>
      <CustomerHeader />
      <CustomerTable />
      <CustomerForm />
    </div>
  );
}
```

### 2. Store Usage

Use stores for shared state, not local UI state:

```typescript
// ❌ Bad: Everything in store
const { isModalOpen, setIsModalOpen } = useUIStore();

// ✅ Good: Local UI state
const [isModalOpen, setIsModalOpen] = useState(false);

// ✅ Good: Shared data in store
const { customers, addCustomer } = useCustomerStore();
```

### 3. TypeScript Types

Always type your props and state:

```typescript
// ❌ Bad: No types
function CustomerForm({ customer, onSave }) {
  // ...
}

// ✅ Good: Strong types
interface CustomerFormProps {
  customer?: Customer | null;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  // ...
}
```

### 4. Component Reusability

Make components configurable through props:

```typescript
// ❌ Bad: Hardcoded values
function Button() {
  return <button className="bg-blue-600 px-4 py-2">Click</button>;
}

// ✅ Good: Configurable
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

function Button({ variant = "primary", size = "md", children }: ButtonProps) {
  return <button className={getButtonClasses(variant, size)}>{children}</button>;
}
```

### 5. Error Handling

Always handle loading and error states:

```typescript
const { customers, isLoading, error } = useCustomerStore();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
if (customers.length === 0) return <EmptyState />;

return <CustomerTable data={customers} />;
```

---

## Next Steps

### Recommended Refactoring Order

1. ✅ **Customers Page** - Completed
2. **Invoices Page** - High priority (complex forms, line items)
3. **Sales Page** - High priority (similar to invoices)
4. **Dashboard Page** - Medium priority (charts, metrics)
5. **Products Page** - Low priority (simpler CRUD)
6. **Transactions Page** - Low priority (similar to customers)

### Additional Components to Create

1. **LineItemsTable** - Reusable for invoices, sales, estimates, purchases
2. **DateRangePicker** - For filtering by date
3. **StatusBadge** - For invoice/sale status display
4. **ChartWrapper** - For dashboard charts
5. **FilterBar** - For advanced filtering

### API Integration

1. Create API client in `/client/src/lib/api.ts`
2. Add React Query for caching and mutations
3. Update stores to use API calls instead of local state
4. Add optimistic updates for better UX

---

## Summary

This refactoring provides:

- ✅ **Centralized state** with Zustand
- ✅ **Reusable components** (8 component files created)
- ✅ **Type safety** throughout
- ✅ **Smaller components** (400+ lines → 220 lines for Customers)
- ✅ **Consistent patterns** across pages
- ✅ **Better maintainability** and testability

The foundation is now in place to quickly refactor remaining pages using the same patterns and components.
