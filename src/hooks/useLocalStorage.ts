import { useState, useCallback } from 'react';

/**
 * Generic localStorage hook with type-safe read/write and corruption fallback.
 * Reference: docs/IMPLEMENTATION_PLAN.md Section 6 (Kontrak Penyimpanan Lokal)
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const readFromStorage = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item) as T;
    } catch {
      // Data corrupt or unparseable — fallback to initial value
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readFromStorage);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Storage quota exceeded — skip persistence
        }
        return next;
      });
    },
    [key]
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setValue, reset] as const;
}
