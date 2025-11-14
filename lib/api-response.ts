import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    } as ApiResponse<T>,
    { status }
  )
}

export function errorResponse(
  code: string,
  message: string,
  status: number = 400
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
    } as ApiResponse,
    { status }
  )
}

// Common error codes
export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SUBSCRIPTION_NOT_FOUND: 'SUBSCRIPTION_NOT_FOUND',
  INVALID_BILLING_CYCLE: 'INVALID_BILLING_CYCLE',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
}
