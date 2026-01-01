import * as SecureStore from 'expo-secure-store';
import { StateStorage } from 'zustand/middleware';

// Create a storage adapter for expo-secure-store
export const secureStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            const value = await SecureStore.getItemAsync(name);
            return value ?? null;
        } catch (error) {
            console.error(`Failed to get item "${name}" from secure storage:`, error);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        try {
            await SecureStore.setItemAsync(name, value);
        } catch (error) {
            console.error(`Failed to set item "${name}" in secure storage:`, error);
            throw error; // Re-throw to notify caller
        }
    },
    removeItem: async (name: string): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(name);
        } catch (error) {
            console.error(`Failed to remove item "${name}" from secure storage:`, error);
            throw error; // Re-throw to notify caller
        }
    },

};
