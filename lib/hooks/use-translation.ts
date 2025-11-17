import { useLanguageStore } from '../store/language-store'

export function useTranslation() {
  const { t, locale, setLocale } = useLanguageStore()

  // 简单的模板字符串替换函数
  const format = (template: string, params: Record<string, string | number>) => {
    return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] || ''))
  }

  return {
    t,
    locale,
    setLocale,
    format,
  }
}
