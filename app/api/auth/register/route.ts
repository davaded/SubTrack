import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-response'

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

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        defaultCurrency: true,
      },
    })

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email })

    // Set cookie
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
