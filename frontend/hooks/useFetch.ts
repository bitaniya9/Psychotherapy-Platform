import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useFetch<T = any>(path: string, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get(path)
      .then((res) => {
        if (!mounted) return;
        setData(res.data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
