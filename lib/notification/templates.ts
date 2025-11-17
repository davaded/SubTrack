import dayjs from 'dayjs'

interface Subscription {
  id: number
  name: string
  amount: number
  currency: string
  nextBillingDate: Date
  daysUntilRenewal: number
  logoUrl?: string | null
}

interface NotificationData {
  userName: string
  subscriptions: {
    urgent: Subscription[]
    soon: Subscription[]
    upcoming: Subscription[]
  }
  locale: 'zh' | 'en'
}

const currencySymbols: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

function formatAmount(amount: number, currency: string): string {
  const symbol = currencySymbols[currency] || currency
  return `${symbol}${amount.toFixed(2)}`
}

function getDaysText(days: number, locale: 'zh' | 'en'): string {
  if (locale === 'zh') {
    if (days === 0) return '今天续费'
    if (days === 1) return '明天续费'
    return `${days}天后续费`
  } else {
    if (days === 0) return 'Renewing today'
    if (days === 1) return 'Renewing tomorrow'
    return `Renewing in ${days} days`
  }
}

/**
 * 生成钉钉 Markdown 消息
 */
export function generateDingTalkMessage(data: NotificationData) {
  const { userName, subscriptions, locale } = data
  const isZh = locale === 'zh'

  const text = isZh
    ? {
        title: '📋 订阅续费提醒',
        greeting: `${userName} 你好，`,
        intro: '以下订阅即将续费：',
        urgent: '#### 🔴 紧急（3天内）',
        soon: '#### 🟠 即将到期（7天内）',
        upcoming: '#### 🟡 即将到期',
        viewDetails: '查看详情',
      }
    : {
        title: '📋 Subscription Renewal Reminder',
        greeting: `Hi ${userName},`,
        intro: 'The following subscriptions are due for renewal:',
        urgent: '#### 🔴 Urgent (Within 3 Days)',
        soon: '#### 🟠 Soon (Within 7 Days)',
        upcoming: '#### 🟡 Upcoming',
        viewDetails: 'View Details',
      }

  let content = `### ${text.title}\n\n`
  content += `${text.greeting}\n\n`
  content += `${text.intro}\n\n`
  content += `---\n\n`

  // 紧急
  if (subscriptions.urgent.length > 0) {
    content += `${text.urgent}\n\n`
    subscriptions.urgent.forEach((sub) => {
      content += `- **${sub.name}** - ${formatAmount(sub.amount, sub.currency)} - ${getDaysText(sub.daysUntilRenewal, locale)}\n`
    })
    content += `\n`
  }

  // 即将到期
  if (subscriptions.soon.length > 0) {
    content += `${text.soon}\n\n`
    subscriptions.soon.forEach((sub) => {
      content += `- **${sub.name}** - ${formatAmount(sub.amount, sub.currency)} - ${getDaysText(sub.daysUntilRenewal, locale)}\n`
    })
    content += `\n`
  }

  // 普通
  if (subscriptions.upcoming.length > 0) {
    content += `${text.upcoming}\n\n`
    subscriptions.upcoming.forEach((sub) => {
      content += `- **${sub.name}** - ${formatAmount(sub.amount, sub.currency)} - ${getDaysText(sub.daysUntilRenewal, locale)}\n`
    })
    content += `\n`
  }

  content += `---\n\n`
  content += `[${text.viewDetails}](${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscriptions)`

  const totalCount =
    subscriptions.urgent.length +
    subscriptions.soon.length +
    subscriptions.upcoming.length

  return {
    title: `${text.title} - ${totalCount} ${isZh ? '个订阅' : 'subscription(s)'}`,
    text: content,
  }
}

/**
 * 生成飞书消息卡片
 */
export function generateFeishuMessage(data: NotificationData) {
  const { userName, subscriptions, locale } = data
  const isZh = locale === 'zh'

  const text = isZh
    ? {
        title: '📋 订阅续费提醒',
        greeting: `${userName} 你好`,
        intro: '以下订阅即将续费：',
        urgent: '🔴 **紧急（3天内）**',
        soon: '🟠 **即将到期（7天内）**',
        upcoming: '🟡 **即将到期**',
        viewDetails: '查看详情',
      }
    : {
        title: '📋 Subscription Renewal Reminder',
        greeting: `Hi ${userName}`,
        intro: 'The following subscriptions are due for renewal:',
        urgent: '🔴 **Urgent (Within 3 Days)**',
        soon: '🟠 **Soon (Within 7 Days)**',
        upcoming: '🟡 **Upcoming**',
        viewDetails: 'View Details',
      }

  let content = `**${text.greeting}**\n\n`
  content += `${text.intro}\n\n`

  // 紧急
  if (subscriptions.urgent.length > 0) {
    content += `${text.urgent}\n`
    subscriptions.urgent.forEach((sub) => {
      content += `• ${sub.name} - ${formatAmount(sub.amount, sub.currency)} - ${getDaysText(sub.daysUntilRenewal, locale)}\n`
    })
    content += `\n`
  }

  // 即将到期
  if (subscriptions.soon.length > 0) {
    content += `${text.soon}\n`
    subscriptions.soon.forEach((sub) => {
      content += `• ${sub.name} - ${formatAmount(sub.amount, sub.currency)} - ${getDaysText(sub.daysUntilRenewal, locale)}\n`
    })
    content += `\n`
  }

  // 普通
  if (subscriptions.upcoming.length > 0) {
    content += `${text.upcoming}\n`
    subscriptions.upcoming.forEach((sub) => {
      content += `• ${sub.name} - ${formatAmount(sub.amount, sub.currency)} - ${getDaysText(sub.daysUntilRenewal, locale)}\n`
    })
    content += `\n`
  }

  const totalCount =
    subscriptions.urgent.length +
    subscriptions.soon.length +
    subscriptions.upcoming.length

  return {
    title: `${text.title} (${totalCount} ${isZh ? '个订阅' : 'subscription(s)'})`,
    content,
    buttonText: text.viewDetails,
    buttonUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscriptions`,
  }
}
