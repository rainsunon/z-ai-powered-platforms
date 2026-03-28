import { useEffect } from 'react';

/**
 * Sets the document title with an app suffix.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} — Luminous Health`;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
