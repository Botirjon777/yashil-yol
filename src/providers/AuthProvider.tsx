"use client";

import { ReactNode } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthResponse } from "@/src/features/auth/types";

interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  setAuth: (user: AuthResponse["user"], token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token: token || null }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default function AuthProvider({ children }: { children: ReactNode }) {
  // This can be used for initial session sync or global auth effects
  return <>{children}</>;
}
