import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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

// 检查 localStorage 是否可用
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__'
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(test, test)
      window.localStorage.removeItem(test)
      return true
    }
    return false
  } catch {
    return false
  }
}

// 创建安全的 storage
const safeStorage = {
  getItem: (name: string) => {
    try {
      if (isStorageAvailable()) {
        return localStorage.getItem(name)
      }
      return null
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    try {
      if (isStorageAvailable()) {
        localStorage.setItem(name, value)
      }
    } catch {
      // 忽略存储错误
    }
  },
  removeItem: (name: string) => {
    try {
      if (isStorageAvailable()) {
        localStorage.removeItem(name)
      }
    } catch {
      // 忽略存储错误
    }
  },
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
      storage: createJSONStorage(() => safeStorage),
    }
  )
)
