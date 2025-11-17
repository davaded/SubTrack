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

interface EmailData {
  userName: string
  subscriptions: {
    urgent: Subscription[] // 0-3 天
    soon: Subscription[] // 4-7 天
    upcoming: Subscription[] // 8+ 天
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

export function generateReminderEmail(data: EmailData) {
  const { userName, subscriptions, locale } = data
  const isZh = locale === 'zh'

  const text = isZh
    ? {
        subject: '【SubTrack】订阅续费提醒',
        greeting: `你好 ${userName},`,
        intro: '以下订阅即将续费：',
        urgent: '🔴 紧急（3天内）',
        soon: '🟠 即将到期（7天内）',
        upcoming: '🟡 即将到期',
        today: '今天续费',
        tomorrow: '明天续费',
        daysLater: (days: number) => `${days}天后续费`,
        viewDetails: '查看详情',
        footer: 'SubTrack 订阅管理系统',
        unsubscribe: '不想接收邮件提醒？',
        settings: '前往设置',
      }
    : {
        subject: '【SubTrack】Subscription Renewal Reminder',
        greeting: `Hi ${userName},`,
        intro: 'The following subscriptions are due for renewal:',
        urgent: '🔴 Urgent (Within 3 Days)',
        soon: '🟠 Soon (Within 7 Days)',
        upcoming: '🟡 Upcoming',
        today: 'Renewing today',
        tomorrow: 'Renewing tomorrow',
        daysLater: (days: number) => `Renewing in ${days} days`,
        viewDetails: 'View Details',
        footer: 'SubTrack Subscription Manager',
        unsubscribe: "Don't want to receive email reminders?",
        settings: 'Go to Settings',
      }

  const getDaysText = (days: number) => {
    if (days === 0) return text.today
    if (days === 1) return text.tomorrow
    return text.daysLater(days)
  }

  const renderSubscriptionItem = (sub: Subscription) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${
            sub.logoUrl
              ? `<img src="${sub.logoUrl}" alt="${sub.name}" style="width: 32px; height: 32px; border-radius: 6px; object-fit: cover;" />`
              : `<div style="width: 32px; height: 32px; border-radius: 6px; background-color: #ff8ba7; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px;">${sub.name.charAt(0).toUpperCase()}</div>`
          }
          <div>
            <div style="font-weight: 600; color: #1f2937; font-size: 15px;">${sub.name}</div>
            <div style="color: #6b7280; font-size: 13px; margin-top: 2px;">${getDaysText(sub.daysUntilRenewal)}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        <div style="font-weight: 600; color: #1f2937; font-size: 15px;">${formatAmount(sub.amount, sub.currency)}</div>
        <div style="color: #6b7280; font-size: 13px; margin-top: 2px;">${dayjs(sub.nextBillingDate).format('MMM DD, YYYY')}</div>
      </td>
    </tr>
  `

  const renderSection = (title: string, items: Subscription[]) => {
    if (items.length === 0) return ''
    return `
      <div style="margin-bottom: 24px;">
        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">${title}</h3>
        <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          ${items.map(renderSubscriptionItem).join('')}
        </table>
      </div>
    `
  }

  const totalCount =
    subscriptions.urgent.length +
    subscriptions.soon.length +
    subscriptions.upcoming.length

  const html = `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${text.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ff8ba7 0%, #ffc6c7 100%); padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">SubTrack</h1>
              <p style="margin: 8px 0 0 0; color: white; font-size: 14px; opacity: 0.9;">${text.subject}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="background-color: white; padding: 32px 24px;">
              <p style="margin: 0 0 24px 0; color: #1f2937; font-size: 16px;">${text.greeting}</p>
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px;">${text.intro}</p>

              ${renderSection(text.urgent, subscriptions.urgent)}
              ${renderSection(text.soon, subscriptions.soon)}
              ${renderSection(text.upcoming, subscriptions.upcoming)}

              <div style="margin-top: 32px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscriptions"
                   style="display: inline-block; background-color: #ff8ba7; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                  ${text.viewDetails}
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${text.footer}</p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                ${text.unsubscribe}
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings" style="color: #ff8ba7; text-decoration: none;">${text.settings}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  return {
    subject: `${text.subject} - ${totalCount} ${isZh ? '个订阅即将续费' : 'subscription(s) due'}`,
    html,
  }
}
