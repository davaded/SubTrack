import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'
import dayjs from 'dayjs'

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: currentUser.userId,
        isActive: true,
      },
    })

    const now = dayjs()
    const startOfMonth = now.startOf('month')
    const endOfMonth = now.endOf('month')

    // 过滤出本月要续费的订阅
    const upcomingThisMonth = subscriptions
      .map((sub) => {
        const nextBillingDate = dayjs(sub.nextBillingDate)

        if (
          nextBillingDate.isAfter(startOfMonth) &&
          nextBillingDate.isBefore(endOfMonth)
        ) {
          const daysUntilRenewal = nextBillingDate.diff(now, 'day')

          return {
            id: sub.id,
            name: sub.name,
            amount: Number(sub.amount),
            currency: sub.currency,
            nextBillingDate: sub.nextBillingDate,
            daysUntilRenewal,
            category: sub.category,
            logoUrl: sub.logoUrl,
          }
        }
        return null
      })
      .filter((sub) => sub !== null)
      .sort((a, b) => {
        // 按续费日期排序
        return (
          dayjs(a!.nextBillingDate).unix() - dayjs(b!.nextBillingDate).unix()
        )
      })

    return successResponse(upcomingThisMonth)
  } catch (error) {
    console.error('Get upcoming subscriptions error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to fetch upcoming subscriptions',
      500
    )
  }
}
