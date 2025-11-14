import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getDaysUntilRenewal, shouldRemind } from '@/lib/date-utils'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'
import dayjs from 'dayjs'

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const futureDate = dayjs().add(days, 'day').toDate()

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: currentUser.userId,
        isActive: true,
        nextBillingDate: {
          lte: futureDate,
        },
      },
      orderBy: {
        nextBillingDate: 'asc',
      },
    })

    const upcomingSubscriptions = subscriptions.map((sub) => ({
      ...sub,
      amount: Number(sub.amount),
      daysUntilRenewal: getDaysUntilRenewal(sub.nextBillingDate),
      shouldRemind: shouldRemind(sub.nextBillingDate, sub.remindDaysBefore),
    }))

    return successResponse(upcomingSubscriptions)
  } catch (error) {
    console.error('Get upcoming subscriptions error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to fetch upcoming subscriptions',
      500
    )
  }
}
