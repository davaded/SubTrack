import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

// PATCH /api/admin/users/[id]/activate - Activate suspended user
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

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return errorResponse(ErrorCodes.NOT_FOUND, 'User not found', 404)
    }

    if (user.status === 'active') {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'User is already active'
      )
    }

    // Activate user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: 'active' },
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
      message: 'User activated successfully'
    })
  } catch (error) {
    console.error('Failed to activate user:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to activate user',
      500
    )
  }
}
