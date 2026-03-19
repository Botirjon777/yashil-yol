"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { translations, Language } from "@/src/lib/i18n/translations";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (
    category: any,
    key: any
  ) => any;
  safeT: (
    category: string,
    section: string,
    key: string
  ) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "uz",
      setLanguage: (lang) => set({ language: lang }),
      t: (category, key) => {
        const lang = get().language;
        const value = (translations[lang] as any)?.[category]?.[key] || 
                      (translations.en as any)?.[category]?.[key] || 
                      String(key);
        return value;
      },
      safeT: (category, section, key) => {
        const lang = get().language;
        const value = (translations[lang] as any)?.[category]?.[section]?.[key] || 
                      (translations.en as any)?.[category]?.[section]?.[key] || 
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
