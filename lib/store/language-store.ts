import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { zh } from '../i18n/zh'
import { en } from '../i18n/en'

export type Locale = 'zh' | 'en'

const translations = {
  zh,
  en,
}

interface LanguageState {
  locale: Locale
  t: typeof zh
  setLocale: (locale: Locale) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'zh',
      t: zh,
      setLocale: (locale: Locale) =>
        set({
          locale,
          t: translations[locale],
        }),
    }),
    {
      name: 'language-storage',
    }
  )
)
