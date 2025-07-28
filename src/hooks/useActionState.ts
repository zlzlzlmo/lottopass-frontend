import { useState, useCallback, useTransition } from 'react';

interface ActionState<T = unknown> {
  data?: T;
  error?: Error | null;
  loading: boolean;
}

export function useActionState<TData = unknown, TError = Error>() {
  const [state, setState] = useState<ActionState<TData>>({
    loading: false,
    error: null,
  });
  const [isPending, startTransition] = useTransition();

  const execute = useCallback(
    async (action: () => Promise<TData>) => {
      startTransition(() => {
        setState({ loading: true, error: null });
      });

      try {
        const data = await action();
        setState({ data, loading: false, error: null });
        return { success: true, data };
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error('Unknown error');
        setState({ loading: false, error: errorObj });
        return { success: false, error: errorObj };
      }
    },
    []
  );

  return {
    ...state,
    isPending,
    execute,
  };
}