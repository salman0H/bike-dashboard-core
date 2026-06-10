// src/hooks/useData.ts
import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useData<T>(endpoint: keyof typeof api, defaultValue: T) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api[endpoint]();
        
        // If result has data, use it; otherwise use default
        if (result && Array.isArray(result) && result.length > 0) {
          setData(result as T);
        } else {
          setData(defaultValue);
        }
      } catch (err) {
        console.error(`Error in useData for ${String(endpoint)}:`, err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}