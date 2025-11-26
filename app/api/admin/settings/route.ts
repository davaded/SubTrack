import { NextRequest } from 'next/server'
import { requireAdmin, getSystemSettings, updateSystemSettings } from '@/lib/admin-auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

// GET /api/admin/settings - Get system settings
export async function GET(request: NextRequest) {
  // Check admin permission
  const adminOrError = await requireAdmin()
  if (adminOrError instanceof Response) {
    return adminOrError
  }

  try {
    const settings = await getSystemSettings()
    return successResponse(settings)
  } catch (error) {
    console.error('Failed to get settings:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to retrieve system settings',
      500
    )
  }
}

// PATCH /api/admin/settings - Update system settings
export async function PATCH(request: NextRequest) {
  // Check admin permission
  const adminOrError = await requireAdmin()
  if (adminOrError instanceof Response) {
    return adminOrError
  }

  try {
    const body = await request.json()

    // Validate registration mode
    if (body.registrationMode && !['open', 'approval', 'closed'].includes(body.registrationMode)) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Invalid registration mode. Must be one of: open, approval, closed'
      )
    }

    // Update settings
    const settings = await updateSystemSettings(body)

    return successResponse(settings)
  } catch (error) {
    console.error('Failed to update settings:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to update system settings',
      500
    )
  }
}
