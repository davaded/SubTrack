import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'
import { calculateMonthlyCost } from '@/lib/currency'

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

    let totalMonthly = 0
    const byCategory: Record<string, number> = {}
    let activeCount = 0
    let cancelledCount = 0

    subscriptions.forEach((sub) => {
      if (sub.isActive) {
        activeCount++

        // 使用货币转换工具计算月度成本（转换为用户的默认货币）
        const monthlyAmount = calculateMonthlyCost(
          Number(sub.amount),
          sub.currency,
          sub.billingCycle,
          sub.customCycleDays,
          defaultCurrency
        )

        totalMonthly += monthlyAmount

        // Category stats
        if (sub.category) {
          byCategory[sub.category] = (byCategory[sub.category] || 0) + monthlyAmount
        }
      } else {
        cancelledCount++
      }
    })

    const totalYearly = totalMonthly * 12

    return successResponse({
      totalMonthly: Number(totalMonthly.toFixed(2)),
      totalYearly: Number(totalYearly.toFixed(2)),
      activeCount,
      cancelledCount,
      currency: defaultCurrency, // 返回用户的默认货币
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
