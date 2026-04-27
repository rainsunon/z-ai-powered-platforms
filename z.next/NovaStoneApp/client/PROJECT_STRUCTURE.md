# NovaStone Frontend - Feature-Based Architecture

## Visual Structure

```
src/
├── 📂 features/                    Feature modules (business domains)
│   ├── 🔐 auth/                   Authentication & authorization
│   │   ├── components/            AuthLayout
│   │   ├── pages/                 Login, Signup
│   │   ├── store/                 authStore.ts
│   │   └── index.ts               Exports: useAuthStore, User, AuthLayout
│   │
│   ├── 👥 customers/              Customer management
│   │   ├── components/            CustomerForm, ImportModal
│   │   ├── pages/                 Customers, CustomersRefactored
│   │   ├── store/                 customerStore.ts
│   │   └── index.ts               Exports: useCustomerStore, Customer, CustomerForm
│   │
│   ├── 📄 invoices/               Invoice management
│   │   ├── pages/                 Invoices
│   │   ├── store/                 invoiceStore.ts
│   │   └── index.ts               Exports: useInvoiceStore, Invoice, LineItem
│   │
│   ├── 💰 sales/                  Sales tracking
│   │   ├── pages/                 Sales, SalesDashboard
│   │   ├── store/                 saleStore.ts
│   │   └── index.ts               Exports: useSaleStore, Sale
│   │
│   ├── 📦 products/               Product/service management
│   │   ├── pages/                 ProductsServices
│   │   ├── store/                 productStore.ts
│   │   └── index.ts               Exports: useProductStore, Product
│   │
│   ├── 💳 transactions/           Transaction tracking
│   │   ├── pages/                 Transactions
│   │   ├── store/                 transactionStore.ts
│   │   └── index.ts               Exports: useTransactionStore, Transaction
│   │
│   ├── 🛒 purchases/              Purchase management
│   ├── 📝 estimates/              Estimate management
│   ├── 📊 reports/                Reporting
│   ├── ⚙️  settings/              Settings
│   └── 📈 dashboard/              Dashboard & analytics
│
├── 📂 shared/                     Shared resources
│   ├── components/
│   │   ├── ui/                    Reusable UI components
│   │   │   ├── Button.tsx         Primary, secondary, outline, ghost, danger
│   │   │   ├── Card.tsx           Card, StatCard, DashboardCard
│   │   │   ├── Common.tsx         SearchBar, Badge, EmptyState, Spinner
│   │   │   ├── DataTable.tsx      Sortable table + ActionMenu
│   │   │   ├── FormControls.tsx   Input, Textarea, Select, Checkbox
│   │   │   └── Modal.tsx          Modal, ConfirmDialog
│   │   └── layout/                Layout components
│   │       ├── Header.tsx         Top navigation bar
│   │       └── Sidebar.tsx        Side navigation menu
│   ├── store/
│   │   └── uiStore.ts            Global UI state (modals, theme, sidebar)
│   ├── hooks/                     Custom React hooks (to be added)
│   ├── types/                     Shared TypeScript types (to be added)
│   └── index.ts                   Barrel exports
│
├── 📂 lib/                        Utilities
│   ├── auth.ts                    Auth helper functions
│   └── utils.ts                   Utility functions (cn, formatCurrency)
│
├── 📂 i18n/                       Internationalization
│   └── config.ts                  i18n configuration
│
├── App.tsx                        Root application component
├── main.tsx                       Application entry point
└── index.css                      Global styles
```

## Import Patterns

### ✅ Feature Imports
```typescript
// Import from feature barrel
import { useCustomerStore, Customer } from "@/features/customers";
import { useInvoiceStore, Invoice } from "@/features/invoices";
import { useAuthStore, User } from "@/features/auth";
```

### ✅ Shared Component Imports
```typescript
// Import from shared barrel
import { Button, Modal, DataTable } from "@/shared";

// Or import specific component
import { FormInput } from "@/shared/components/ui/FormControls";
import { Header, Sidebar } from "@/shared/components/layout";
```

### ✅ Utility Imports
```typescript
import { cn, formatCurrency } from "@/src/lib/utils";
```

## File Organization Pattern

Each feature follows this consistent structure:

```
feature-name/
├── components/          # Feature-specific components
│   └── FeatureForm.tsx
├── pages/              # Route-level page components
│   └── FeaturePage.tsx
├── store/              # Zustand state management
│   └── featureStore.ts
├── hooks/              # Custom hooks (optional)
├── types/              # TypeScript types (optional)
├── services/           # API services (optional)
└── index.ts            # Public API barrel export
```

## State Management Architecture

```
┌─────────────────────────────────────────┐
│         Zustand Stores                  │
├─────────────────────────────────────────┤
│  Feature Stores (Domain-specific)       │
│  • features/auth/store/authStore        │
│  • features/customers/store/customer... │
│  • features/invoices/store/invoice...   │
│  • features/sales/store/saleStore       │
│  • features/products/store/product...   │
│  • features/transactions/store/trans... │
├─────────────────────────────────────────┤
│  Global Store (UI state)                │
│  • shared/store/uiStore                 │
│    - Modal state                        │
│    - Sidebar state                      │
│    - Theme (light/dark)                 │
│    - Language                           │
└─────────────────────────────────────────┘
```

## Component Dependency Graph

```
App.tsx
  │
  ├─── Shared Components
  │     ├── Header
  │     └── Sidebar
  │
  └─── Feature Pages
        ├── Dashboard
        ├── Customers ──► CustomerForm ──► useCustomerStore
        │                    │
        │                    └─► Button, Modal, FormControls (shared)
        │
        ├── Invoices ───────────────────► useInvoiceStore
        │                                    │
        │                                    └─► DataTable, Button (shared)
        │
        ├── Sales ──────────────────────► useSaleStore
        └── [Other Features]
```

## Benefits Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Organization** | Type-based (pages/, components/) | Feature-based (features/*/) |
| **Stores** | 1 monolithic file (350+ lines) | 7 feature stores (50-80 lines each) |
| **Discoverability** | Search across folders | All feature code in one place |
| **Encapsulation** | Low (components scattered) | High (colocated by feature) |
| **Scalability** | Difficult to add features | Easy - create new feature folder |
| **Testing** | Complex setup | Feature-isolated tests |
| **Import Paths** | Long, unclear | Short, semantic |

## Quick Reference

### Creating a New Feature

```bash
# 1. Create folder structure
mkdir -p features/my-feature/{components,pages,store}

# 2. Create store
touch features/my-feature/store/myFeatureStore.ts

# 3. Create page
touch features/my-feature/pages/MyFeaturePage.tsx

# 4. Create barrel export
touch features/my-feature/index.ts

# 5. Add exports to index.ts
echo "export { useMyFeatureStore } from './store/myFeatureStore';" > features/my-feature/index.ts
```

### Using Shared Components

All shared UI components are available:

```typescript
import {
  Button,           // Primary, secondary, outline, ghost, danger variants
  IconButton,       // Icon-only button
  Card,            // Base card
  StatCard,        // Statistics card with icon & trend
  DashboardCard,   // Card with header & action
  DataTable,       // Sortable table
  ActionMenu,      // Dropdown action menu
  FormInput,       // Text input with label, error
  FormTextarea,    // Textarea with validation
  FormSelect,      // Dropdown select
  FormCheckbox,    // Checkbox with description
  Modal,           // Base modal
  ConfirmDialog,   // Confirmation dialog
  SearchBar,       // Search input with icon
  Badge,           // Status badge
  EmptyState,      // Empty state placeholder
  LoadingSpinner,  // Loading indicator
} from "@/shared";
```

## Migration Status

✅ **Completed**:
- [x] Feature folder structure created
- [x] All stores split by feature
- [x] All components moved to features
- [x] All pages moved to features
- [x] Shared UI components organized
- [x] Import paths updated
- [x] Barrel exports created
- [x] App.tsx updated
- [x] Documentation created

📋 **Old Structure**:
The original folders (`components/`, `pages/`, `store/`) are preserved for reference but should not be used for new development.

🎯 **Next Steps**:
1. Add feature-specific tests
2. Create custom hooks per feature
3. Add API service layer
4. Implement lazy loading
5. Add comprehensive type exports
