import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const _value = Array.isArray(value) ? JSON.stringify(value) : value;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_value, delay]);

  return debouncedValue;
}

export default useDebounce;
