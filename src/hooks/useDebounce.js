import { useEffect, useState } from 'react';

/**
 * useDebounce — delays the value update until after a delay (used for input search)
 * 
 * @param {*} value - the value to debounce
 * @param {number} delay - delay in ms (default: 300ms)
 * @returns debounced value
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(handler); // cleanup on next effect or unmount
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
