import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function GET() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  // getCurrentUser already returns the full user from database
  return successResponse({
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.name,
    defaultCurrency: currentUser.defaultCurrency,
    role: currentUser.role,
    status: currentUser.status,
  })
}
