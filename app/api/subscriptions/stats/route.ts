import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'
import { convertCurrency } from '@/lib/currency'
import dayjs from 'dayjs'

// 计算从首次计费日到今天已经发生了多少次计费
function calculatePaymentCount(
  firstBillingDate: Date,
  billingCycle: string,
  customCycleDays: number | null
): number {
  const start = dayjs(firstBillingDate)
  const today = dayjs()
  
  if (start.isAfter(today)) {
    return 0 // 还没开始计费
  }

  const daysSinceStart = today.diff(start, 'day')
  
  let cycleDays: number
  switch (billingCycle) {
    case 'monthly':
      cycleDays = 30
      break
    case 'quarterly':
      cycleDays = 90
      break
    case 'semi-annually':
      cycleDays = 180
      break
    case 'annually':
      cycleDays = 365
      break
    case 'custom':
      cycleDays = customCycleDays || 30
      break
    default:
      cycleDays = 30
  }

  // 计算已经发生的计费次数（包括首次）
  return Math.floor(daysSinceStart / cycleDays) + 1
}

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  try {
    // 获取用户信息以获取默认货币
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    })

    const defaultCurrency = user?.defaultCurrency || 'USD'

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: currentUser.id,
      },
    })

    let totalSpent = 0 // 历史总支出
    const byCategory: Record<string, number> = {}
    let activeCount = 0
    let cancelledCount = 0

    subscriptions.forEach((sub) => {
      if (sub.isActive) {
        activeCount++
      } else {
        cancelledCount++
      }

      // 计算已发生的支付次数
      const paymentCount = calculatePaymentCount(
        sub.firstBillingDate,
        sub.billingCycle,
        sub.customCycleDays
      )

      if (paymentCount > 0) {
        // 转换为用户默认货币
        const amountInDefaultCurrency = convertCurrency(
          Number(sub.amount),
          sub.currency,
          defaultCurrency
        )

        const totalForSub = amountInDefaultCurrency * paymentCount
        totalSpent += totalForSub

        // Category stats
        if (sub.category) {
          byCategory[sub.category] = (byCategory[sub.category] || 0) + totalForSub
        }
      }
    })

    return successResponse({
      totalSpent: Number(totalSpent.toFixed(2)), // 历史总支出
      activeCount,
      cancelledCount,
      currency: defaultCurrency,
      byCategory: Object.fromEntries(
        Object.entries(byCategory).map(([key, value]) => [
          key,
          Number(value.toFixed(2)),
        ])
      ),
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to fetch statistics',
      500
    )
  }
}
