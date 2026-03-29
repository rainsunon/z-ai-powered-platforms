import { useEffect, useRef } from 'react';

/**
 * Custom hook to check if a component is mounted
 * Useful for async operations to avoid state updates on unmounted components
 * @returns A ref that tracks if the component is mounted
 */
export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}
