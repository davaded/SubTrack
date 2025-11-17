// 常见订阅服务的图标
export const COMMON_SERVICES = [
  {
    name: 'Netflix',
    logoUrl: 'https://logo.clearbit.com/netflix.com',
    category: 'entertainment',
  },
  {
    name: 'Spotify',
    logoUrl: 'https://logo.clearbit.com/spotify.com',
    category: 'music',
  },
  {
    name: 'YouTube Premium',
    logoUrl: 'https://logo.clearbit.com/youtube.com',
    category: 'entertainment',
  },
  {
    name: 'Disney+',
    logoUrl: 'https://logo.clearbit.com/disneyplus.com',
    category: 'entertainment',
  },
  {
    name: 'ChatGPT',
    logoUrl: 'https://logo.clearbit.com/openai.com',
    category: 'productivity',
  },
  {
    name: 'GitHub',
    logoUrl: 'https://logo.clearbit.com/github.com',
    category: 'productivity',
  },
  {
    name: 'Notion',
    logoUrl: 'https://logo.clearbit.com/notion.so',
    category: 'productivity',
  },
  {
    name: 'Figma',
    logoUrl: 'https://logo.clearbit.com/figma.com',
    category: 'productivity',
  },
  {
    name: 'Adobe Creative Cloud',
    logoUrl: 'https://logo.clearbit.com/adobe.com',
    category: 'productivity',
  },
  {
    name: 'Microsoft 365',
    logoUrl: 'https://logo.clearbit.com/microsoft.com',
    category: 'productivity',
  },
  {
    name: 'Google One',
    logoUrl: 'https://logo.clearbit.com/google.com',
    category: 'cloud',
  },
  {
    name: 'Dropbox',
    logoUrl: 'https://logo.clearbit.com/dropbox.com',
    category: 'cloud',
  },
  {
    name: 'iCloud',
    logoUrl: 'https://logo.clearbit.com/apple.com',
    category: 'cloud',
  },
  {
    name: 'Amazon Prime',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    category: 'entertainment',
  },
  {
    name: 'Apple Music',
    logoUrl: 'https://logo.clearbit.com/apple.com',
    category: 'music',
  },
  {
    name: 'LinkedIn Premium',
    logoUrl: 'https://logo.clearbit.com/linkedin.com',
    category: 'productivity',
  },
]

export function getLogoForService(serviceName: string): string | null {
  const service = COMMON_SERVICES.find(
    (s) => s.name.toLowerCase() === serviceName.toLowerCase()
  )
  return service?.logoUrl || null
}

// 从域名获取 logo - 支持多种方式
export function getLogoFromDomain(url: string, method: 'favicon' | 'clearbit' | 'google' = 'favicon'): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    const origin = urlObj.origin

    switch (method) {
      case 'favicon':
        // 直接使用网站的 favicon.ico
        return `${origin}/favicon.ico`

      case 'clearbit':
        // 使用 Clearbit Logo API（高质量但可能失败）
        return `https://logo.clearbit.com/${domain}`

      case 'google':
        // 使用 Google Favicon Service（最稳定）
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

      default:
        return `${origin}/favicon.ico`
    }
  } catch {
    return ''
  }
}

// 获取多个备选图标 URL
export function getLogoFallbacks(url: string): string[] {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    const origin = urlObj.origin

    return [
      `${origin}/favicon.ico`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://logo.clearbit.com/${domain}`,
    ]
  } catch {
    return []
  }
}
