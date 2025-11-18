/**
 * 货币转换工具
 * 支持常见货币之间的转换
 */

// 汇率配置（相对于 USD）
// 注意：这些是示例汇率，实际使用时应该接入实时汇率 API
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1, // 美元基准
  CNY: 7.2, // 1 USD = 7.2 CNY
  EUR: 0.92, // 1 USD = 0.92 EUR
  GBP: 0.79, // 1 USD = 0.79 GBP
}

/**
 * 将金额从一种货币转换为另一种货币
 * @param amount 金额
 * @param fromCurrency 源货币
 * @param toCurrency 目标货币
 * @returns 转换后的金额
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const fromRate = EXCHANGE_RATES[fromCurrency] || 1
  const toRate = EXCHANGE_RATES[toCurrency] || 1

  // 先转换为 USD，再转换为目标货币
  const amountInUSD = amount / fromRate
  const convertedAmount = amountInUSD * toRate

  return convertedAmount
}

/**
 * 格式化货币显示
 * @param amount 金额
 * @param currency 货币代码
 * @returns 格式化后的字符串
 */
export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    GBP: '£',
  }

  const symbol = symbols[currency] || currency
  return `${symbol}${amount.toFixed(2)}`
}

/**
 * 获取货币符号
 * @param currency 货币代码
 * @returns 货币符号
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    GBP: '£',
  }

  return symbols[currency] || currency
}

/**
 * 计算订阅的月度成本（转换为指定货币）
 * @param amount 订阅金额
 * @param currency 订阅货币
 * @param billingCycle 计费周期
 * @param targetCurrency 目标货币
 * @returns 月度成本
 */
export function calculateMonthlyCost(
  amount: number,
  currency: string,
  billingCycle: string,
  customCycleDays: number | null,
  targetCurrency: string
): number {
  // 先将金额转换为目标货币
  const convertedAmount = convertCurrency(amount, currency, targetCurrency)

  // 根据计费周期计算月度成本
  switch (billingCycle) {
    case 'monthly':
      return convertedAmount
    case 'quarterly':
      return convertedAmount / 3
    case 'semiAnnually':
      return convertedAmount / 6
    case 'annually':
      return convertedAmount / 12
    case 'custom':
      if (customCycleDays) {
        return (convertedAmount / customCycleDays) * 30
      }
      return convertedAmount
    default:
      return convertedAmount
  }
}

/**
 * 计算订阅的年度成本（转换为指定货币）
 * @param amount 订阅金额
 * @param currency 订阅货币
 * @param billingCycle 计费周期
 * @param targetCurrency 目标货币
 * @returns 年度成本
 */
export function calculateYearlyCost(
  amount: number,
  currency: string,
  billingCycle: string,
  customCycleDays: number | null,
  targetCurrency: string
): number {
  const monthlyCost = calculateMonthlyCost(
    amount,
    currency,
    billingCycle,
    customCycleDays,
    targetCurrency
  )
  return monthlyCost * 12
}
