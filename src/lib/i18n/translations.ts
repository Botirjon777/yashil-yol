import uz from "./uz/index.json";
import ru from "./ru/index.json";
import en from "./en/index.json";

export const translations = {
  uz,
  ru,
  en,
};

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.uz;
