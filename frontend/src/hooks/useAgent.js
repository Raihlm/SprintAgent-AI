import { useState, useCallback } from 'react';

/**
 * useAgent — generic hook for calling an async agent function.
 *
 * Returns { data, loading, error, run, reset }.
 *
 * @param {Function} agentFn - The async service function to invoke.
 */
export function useAgent(agentFn) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const run = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await agentFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [agentFn]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, run, reset };
}
