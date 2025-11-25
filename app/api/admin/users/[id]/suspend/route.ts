import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

// PATCH /api/admin/users/[id]/suspend - Suspend user
export async function PATCH(
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

    // Prevent suspending yourself
    if (admin.id === userId) {
      return errorResponse(
        ErrorCodes.FORBIDDEN,
        'You cannot suspend your own account',
        403
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return errorResponse(ErrorCodes.NOT_FOUND, 'User not found', 404)
    }

    if (user.status === 'suspended') {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'User is already suspended'
      )
    }

    // Suspend user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: 'suspended' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true
      }
    })

    return successResponse({
      user: updatedUser,
      message: 'User suspended successfully'
    })
  } catch (error) {
    console.error('Failed to suspend user:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to suspend user',
      500
    )
  }
}
