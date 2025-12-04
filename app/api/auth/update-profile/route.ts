import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, comparePassword, hashPassword } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

// PATCH /api/auth/update-profile - Update user profile (email, name, currency, password)
export async function PATCH(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Please log in to continue', 401)
  }

  try {
    const body = await request.json()
    const { email, name, defaultCurrency, currentPassword, newPassword } = body

    const updateData: any = {}

    // Update name if provided
    if (name !== undefined) {
      updateData.name = name || null
    }

    // Update currency if provided
    if (defaultCurrency) {
      updateData.defaultCurrency = defaultCurrency
    }

    // Update email if provided and different
    if (email && email !== currentUser.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'This email is already registered',
          400
        )
      }

      updateData.email = email
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Get user with password
      const userWithPassword = await prisma.user.findUnique({
        where: { id: currentUser.id }
      })

      if (!userWithPassword) {
        return errorResponse(ErrorCodes.NOT_FOUND, 'User not found', 404)
      }

      // Verify current password
      const isValidPassword = await comparePassword(currentPassword, userWithPassword.password)
      if (!isValidPassword) {
        return errorResponse(
          ErrorCodes.INVALID_CREDENTIALS,
          'Current password is incorrect',
          400
        )
      }

      // Validate new password
      if (newPassword.length < 6) {
        return errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          'New password must be at least 6 characters',
          400
        )
      }

      updateData.password = await hashPassword(newPassword)
      updateData.mustChangePassword = false
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        defaultCurrency: true,
      }
    })

    return successResponse({
      user: updatedUser,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Failed to update profile:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to update profile',
      500
    )
  }
}
