import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

// GET /api/admin/users - Get all users with optional filtering
export async function GET(request: NextRequest) {
  // Check admin permission
  const adminOrError = await requireAdmin(request)
  if (adminOrError instanceof Response) {
    return adminOrError
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (role) {
      where.role = role
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        approvedBy: true,
        approvedAt: true,
        lastLoginAt: true,
        defaultCurrency: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            subscriptions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get statistics
    const stats = {
      total: await prisma.user.count(),
      pending: await prisma.user.count({ where: { status: 'pending' } }),
      active: await prisma.user.count({ where: { status: 'active' } }),
      suspended: await prisma.user.count({ where: { status: 'suspended' } }),
      admins: await prisma.user.count({ where: { role: 'admin' } })
    }

    return successResponse({ users, stats })
  } catch (error) {
    console.error('Failed to get users:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'Failed to retrieve users',
      500
    )
  }
}
