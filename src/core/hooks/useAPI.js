/**
 * Custom Hook: useAPI
 * Simplifies API calls with loading and error states
 */

import { useState, useCallback } from "react";

export const useAPI = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute API call
   */
  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...args);

        if (response.success) {
          setData(response.data);
          return response;
        } else {
          setError(response.message || "An error occurred");
          return response;
        }
      } catch (err) {
        const errorMessage = err.message || "An unexpected error occurred";
        setError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          error: err,
        };
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useAPI;
