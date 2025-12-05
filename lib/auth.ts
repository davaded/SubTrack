import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-this'
const COOKIE_NAME = 'token'

export interface JWTPayload {
  userId: number
  email: string
}

export interface User {
  id: number
  email: string
  name: string | null
  role: string
  status: string
  defaultCurrency: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  
  // Cookie 配置策略：
  // - secure: false 可以同时支持 HTTP 和 HTTPS
  // - sameSite: 'lax' 允许正常导航时携带 cookie，同时提供 CSRF 保护
  // - httpOnly: true 防止 XSS 攻击读取 cookie
  // 
  // 如果需要强制 HTTPS，设置环境变量 COOKIE_SECURE=true
  const forceSecure = process.env.COOKIE_SECURE === 'true'
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: forceSecure, // false = 支持 HTTP 和 HTTPS，true = 仅 HTTPS
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAuthToken()
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  // Get full user from database
  const { prisma } = await import('./prisma')
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      defaultCurrency: true,
    },
  })

  return user
}
