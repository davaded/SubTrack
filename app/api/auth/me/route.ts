import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function GET() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return errorResponse(ErrorCodes.UNAUTHORIZED, 'Not authenticated', 401)
  }

  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    select: {
      id: true,
      email: true,
      name: true,
      defaultCurrency: true,
    },
  })

  if (!user) {
    return errorResponse(ErrorCodes.USER_NOT_FOUND, 'User not found', 404)
  }

  return successResponse(user)
}
