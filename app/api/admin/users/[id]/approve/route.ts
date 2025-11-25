import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

// PATCH /api/admin/users/[id]/approve - Approve pending user
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

    if (user.status !== 'pending') {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'User is not in pending status'
      )
    }

    // Approve user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'active',
        approvedBy: admin.id,
        approvedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        approvedBy: true,
        approvedAt: true
      }
    })

    return successResponse({
      user: updatedUser,
      message: 'User approved successfully'
    })
  } catch (error) {
    console.error('Failed to approve user:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to approve user',
      500
    )
  }
}
