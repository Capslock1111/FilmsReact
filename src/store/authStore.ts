import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/AuthService";
import { User } from '../types/user'

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User) => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            isLoading: true,
            user: null,

            login: async (username: string, password: string) => {
                set({ isLoading: true });
                const success = await authService.login(username, password);
                if (success) {
                    const user = authService.getCurrentUser();
                    set({ isAuthenticated: true, user, isLoading: false });
                    return true;
                }
                set({ isLoading: false });
                return false;
            },
            logout: () => {
                authService.logout();
                set({ isAuthenticated: false, user: null });
            },
            setUser: (user) => set({ user }),

            initialize: () => {
                const isAuth = authService.isAuthenticated();
                const user = isAuth ? authService.getCurrentUser() : null;
                set({
                    isAuthenticated: isAuth,
                    isLoading: false,
                    user: user,
                });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
            }),
        },
    ),
);