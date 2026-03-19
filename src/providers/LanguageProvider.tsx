"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { translations, Language } from "@/src/lib/i18n/translations";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T extends keyof typeof translations.uz>(
    category: T,
    key: keyof typeof translations.uz[T]
  ) => any;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "uz",
      setLanguage: (lang) => set({ language: lang }),
      t: (category, key) => {
        const lang = get().language;
        // @ts-ignore
        const value = translations[lang]?.[category]?.[key] || 
                      // @ts-ignore
                      translations.en?.[category]?.[key] || 
                      String(key);
        return value;
      },
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
