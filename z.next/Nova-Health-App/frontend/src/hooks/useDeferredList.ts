import { useDeferredValue, useMemo } from 'react';

/**
 * Custom hook to defer rendering of large lists with React 19's useDeferredValue
 * @param items The list of items to render
 * @returns The deferred list of items
 */
export function useDeferredList<T>(items: T[]): T[] {
  const deferredItems = useDeferredValue(items);

  return useMemo(() => deferredItems, [deferredItems]);
}
