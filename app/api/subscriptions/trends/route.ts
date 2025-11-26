import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'
import { calculateMonthlyCost } from '@/lib/currency'
import dayjs from 'dayjs'

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

    // 生成过去12个月的数据
    const months = []
    const now = dayjs()

    for (let i = 11; i >= 0; i--) {
      const month = now.subtract(i, 'month')
      const monthKey = month.format('YYYY-MM')
      const monthLabel = month.format('MMM YYYY')

      let totalMonthly = 0
      let newSubscriptionsCount = 0

      subscriptions.forEach((sub) => {
        const firstBillingDate = dayjs(sub.firstBillingDate)
        const isActiveInMonth =
          sub.isActive &&
          firstBillingDate.isBefore(month.endOf('month'))

        if (isActiveInMonth) {
          const monthlyAmount = calculateMonthlyCost(
            Number(sub.amount),
            sub.currency,
            sub.billingCycle,
            sub.customCycleDays,
            defaultCurrency
          )
          totalMonthly += monthlyAmount

          // 检查是否是本月新增的订阅
          if (firstBillingDate.isSame(month, 'month')) {
            newSubscriptionsCount++
          }
        }
      })

      months.push({
        month: monthKey,
        label: monthLabel,
        total: Number(totalMonthly.toFixed(2)),
        newSubscriptions: newSubscriptionsCount,
      })
    }

    return successResponse({
      currency: defaultCurrency,
      months,
    })
  } catch (error) {
    console.error('Get trends error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to fetch trends',
      500
    )
  }
}
