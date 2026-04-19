# React 19 Performance Optimizations

This document outlines the performance optimizations applied to the Nova Health frontend application using React 19 and Zustand 5.

## Overview

The application has been optimized for better performance by:
1. Creating custom performance hooks
2. Optimizing Zustand store usage with selective subscriptions
3. Applying React 19 features (useTransition, useDeferredValue, useOptimistic)
4. Using React.useMemo and React.useCallback for memoization

## Custom Performance Hooks

### 1. useDebounce
**Location:** [`frontend/src/hooks/useDebounce.ts`](frontend/src/hooks/useDebounce.ts:1)

Delays updating a value until after a specified delay has passed since the last update.

**Usage Example:**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);
```

**Benefits:**
- Reduces unnecessary API calls for search/filter operations
- Improves performance for input fields that trigger expensive operations

### 2. useThrottle
**Location:** [`frontend/src/hooks/useThrottle.ts`](frontend/src/hooks/useThrottle.ts:1)

Limits how often a value can update within a specified time window.

**Usage Example:**
```typescript
const [scrollPosition, setScrollPosition] = useState(0);
const throttledScroll = useThrottle(scrollPosition, 100);
```

**Benefits:**
- Prevents excessive updates from scroll events
- Improves performance for high-frequency events

### 3. usePrevious
**Location:** [`frontend/src/hooks/usePrevious.ts`](frontend/src/hooks/usePrevious.ts:1)

Returns the previous value of a state or prop.

**Usage Example:**
```typescript
const [count, setCount] = useState(0);
const prevCount = usePrevious(count);
```

**Benefits:**
- Useful for comparing current and previous values
- Helps detect changes and trigger side effects accordingly

### 4. useIsMounted
**Location:** [`frontend/src/hooks/useIsMounted.ts`](frontend/src/hooks/useIsMounted.ts:1)

Tracks whether a component is mounted.

**Usage Example:**
```typescript
const isMounted = useIsMounted();

useEffect(() => {
  fetchData().then(data => {
    if (isMounted.current) {
      setState(data);
    }
  });
}, []);
```

**Benefits:**
- Prevents memory leaks by avoiding state updates on unmounted components
- Essential for async operations

### 5. useOptimisticUpdate
**Location:** [`frontend/src/hooks/useOptimisticUpdate.ts`](frontend/src/hooks/useOptimisticUpdate.ts:1)

Combines React 19's useOptimistic and useTransition for optimistic UI updates.

**Usage Example:**
```typescript
const { optimisticValue, update, isPending } = useOptimisticUpdate(
  currentValue,
  (current, newValue) => newValue
);
```

**Benefits:**
- Provides instant UI feedback before server confirmation
- Improves perceived performance
- Automatically reverts on errors

### 6. useDeferredList
**Location:** [`frontend/src/hooks/useDeferredList.ts`](frontend/src/hooks/useDeferredList.ts:1)

Defers rendering of large lists using React 19's useDeferredValue.

**Usage Example:**
```typescript
const items = useDeferredList(largeItemList);
```

**Benefits:**
- Improves performance for large lists
- Keeps UI responsive during expensive renders
- Prioritizes user interactions

## Zustand Store Optimizations

### Profile Store
**Location:** [`frontend/src/store/useProfileStore.ts`](frontend/src/store/useProfileStore.ts:1)

#### Optimized Selectors

1. **useProfile**
   - Subscribes only to profile data
   - Re-renders only when profile changes

2. **useEmergencyContacts**
   - Subscribes only to emergency contacts
   - Re-renders only when contacts change

3. **useProfileActions**
   - Subscribes only to action functions
   - Functions are stable and won't cause re-renders

4. **useProfileWithActions**
   - Combined selector for profile and update action
   - Optimized for components that need both

5. **useEmergencyContactsWithActions**
   - Combined selector for contacts and their actions
   - Optimized for components that need both

**Benefits:**
- Components only re-render when their specific data changes
- Reduces unnecessary re-renders across the application
- Improves overall performance and user experience

## React 19 Features Applied

### 1. useTransition
**Location:** [`frontend/src/features/profile/Profile.tsx`](frontend/src/features/profile/Profile.tsx:1)

Used for non-urgent state updates, allowing React to prioritize user interactions.

**Benefits:**
- Keeps UI responsive during state updates
- Prioritizes user interactions over background updates
- Improves perceived performance

### 2. React.useMemo
**Applied in multiple components:**
- [`ContactDetailsCard.tsx`](frontend/src/features/profile/components/ContactDetailsCard.tsx:1)
- [`PersonalInfoCard.tsx`](frontend/src/features/profile/components/PersonalInfoCard.tsx:1)
- [`ProfileBadges.tsx`](frontend/src/features/profile/components/ProfileBadges.tsx:1)
- [`Profile.tsx`](frontend/src/features/profile/Profile.tsx:1)

**Benefits:**
- Prevents unnecessary recalculations
- Improves performance for expensive computations
- Reduces re-renders when dependencies haven't changed

### 3. React.useCallback
**Applied in:**
- [`Profile.tsx`](frontend/src/features/profile/Profile.tsx:1)

**Benefits:**
- Stabilizes function references
- Prevents child component re-renders
- Optimizes event handler performance

## Component Optimizations

### Profile Feature Components

1. **ContactDetailsCard**
   - Uses optimized `useProfile` selector
   - Memoizes fields array with `useMemo`

2. **EmergencyContactsCard**
   - Uses optimized `useEmergencyContactsWithActions` selector
   - Only re-renders when contacts or actions change

3. **PersonalInfoCard**
   - Uses optimized `useProfile` selector
   - Memoizes fields array with `useMemo`

4. **ProfileInfo**
   - Uses optimized `useProfile` selector
   - Minimal re-renders

5. **ProfileBadges**
   - Uses optimized `useProfile` selector
   - Memoizes badges array with `useMemo`

6. **Profile (Main)**
   - Uses optimized `useProfileActions` selector
   - Implements `useTransition` for non-urgent updates
   - Memoizes tabs configuration

## Performance Benefits

### Before Optimization
- Components subscribed to entire store state
- Any store update caused all components to re-render
- No memoization of computed values
- No prioritization of updates

### After Optimization
- Components subscribe only to needed data
- Re-renders only when subscribed data changes
- Computed values are memoized
- Updates are prioritized with useTransition
- Optimistic UI updates improve perceived performance

### Measurable Improvements
- **Reduced re-renders:** Components only re-render when their specific data changes
- **Better responsiveness:** useTransition keeps UI responsive during updates
- **Faster interactions:** Memoization prevents unnecessary recalculations
- **Improved UX:** Optimistic updates provide instant feedback

## Best Practices Applied

1. **Selective Subscriptions:** Always use specific selectors instead of subscribing to entire store
2. **Memoization:** Use useMemo for expensive computations and derived data
3. **Callback Stabilization:** Use useCallback for event handlers passed to children
4. **Transition Updates:** Use useTransition for non-urgent state updates
5. **Optimistic Updates:** Provide instant feedback for user actions
6. **Debounce/Throttle:** Apply to high-frequency events and user inputs

## Future Optimization Opportunities

1. **Virtual Scrolling:** Implement for very long lists
2. **Code Splitting:** Further split components by route
3. **Image Optimization:** Implement lazy loading and responsive images
4. **Service Workers:** Add offline support and caching
5. **Web Workers:** Move heavy computations off the main thread

## Conclusion

These optimizations significantly improve the performance and user experience of the Nova Health application. The combination of React 19 features, optimized Zustand usage, and custom performance hooks creates a highly responsive and efficient application.

For questions or suggestions, please refer to the inline documentation in each hook and component.
