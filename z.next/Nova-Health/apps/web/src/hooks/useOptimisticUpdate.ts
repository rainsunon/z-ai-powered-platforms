import { useOptimistic, useTransition } from 'react';

/**
 * Custom hook to handle optimistic updates with React 19's useOptimistic
 * @param value The current value
 * @param updateFn The function to update the value
 * @returns An object with the optimistic value and a function to trigger updates
 */
export function useOptimisticUpdate<T>(
  value: T,
  updateFn: (current: T, newValue: T) => T
) {
  const [isPending, startTransition] = useTransition();
  const [optimisticValue, addOptimistic] = useOptimistic(
    value,
    (current, newValue: T) => updateFn(current, newValue)
  );

  const update = (newValue: T) => {
    startTransition(() => {
      addOptimistic(newValue);
    });
  };

  return { optimisticValue, update, isPending };
}
