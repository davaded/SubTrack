import { NextRequest } from 'next/server'
import { getCurrentUser } from './auth'
import { errorResponse, ErrorCodes } from './api-response'

/**
 * Require admin role for API routes
 * Returns the admin user if authorized, or an error response
 */
export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Please log in to continue', 401)
  }

  if (user.role !== 'admin') {
    return errorResponse(ErrorCodes.FORBIDDEN, 'Admin access required', 403)
  }

  if (user.status !== 'active') {
    return errorResponse(ErrorCodes.FORBIDDEN, 'Your account is not active', 403)
  }

  return user
}

/**
 * Check if current user is admin (non-throwing version)
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin' && user?.status === 'active'
}

/**
 * Get system settings
 */
export async function getSystemSettings() {
  const { prisma } = await import('./prisma')

  let settings = await prisma.systemSettings.findUnique({
    where: { id: 1 }
  })

  // Create default settings if not exists
  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: {
        id: 1,
        registrationMode: 'approval',
        siteName: 'SubTrack'
      }
    })
  }

  return settings
}

/**
 * Update system settings
 */
export async function updateSystemSettings(data: {
  registrationMode?: string
  siteName?: string
  maxUsersLimit?: number | null
}) {
  const { prisma } = await import('./prisma')

  return await prisma.systemSettings.update({
    where: { id: 1 },
    data
  })
}
