//project/src/store/authStore.ts
import { secureStorage } from '@/lib/secureStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    user: {
        id: string;
        email: string;
        name: string;
    } | null;
    isAuthenticated: boolean;

    // Actions
    setAuth: (token: string, user: AuthState['user']) => void;
    logout: () => void;
    updateUser: (user: Partial<AuthState['user']>) => void; // ✅ Add this
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            setAuth: (token, user) =>
                set({
                    token,
                    user,
                    isAuthenticated: true
                }),

            logout: () =>
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false
                }),

            // ✅ Add updateUser method
            updateUser: (updatedUser) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updatedUser } : null
                })),
        }),
        {
            name: 'auth-storage', // unique name for storage key
            storage: createJSONStorage(() => secureStorage), // ✅ Use secure storage
        }
    )
);
