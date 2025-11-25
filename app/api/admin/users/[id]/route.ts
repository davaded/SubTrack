import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

// GET /api/admin/users/[id] - Get user details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminOrError = await requireAdmin(request)
  if (adminOrError instanceof Response) {
    return adminOrError
  }

  try {
    const userId = parseInt(params.id)

    if (isNaN(userId)) {
      return errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid user ID')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        approvedBy: true,
        approvedAt: true,
        lastLoginAt: true,
        mustChangePassword: true,
        defaultCurrency: true,
        createdAt: true,
        updatedAt: true,
        subscriptions: {
          select: {
            id: true,
            name: true,
            amount: true,
            currency: true,
            billingCycle: true,
            nextBillingDate: true,
            isActive: true
          }
        }
      }
    })

    if (!user) {
      return errorResponse(ErrorCodes.NOT_FOUND, 'User not found', 404)
    }

    return successResponse(user)
  } catch (error) {
    console.error('Failed to get user:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to retrieve user details',
      500
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await requireAdmin(request)
  if (admin instanceof Response) {
    return admin
  }

  try {
    const userId = parseInt(params.id)

    if (isNaN(userId)) {
      return errorResponse(ErrorCodes.VALIDATION_ERROR, 'Invalid user ID')
    }

    // Prevent deleting yourself
    if (admin.id === userId) {
      return errorResponse(
        ErrorCodes.FORBIDDEN,
        'You cannot delete your own account',
        403
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return errorResponse(ErrorCodes.NOT_FOUND, 'User not found', 404)
    }

    // Delete user (cascading delete will remove subscriptions)
    await prisma.user.delete({
      where: { id: userId }
    })

    return successResponse({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to delete user',
      500
    )
  }
}
