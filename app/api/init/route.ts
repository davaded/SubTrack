import { NextRequest } from 'next/server'
import { runInitialization } from '@/lib/init-admin'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

/**
 * POST /api/init - Initialize system (create default admin and system settings)
 * This endpoint can be called once after deployment
 */
export async function POST(request: NextRequest) {
  try {
    await runInitialization()

    return successResponse({
      message: 'System initialized successfully'
    })
  } catch (error) {
    console.error('Initialization error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to initialize system',
      500
    )
  }
}

/**
 * GET /api/init - Check initialization status
 */
export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')

    const adminExists = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    const settingsExist = await prisma.systemSettings.findUnique({
      where: { id: 1 }
    })

    return successResponse({
      adminExists: !!adminExists,
      settingsExist: !!settingsExist,
      initialized: !!adminExists && !!settingsExist
    })
  } catch (error) {
    console.error('Status check error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to check initialization status',
      500
    )
  }
}
