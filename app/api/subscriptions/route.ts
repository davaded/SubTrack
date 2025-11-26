import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { subscriptionSchema } from '@/lib/validations'
import { calculateNextBillingDate, getDaysUntilRenewal } from '@/lib/date-utils'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

// GET /api/subscriptions - List subscriptions
export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'nextBillingDate'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    const where: any = {
      userId: currentUser.id,
    }

    if (category) {
      where.category = category
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    // Add computed fields
    const subscriptionsWithDays = subscriptions.map((sub) => ({
      ...sub,
      amount: Number(sub.amount),
      daysUntilRenewal: getDaysUntilRenewal(sub.nextBillingDate),
    }))

    return successResponse(subscriptionsWithDays)
  } catch (error) {
    console.error('List subscriptions error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to fetch subscriptions',
      500
    )
  }
}

// POST /api/subscriptions - Create subscription
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  try {
    const body = await request.json()

    // Validate input
    const validation = subscriptionSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        validation.error.errors[0].message
      )
    }

    const data = validation.data

    // Parse date if it's a string
    const firstBillingDate =
      typeof data.firstBillingDate === 'string'
        ? new Date(data.firstBillingDate)
        : data.firstBillingDate

    // Calculate next billing date
    const nextBillingDate = calculateNextBillingDate(
      firstBillingDate,
      data.billingCycle,
      data.customCycleDays
    )

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: currentUser.id,
        name: data.name,
        amount: data.amount,
        currency: data.currency,
        billingCycle: data.billingCycle,
        customCycleDays: data.customCycleDays,
        firstBillingDate,
        nextBillingDate,
        category: data.category,
        websiteUrl: data.websiteUrl || null,
        logoUrl: data.logoUrl || null,
        notes: data.notes,
        remindDaysBefore: data.remindDaysBefore,
      },
    })

    return successResponse(
      {
        ...subscription,
        amount: Number(subscription.amount),
      },
      201
    )
  } catch (error) {
    console.error('Create subscription error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to create subscription',
      500
    )
  }
}
