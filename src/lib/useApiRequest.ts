import { useCallback, useState } from 'react';
import { handleAppwriteError } from './errorHandling';

interface UseApiRequestState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useApiRequest<T>() {
  const [state, setState] = useState<UseApiRequestState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (error) {
      const handledError = error instanceof Error ? error : handleAppwriteError(error);
      setState({ data: null, isLoading: false, error: handledError });
      throw handledError;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}