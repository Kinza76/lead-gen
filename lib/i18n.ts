import en from "@/translations/en.json";
import ur from "@/translations/ur.json";
import fr from "@/translations/fr.json";
import es from "@/translations/es.json";
import ru from "@/translations/ru.json";
import ar from "@/translations/ar.json";

export const translations = { en, ur, fr, es, ru, ar };
export type Language = keyof typeof translations;

export function t(language: Language, key: keyof (typeof en)) {
  return translations[language]?.[key] ?? en[key] ?? key;
}
