import { NextRequest } from 'next/server'
import { getCurrentUser } from './auth'
import { errorResponse } from './api-response'
import { ErrorCode } from './error-codes'

/**
 * Require admin role for API routes
 * Returns the admin user if authorized, or an error response
 */
export async function requireAdmin(request: NextRequest) {
  const user = await getCurrentUser(request)

  if (!user) {
    return errorResponse(ErrorCode.UNAUTHORIZED, 'Please log in to continue', 401)
  }

  if (user.role !== 'admin') {
    return errorResponse(ErrorCode.FORBIDDEN, 'Admin access required', 403)
  }

  if (user.status !== 'active') {
    return errorResponse(ErrorCode.FORBIDDEN, 'Your account is not active', 403)
  }

  return user
}

/**
 * Check if current user is admin (non-throwing version)
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(request)
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
