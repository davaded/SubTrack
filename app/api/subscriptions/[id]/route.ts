import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateSubscriptionSchema } from '@/lib/validations'
import { calculateNextBillingDate, getDaysUntilRenewal } from '@/lib/date-utils'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

interface RouteContext {
  params: Promise<{ id: string }>
}

// GET /api/subscriptions/[id] - Get subscription details
export async function GET(request: NextRequest, context: RouteContext) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  try {
    const { id } = await context.params
    const subscriptionId = parseInt(id)

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: currentUser.userId,
      },
    })

    if (!subscription) {
      return errorResponse(
        ErrorCodes.SUBSCRIPTION_NOT_FOUND,
        'Subscription not found',
        404
      )
    }

    return successResponse({
      ...subscription,
      amount: Number(subscription.amount),
      daysUntilRenewal: getDaysUntilRenewal(subscription.nextBillingDate),
    })
  } catch (error) {
    console.error('Get subscription error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to fetch subscription',
      500
    )
  }
}

// PUT /api/subscriptions/[id] - Update subscription
export async function PUT(request: NextRequest, context: RouteContext) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  try {
    const { id } = await context.params
    const subscriptionId = parseInt(id)
    const body = await request.json()

    // Check if subscription exists and belongs to user
    const existing = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: currentUser.userId,
      },
    })

    if (!existing) {
      return errorResponse(
        ErrorCodes.SUBSCRIPTION_NOT_FOUND,
        'Subscription not found',
        404
      )
    }

    // Validate input
    const validation = updateSubscriptionSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        validation.error.errors[0].message
      )
    }

    const data = validation.data
    const updateData: any = {}

    // Only update fields that are provided
    if (data.name !== undefined) updateData.name = data.name
    if (data.amount !== undefined) updateData.amount = data.amount
    if (data.currency !== undefined) updateData.currency = data.currency
    if (data.category !== undefined) updateData.category = data.category
    if (data.websiteUrl !== undefined)
      updateData.websiteUrl = data.websiteUrl || null
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl || null
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.remindDaysBefore !== undefined)
      updateData.remindDaysBefore = data.remindDaysBefore
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    // If billing cycle or first billing date changes, recalculate next billing date
    if (data.billingCycle !== undefined || data.firstBillingDate !== undefined) {
      const billingCycle = data.billingCycle || existing.billingCycle
      const firstBillingDate = data.firstBillingDate
        ? typeof data.firstBillingDate === 'string'
          ? new Date(data.firstBillingDate)
          : data.firstBillingDate
        : existing.firstBillingDate

      const customCycleDays =
        data.customCycleDays !== undefined
          ? data.customCycleDays
          : existing.customCycleDays

      updateData.billingCycle = billingCycle
      updateData.firstBillingDate = firstBillingDate
      updateData.customCycleDays = customCycleDays
      updateData.nextBillingDate = calculateNextBillingDate(
        firstBillingDate,
        billingCycle as any,
        customCycleDays || undefined
      )
    }

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
    })

    return successResponse({
      ...subscription,
      amount: Number(subscription.amount),
    })
  } catch (error) {
    console.error('Update subscription error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to update subscription',
      500
    )
  }
}

// DELETE /api/subscriptions/[id] - Delete subscription
export async function DELETE(request: NextRequest, context: RouteContext) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  try {
    const { id } = await context.params
    const subscriptionId = parseInt(id)

    // Check if subscription exists and belongs to user
    const existing = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: currentUser.userId,
      },
    })

    if (!existing) {
      return errorResponse(
        ErrorCodes.SUBSCRIPTION_NOT_FOUND,
        'Subscription not found',
        404
      )
    }

    await prisma.subscription.delete({
      where: { id: subscriptionId },
    })

    return successResponse({ message: 'Subscription deleted successfully' })
  } catch (error) {
    console.error('Delete subscription error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to delete subscription',
      500
    )
  }
}
