import { useState, useEffect } from "react";

/**
 * A hook that delays updating a value until a certain amount of time has passed.
 * Useful for search inputs to prevent excessive API calls or filtering logic.
 *
 * @param {any} value - The value you want to debounce (e.g. the search query)
 * @param {number} delay - The delay in milliseconds (default: 500ms)
 * @returns {any} - The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay is over
    // This is what prevents the update from happening too fast
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
