import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrentUser {
    email: string;
    token: string;
}

interface CurrentUserState {
    user: CurrentUser | null;
    token: string | null;
    isAuthenticated: boolean;
    setCurrentUser: (userData: CurrentUser, token?: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<CurrentUser>) => void;
}

const useCurrentUserStore = create<CurrentUserState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setCurrentUser: (userData, token) =>
                set({
                    user: userData,
                    token: token ?? null,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),

            updateUser: (userData) =>
                set((state) => ({
                    ...state,
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
        }),
        {
            name: 'user-storage',
        }
    )
);

export default useCurrentUserStore;
