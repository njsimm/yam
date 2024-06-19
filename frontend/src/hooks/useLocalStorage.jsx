import { useState, useEffect } from "react";

/**
 * Custom hook for syncing state with localStorage.
 *
 * This hook creates `item` as state and initializes it with the value from localStorage associated with the given `key`.
 *
 * If the key does not exist in localStorage, it defaults to `defaultValue`.
 *
 * When `item` changes, the hook updates localStorage:
 * - If `item` is `null`, it removes the corresponding key from localStorage.
 * - Otherwise, it sets the key in localStorage to the new value of `item`.
 *
 * Parameters:
 * @param {string} key - The key under which the value is stored in localStorage.
 * @param {any} defaultValue - The default value to use if the key is not found in localStorage.
 *
 * Returns:
 * @returns {Array} - An array containing the state value (`item`) and the function to update it (`setItem`).
 *
 * Example usage:
 * const [myValue, setMyValue] = useLocalStorage("myKey", "defaultVal");
 */

function useLocalStorage(key, defaultValue = null) {
  // Initialize the state with the value from localStorage or the default value
  const initialValue = localStorage.getItem(key) || defaultValue;
  const [item, setItem] = useState(initialValue);

  // Effect to update localStorage whenever the state changes
  useEffect(
    function setKeyInLocalStorage() {
      if (item === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, item);
      }
    },
    [key, item]
  );

  // Return the state and the function to update it
  return [item, setItem];
}

export default useLocalStorage;
