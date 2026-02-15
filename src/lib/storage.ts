/**
 * Safe storage utility for Next.js SSR/Client environments.
 * Handles localStorage access with proper SSR safety checks.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export const storage = {
    /**
     * Get an item from localStorage
     * @param key - The key to retrieve
     * @returns The value or null if not found or in SSR
     */
    get: (key: string): string | null => {
        if (typeof window === 'undefined') return null;

        try {
            // Explicitly use window.localStorage
            const storage = window.localStorage;
            if (storage && typeof storage.getItem === 'function') {
                return storage.getItem(key);
            }
            return null;
        } catch (error) {
            console.error(`Error getting item from localStorage: ${key}`, error);
            return null;
        }
    },

    /**
     * Set an item in localStorage
     * @param key - The key to set
     * @param value - The value to store
     */
    set: (key: string, value: string): void => {
        if (!isBrowser) return;

        try {
            const storage = window.localStorage;
            if (storage && typeof storage.setItem === 'function') {
                storage.setItem(key, value);
            }
        } catch (error) {
            console.error(`Error setting item in localStorage: ${key}`, error);
        }
    },

    /**
     * Remove an item from localStorage
     * @param key - The key to remove
     */
    remove: (key: string): void => {
        if (!isBrowser) return;

        try {
            const storage = window.localStorage;
            if (storage && typeof storage.removeItem === 'function') {
                storage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing item from localStorage: ${key}`, error);
        }
    },

    /**
     * Clear all items from localStorage
     */
    clear: (): void => {
        if (!isBrowser) return;

        try {
            const storage = window.localStorage;
            if (storage && typeof storage.clear === 'function') {
                storage.clear();
            }
        } catch (error) {
            console.error('Error clearing localStorage', error);
        }
    },

    /**
     * Get an item and parse it as JSON
     * @param key - The key to retrieve
     * @returns The parsed object or null
     */
    getJSON: <T = any>(key: string): T | null => {
        const value = storage.get(key);
        if (!value) return null;

        try {
            return JSON.parse(value) as T;
        } catch (error) {
            console.error(`Error parsing JSON from localStorage: ${key}`, error);
            return null;
        }
    },

    /**
     * Set an item as JSON
     * @param key - The key to set
     * @param value - The value to store (will be stringified)
     */
    setJSON: (key: string, value: any): void => {
        try {
            storage.set(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error stringifying JSON for localStorage: ${key}`, error);
        }
    }
};
