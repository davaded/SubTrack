import dayjs from 'dayjs'

export type BillingCycle = 'monthly' | 'quarterly' | 'semi-annually' | 'annually' | 'custom'

export function calculateNextBillingDate(
  firstBillingDate: Date,
  billingCycle: BillingCycle,
  customCycleDays?: number
): Date {
  const first = dayjs(firstBillingDate)
  const today = dayjs()

  let daysInCycle: number

  switch (billingCycle) {
    case 'monthly':
      // Calculate how many months have passed
      let monthsPassed = 0
      let next = first
      while (next.isBefore(today) || next.isSame(today, 'day')) {
        monthsPassed++
        next = first.add(monthsPassed, 'month')
      }
      return next.toDate()

    case 'quarterly':
      daysInCycle = 90
      break

    case 'semi-annually':
      daysInCycle = 180
      break

    case 'annually':
      daysInCycle = 365
      break

    case 'custom':
      if (!customCycleDays) {
        throw new Error('customCycleDays is required for custom billing cycle')
      }
      daysInCycle = customCycleDays
      break

    default:
      throw new Error(`Invalid billing cycle: ${billingCycle}`)
  }

  // For non-monthly cycles, calculate based on days
  const daysSinceFirst = today.diff(first, 'day')
  const cyclesPassed = Math.floor(daysSinceFirst / daysInCycle)
  const nextBillingDate = first.add((cyclesPassed + 1) * daysInCycle, 'day')

  return nextBillingDate.toDate()
}

export function getDaysUntilRenewal(nextBillingDate: Date): number {
  const today = dayjs()
  const next = dayjs(nextBillingDate)
  return next.diff(today, 'day')
}

export function shouldRemind(
  nextBillingDate: Date,
  remindDaysBefore: number
): boolean {
  const daysUntil = getDaysUntilRenewal(nextBillingDate)
  return daysUntil <= remindDaysBefore && daysUntil >= 0
}
