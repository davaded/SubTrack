import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'
import { getSystemSettings } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        validation.error.errors[0].message
      )
    }

    const { email, password, name } = validation.data

    // Get system settings
    const settings = await getSystemSettings()

    // Check if registration is closed
    if (settings.registrationMode === 'closed') {
      return errorResponse(
        ErrorCodes.FORBIDDEN,
        'Registration is currently closed. Please contact the administrator.',
        403
      )
    }

    // Check user limit
    if (settings.maxUsersLimit) {
      const userCount = await prisma.user.count()
      if (userCount >= settings.maxUsersLimit) {
        return errorResponse(
          ErrorCodes.FORBIDDEN,
          'User limit reached. Please contact the administrator.',
          403
        )
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse(
        ErrorCodes.EMAIL_EXISTS,
        'Email already registered',
        400
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Determine user status based on registration mode
    const status = settings.registrationMode === 'open' ? 'active' : 'pending'

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user',
        status,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        defaultCurrency: true,
      },
    })

    // If status is pending (approval required), don't auto-login
    if (status === 'pending') {
      return successResponse({
        user,
        message: 'Registration successful! Your account is pending approval. You will be notified once approved.'
      }, 201)
    }

    // Auto-login for open registration
    const token = generateToken({ userId: user.id, email: user.email })
    await setAuthCookie(token)

    return successResponse({ user, token }, 201)
  } catch (error) {
    console.error('Registration error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'An error occurred during registration',
      500
    )
  }
}
