import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: currentUser.userId,
      },
    })

    let totalMonthly = 0
    const byCategory: Record<string, number> = {}
    let activeCount = 0
    let cancelledCount = 0

    subscriptions.forEach((sub) => {
      const amount = Number(sub.amount)

      if (sub.isActive) {
        activeCount++

        // Calculate monthly amount based on billing cycle
        let monthlyAmount = 0
        switch (sub.billingCycle) {
          case 'monthly':
            monthlyAmount = amount
            break
          case 'quarterly':
            monthlyAmount = amount / 3
            break
          case 'semi-annually':
            monthlyAmount = amount / 6
            break
          case 'annually':
            monthlyAmount = amount / 12
            break
          case 'custom':
            if (sub.customCycleDays) {
              monthlyAmount = (amount / sub.customCycleDays) * 30
            }
            break
        }

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
