# Feature-Based Folder Structure Migration

## Overview

The React frontend has been successfully refactored from a type-based structure to a **feature-based folder structure**. This organization improves code discoverability, maintainability, and scalability.

## New Folder Structure

```
client/src/
├── features/                      # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   └── AuthLayout.tsx
│   │   ├── pages/
│   │   │   └── Auth.tsx
│   │   ├── store/
│   │   │   └── authStore.ts
│   │   └── index.ts              # Barrel exports
│   │
│   ├── customers/
│   │   ├── components/
│   │   │   └── CustomerForm.tsx
│   │   ├── pages/
│   │   │   ├── Customers.tsx
│   │   │   └── CustomersRefactored.tsx
│   │   ├── store/
│   │   │   └── customerStore.ts
│   │   └── index.ts
│   │
│   ├── invoices/
│   │   ├── pages/
│   │   │   └── Invoices.tsx
│   │   ├── store/
│   │   │   └── invoiceStore.ts
│   │   └── index.ts
│   │
│   ├── sales/
│   │   ├── pages/
│   │   │   ├── Sales.tsx
│   │   │   └── SalesDashboard.tsx
│   │   ├── store/
│   │   │   └── saleStore.ts
│   │   └── index.ts
│   │
│   ├── products/
│   │   ├── pages/
│   │   │   └── ProductsServices.tsx
│   │   ├── store/
│   │   │   └── productStore.ts
│   │   └── index.ts
│   │
│   ├── transactions/
│   │   ├── pages/
│   │   │   └── Transactions.tsx
│   │   ├── store/
│   │   │   └── transactionStore.ts
│   │   └── index.ts
│   │
│   ├── purchases/
│   │   ├── pages/
│   │   │   └── Purchases.tsx
│   │   └── index.ts
│   │
│   ├── estimates/
│   │   ├── pages/
│   │   │   └── Estimates.tsx
│   │   └── index.ts
│   │
│   ├── reports/
│   │   ├── pages/
│   │   │   └── Reports.tsx
│   │   └── index.ts
│   │
│   ├── settings/
│   │   ├── pages/
│   │   │   └── Settings.tsx
│   │   └── index.ts
│   │
│   └── dashboard/
│       ├── pages/
│       │   └── Dashboard.tsx
│       └── index.ts
│
├── shared/                        # Shared/common modules
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Common.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── FormControls.tsx
│   │   │   └── Modal.tsx
│   │   └── layout/               # Layout components
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── store/
│   │   └── uiStore.ts           # Global UI state
│   ├── hooks/                    # Custom React hooks
│   └── types/                    # Shared TypeScript types
│
├── lib/                          # Utilities
│   ├── auth.ts
│   └── utils.ts
│
├── i18n/                         # Internationalization
│   └── config.ts
│
├── App.tsx                       # Root component
├── main.tsx                      # Entry point
└── index.css                     # Global styles
```

## Key Changes

### 1. **Feature Modules**

Each feature is self-contained with its own:
- **Components**: Feature-specific UI components
- **Pages**: Route-level page components
- **Store**: Zustand state management
- **index.ts**: Barrel exports for clean imports

### 2. **Shared Resources**

Common code moved to `shared/`:
- **UI Components**: Reusable components (Button, Modal, DataTable, etc.)
- **Layout Components**: Header, Sidebar
- **UI Store**: Global UI state (modals, theme, sidebar)
- **Hooks & Types**: Shared utilities

### 3. **Import Path Changes**

| Old Import | New Import |
|------------|------------|
| `@/src/components/ui/Button` | `@/shared/components/ui/Button` |
| `@/src/components/layout/Header` | `@/shared/components/layout/Header` |
| `@/src/store/stores` | `@/features/[feature]/store/[feature]Store` |
| `@/src/pages/Customers` | `@/features/customers/pages/Customers` |

### 4. **Barrel Exports**

Each feature has an `index.ts` that exports its public API:

```typescript
// features/customers/index.ts
export { CustomerForm } from "./components/CustomerForm";
export { useCustomerStore } from "./store/customerStore";
export type { Customer } from "./store/customerStore";
```

Usage:
```typescript
import { useCustomerStore, Customer } from "@/features/customers";
```

## Migration Guide

### For New Features

1. **Create feature folder**:
   ```bash
   mkdir -p features/my-feature/{components,pages,store}
   ```

2. **Add feature files**:
   - `store/myFeatureStore.ts` - Zustand store
   - `components/MyComponent.tsx` - Feature components
   - `pages/MyFeaturePage.tsx` - Page components

3. **Create barrel export** (`index.ts`):
   ```typescript
   export { MyComponent } from "./components/MyComponent";
   export { useMyFeatureStore } from "./store/myFeatureStore";
   ```

4. **Import in App.tsx**:
   ```typescript
   import { MyFeaturePage } from "@/features/my-feature/pages/MyFeaturePage";
   ```

### For Existing Features

If you need to add to an existing feature:

1. **Navigate to feature folder**: `features/[feature-name]/`
2. **Add component/page/store** in appropriate subfolder
3. **Export from index.ts** if it's part of the public API
4. **Import using feature path**: `@/features/[feature-name]`

## Benefits

### 1. **Colocation**
Related code lives together, making it easier to understand and maintain features.

### 2. **Encapsulation**
Each feature can be developed, tested, and understood independently.

### 3. **Scalability**
New features can be added without affecting existing ones.

### 4. **Clear Dependencies**
Feature boundaries make it obvious when one feature depends on another.

### 5. **Easier Refactoring**
Moving or renaming features is simpler when code is colocated.

### 6. **Better Code Splitting**
Feature-based structure aligns with route-based code splitting.

## Import Best Practices

### ✅ Good Practices

```typescript
// Import from feature barrel
import { useCustomerStore, Customer } from "@/features/customers";

// Import from shared barrel
import { Button, Modal } from "@/shared";

// Import specific shared component
import { DataTable } from "@/shared/components/ui/DataTable";
```

### ❌ Avoid

```typescript
// Don't import from deep paths
import { useCustomerStore } from "@/features/customers/store/customerStore";

// Don't cross feature boundaries directly
import { SomeComponent } from "@/features/sales/components/SomeComponent";
// Instead, export it in sales/index.ts first
```

## Zustand Store Organization

Stores are now feature-scoped:

```typescript
// ❌ Before (monolithic)
// store/stores.ts - all stores in one file

// ✅ After (feature-scoped)
// features/customers/store/customerStore.ts
// features/invoices/store/invoiceStore.ts
// features/sales/store/saleStore.ts
// shared/store/uiStore.ts (global UI state)
```

Each feature store follows this pattern:

```typescript
import { create } from "zustand";

export interface FeatureItem {
  id: string;
  // ...properties
}

interface FeatureState {
  items: FeatureItem[];
  selectedItem: FeatureItem | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items: FeatureItem[]) => void;
  addItem: (item: FeatureItem) => void;
  updateItem: (id: string, updates: Partial<FeatureItem>) => void;
  deleteItem: (id: string) => void;
  selectItem: (item: FeatureItem | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFeatureStore = create<FeatureState>()((set) => ({
  // Implementation
}));
```

## Shared Components

All reusable UI components are in `shared/components/ui/`:

- **Button**: Button variants (primary, secondary, outline, ghost, danger)
- **Card**: Card, StatCard, DashboardCard
- **DataTable**: Sortable table with ActionMenu
- **FormControls**: FormInput, FormTextarea, FormSelect, FormCheckbox
- **Modal**: Modal, ConfirmDialog
- **Common**: SearchBar, Badge, EmptyState, LoadingSpinner

Import from shared:
```typescript
import { Button, Modal, DataTable } from "@/shared";
// or
import { Button } from "@/shared/components/ui/Button";
```

## TypeScript Paths

`tsconfig.json` paths configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
```

## Testing Strategy

Feature-based structure supports better testing:

```
features/
  customers/
    __tests__/
      CustomerForm.test.tsx
      customerStore.test.ts
    components/
    pages/
    store/
```

Each feature can have its own test suite, making it easy to test in isolation.

## Future Enhancements

### 1. **Feature Types**
Create `types.ts` in each feature for shared types:
```typescript
// features/customers/types.ts
export interface Customer { ... }
export interface CustomerFormData { ... }
```

### 2. **Feature Hooks**
Create custom hooks per feature:
```typescript
// features/customers/hooks/useCustomerForm.ts
export function useCustomerForm() { ... }
```

### 3. **Feature Services**
Add API service layer:
```typescript
// features/customers/services/customerService.ts
export const customerService = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
};
```

### 4. **Feature Routes**
Colocate routes with features:
```typescript
// features/customers/routes.tsx
export const customerRoutes = [
  { path: '/customers', element: <CustomersPage /> },
  { path: '/customers/:id', element: <CustomerDetailPage /> },
];
```

## Summary

✅ **Completed**:
- Feature-based folder structure created
- All components and pages moved to feature folders
- Zustand stores split by feature
- Shared UI components organized
- Import paths updated throughout
- Barrel exports created for clean imports
- App.tsx updated to use new structure

✅ **Benefits**:
- Better code organization by domain
- Improved maintainability and scalability
- Clearer feature boundaries
- Easier onboarding for new developers
- Simplified testing and refactoring

🎯 **Next Steps**:
1. Add feature-specific tests
2. Create feature hooks and services
3. Add feature-level types
4. Implement lazy loading for routes
5. Add feature documentation

---

**Old Structure Preserved**: The original `components/`, `pages/`, and `store/` folders remain intact for backward compatibility during migration. They can be removed once all references are updated.
