export const LANGUAGES = {
  en: { name: 'English', dir: 'ltr' as const },
  zh: { name: '中文', dir: 'ltr' as const },
  ja: { name: '日本語', dir: 'ltr' as const },
  ar: { name: 'العربية', dir: 'rtl' as const },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
