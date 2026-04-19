# API Integration Documentation

## Overview

The frontend application has been updated to use API service calls instead of mock data. This document provides an overview of the changes made and how to use the new API integration.

## Architecture

### Service Layer

All API calls are now centralized in the `src/services/` directory:

- **`auth.service.ts`** - Authentication endpoints (login, register, logout, token refresh, password reset)
- **`user.service.ts`** - User profile and emergency contact management
- **`appointment.service.ts`** - Appointment management
- **`medication.service.ts`** - Medication management
- **`billing.service.ts`** - Billing, invoices, and payment methods

### Store Updates

All Zustand stores have been updated to use API calls:

- **`useAuthStore.ts`** - Authentication state with API integration
- **`useMedicationStore.ts`** - Medication management with API calls
- **`useAppointmentStore.ts`** - Appointment management with API calls
- **`useBillingStore.ts`** - Billing management with API calls
- **`useProfileStore.ts`** - User profile management with API calls

### Authentication

The authentication system includes:

- **Token Storage** - Access and refresh tokens stored in localStorage
- **Auto-refresh** - Automatic token refresh on 401 errors
- **Request Interceptors** - Automatic token injection in API requests

Key files:
- `src/lib/auth-utils.ts` - Token storage utilities
- `src/lib/api.ts` - API wrapper with authentication support

## API Endpoints

### Authentication (`/api/auth`)

```typescript
// Register a new user
await register({ email, password, firstName, lastName, dateOfBirth, phoneNumber })

// Login
await login({ email, password })

// Refresh access token
await refreshToken(refreshToken)

// Logout
await logout(refreshToken)

// Verify email
await verifyEmail({ token })

// Request password reset
await forgotPassword({ email })

// Reset password
await resetPassword({ token, newPassword })
```

### User Management (`/api/users`)

```typescript
// Get current user profile
await getCurrentUser()

// Update profile
await updateProfile({ firstName, lastName, dateOfBirth, phoneNumber })

// Update security settings
await updateSecuritySettings({ twoFactorEnabled })

// Update preferences
await updateUserPreferences({ language, timezone, theme, notifications, privacy })

// Get emergency contacts
await getEmergencyContacts()

// Add emergency contact
await addEmergencyContact({ name, relationship, phone, email, isPrimary })

// Update emergency contact
await updateEmergencyContact(id, { name, relationship, phone, email, isPrimary })

// Delete emergency contact
await deleteEmergencyContact(id)
```

### Appointments (`/api/appointments`)

```typescript
// Get all appointments
await getAppointments()

// Create appointment
await createAppointment({ title, doctor, specialty, date, time, duration, location, type, notes, icon })

// Update appointment
await updateAppointment(id, { /* partial updates */ })

// Delete appointment
await deleteAppointment(id)

// Cancel appointment
await cancelAppointment(id)
```

### Medications (`/api/medications`)

```typescript
// Get all medications
await getMedications()

// Create medication
await createMedication({ name, dosage, type, frequency, time, taken, refillsLeft, nextRefill, prescribedBy, notes })

// Update medication
await updateMedication(id, { /* partial updates */ })

// Delete medication
await deleteMedication(id)

// Toggle taken status
await toggleMedicationTaken(id, taken)
```

### Billing (`/api/billing`)

```typescript
// Get payment methods
await getPaymentMethods()

// Add payment method
await addPaymentMethod({ /* payment method data */ })

// Remove payment method
await removePaymentMethod(id)

// Get invoices
await getInvoices()

// Get subscription
await getSubscription()

// Create payment intent
await createPaymentIntent({ amount, currency })
```

## Usage Examples

### Authentication

```typescript
import { useAuthStore } from '@/store/useAuthStore';

function LoginForm() {
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      // User is now authenticated
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(email, password)}>
      {/* form fields */}
    </form>
  );
}
```

### Fetching Data

```typescript
import { useMedicationStore } from '@/store/useMedicationStore';
import { useEffect } from 'react';

function MedicationsList() {
  const { medications, isLoading, error, fetchMedications } = useMedicationStore();

  useEffect(() => {
    fetchMedications();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {medications.map(med => (
        <li key={med.id}>{med.name}</li>
      ))}
    </ul>
  );
}
```

### Creating Data

```typescript
import { useMedicationStore } from '@/store/useMedicationStore';

function AddMedicationForm() {
  const { addMedication, isLoading } = useMedicationStore();

  const handleSubmit = async (data) => {
    try {
      await addMedication(data);
      // Medication added successfully
    } catch (error) {
      console.error('Failed to add medication:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## Error Handling

All store methods include error handling:

```typescript
try {
  await storeMethod(data);
} catch (error) {
  // Error is also stored in store.error
  console.error('Operation failed:', error);
}
```

## Loading States

Each store includes an `isLoading` state that can be used to show loading indicators:

```typescript
const { isLoading, medications } = useMedicationStore();

if (isLoading) {
  return <LoadingSpinner />;
}
```

## Token Management

Tokens are automatically managed by the API wrapper:

- Access tokens are included in all API requests
- Refresh tokens are used to obtain new access tokens
- Tokens are stored in localStorage
- Automatic token refresh on 401 errors

### Manual Token Access

```typescript
import { getAccessToken, getRefreshToken } from '@/lib/auth-utils';

const accessToken = getAccessToken();
const refreshToken = getRefreshToken();
```

## Migration from Mock Data

### Before (Mock Data)

```typescript
import { useMedicationStore } from '@/store/useMedicationStore';

function MyComponent() {
  const { medications } = useMedicationStore();
  // medications contains static mock data
}
```

### After (API Integration)

```typescript
import { useMedicationStore } from '@/store/useMedicationStore';
import { useEffect } from 'react';

function MyComponent() {
  const { medications, isLoading, error, fetchMedications } = useMedicationStore();

  useEffect(() => {
    fetchMedications();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // render medications
  );
}
```

## Deprecated Files

The following files contain mock data and are deprecated:

- `src/features/enterprise/components/dashboard-data.ts`
- `src/features/medications/components/medication-detail-data.ts`
- `src/features/medications/components/medications-data.ts`

These files are marked with `@deprecated` comments and will be removed in a future update.

## API Configuration

The API base URL is configured in `src/lib/api.ts`:

```typescript
const BASE_URL = '/api';
const TIMEOUT = 10000; // 10 seconds
```

To change the API endpoint, update the `BASE_URL` constant.

## Testing

When testing the API integration:

1. Ensure the backend services are running
2. Verify the API endpoint is accessible
3. Check that tokens are being stored correctly
4. Test token refresh functionality
5. Verify error handling works as expected

## Troubleshooting

### Common Issues

**401 Unauthorized Errors**
- Check that tokens are being stored correctly
- Verify the refresh token is valid
- Ensure the backend authentication service is running

**Network Errors**
- Verify the backend services are running
- Check the API endpoint URL is correct
- Ensure CORS is configured properly

**Loading States Not Updating**
- Ensure you're calling the fetch method
- Check for error messages in the store
- Verify the API endpoint is responding

## Future Enhancements

Potential improvements to the API integration:

1. Add request/response interceptors for logging
2. Implement request caching
3. Add retry logic for failed requests
4. Implement optimistic updates
5. Add request batching for bulk operations
6. Implement offline support with sync

## Support

For questions or issues related to the API integration:

1. Check this documentation
2. Review the service files in `src/services/`
3. Check the store files in `src/store/`
4. Review the API wrapper in `src/lib/api.ts`
