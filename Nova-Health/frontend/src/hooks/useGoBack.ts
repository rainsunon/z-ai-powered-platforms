import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Provides a goBack function that navigates to a fallback route
 * if there's no history to go back to.
 */
export function useGoBack(fallback = '/') {
  const navigate = useNavigate();
  return useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }, [navigate, fallback]);
}
