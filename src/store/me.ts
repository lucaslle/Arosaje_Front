import { create } from "zustand";
import { api } from "../api/client.ts";
import type { Me } from "../api/types.ts";

interface MeState {
    me: Me | null;
    load: () => Promise<void>;
    clear: () => void;
}

// the signed-in member as the API sees them (id, botanist and admin rights); loaded once per session
export const useMeStore = create<MeState>()((set) => ({
    me: null,
    load: async () => {
        try {
            set({ me: await api<Me>("/users/me/") });
        } catch {
            set({ me: null });
        }
    },
    clear: () => set({ me: null }),
}));

export const isVerifiedBotanist = (me: Me | null) => Boolean(me?.is_botanist && me.botanist_verified);

// the token lives only in localStorage; signing out forgets it and the loaded member
export const signOut = () => {
    localStorage.removeItem("token");
    useMeStore.getState().clear();
};

