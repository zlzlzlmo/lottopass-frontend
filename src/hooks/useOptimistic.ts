import { useState, useCallback } from 'react';

export function useOptimistic<T>(
  initialState: T,
  updateFn: (currentState: T, optimisticValue: T) => T
) {
  const [state, setState] = useState(initialState);
  const [optimisticState, setOptimisticState] = useState(initialState);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const addOptimistic = useCallback(
    (optimisticValue: T) => {
      setIsOptimistic(true);
      setOptimisticState(updateFn(state, optimisticValue));
    },
    [state, updateFn]
  );

  const commitOptimistic = useCallback((newState: T) => {
    setState(newState);
    setOptimisticState(newState);
    setIsOptimistic(false);
  }, []);

  const rollbackOptimistic = useCallback(() => {
    setOptimisticState(state);
    setIsOptimistic(false);
  }, [state]);

  return [
    isOptimistic ? optimisticState : state,
    {
      addOptimistic,
      commitOptimistic,
      rollbackOptimistic,
      isOptimistic,
    },
  ] as const;
}