"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { translations, Language } from "@/src/lib/i18n/translations";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/src/providers/AuthProvider";
import { useUpdateUserLanguage } from "@/src/features/auth/hooks/useAuth";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (category: any, key: any) => any;
  safeT: (category: string, section: string, key: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "uz",
      setLanguage: (lang) => {
        set({ language: lang });
      },
      t: (category, key) => {
        const lang = get().language;
        const value =
          (translations[lang] as any)?.[category]?.[key] ||
          (translations.en as any)?.[category]?.[key] ||
          String(key);
        return value;
      },
      safeT: (category, section, key) => {
        const lang = get().language;
        const value =
          (translations[lang] as any)?.[category]?.[section]?.[key] ||
          (translations.en as any)?.[category]?.[section]?.[key] ||
          String(key);
        return value;
      },
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/**
 * Global component to sync language state with backend for authenticated users
 */
function LanguageSyncer() {
  const { language } = useLanguageStore();
  const { token } = useAuthStore();
  const { mutate } = useUpdateUserLanguage();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Only sync if user is logged in
    if (!token) {
      isInitialMount.current = false;
      return;
    }

    // Avoid syncing on the very first mount to prevent redundant calls
    // unless the store has just rehydrated from a change
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    mutate(language);
  }, [language, token, mutate]);

  return null;
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LanguageSyncer />
      {children}
    </>
  );
}
