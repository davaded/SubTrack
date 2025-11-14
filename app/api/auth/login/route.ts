import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return errorResponse(
        ErrorCodes.VALIDATION_ERROR,
        validation.error.errors[0].message
      )
    }

    const { email, password } = validation.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return errorResponse(
        ErrorCodes.INVALID_CREDENTIALS,
        'Invalid email or password',
        401
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return errorResponse(
        ErrorCodes.INVALID_CREDENTIALS,
        'Invalid email or password',
        401
      )
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email })

    // Set cookie
    await setAuthCookie(token)

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        defaultCurrency: user.defaultCurrency,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      'An error occurred during login',
      500
    )
  }
}
