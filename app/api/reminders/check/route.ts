import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, EMAIL_FROM } from '@/lib/email/resend'
import { generateReminderEmail } from '@/lib/email/templates'
import dayjs from 'dayjs'

// 验证 webhook 请求
function verifyWebhookSecret(request: NextRequest): boolean {
  const secret = request.headers.get('x-webhook-secret')
  const expectedSecret = process.env.WEBHOOK_SECRET

  if (!expectedSecret) {
    console.error('WEBHOOK_SECRET is not configured')
    return false
  }

  return secret === expectedSecret
}

export async function POST(request: NextRequest) {
  try {
    // 验证 webhook 密钥
    if (!verifyWebhookSecret(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 获取所有用户
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    const results = {
      totalUsers: users.length,
      emailsSent: 0,
      errors: [] as string[],
    }

    // 对每个用户检查订阅并发送邮件
    for (const user of users) {
      try {
        // 查询该用户的所有活跃订阅
        const subscriptions = await prisma.subscription.findMany({
          where: {
            userId: user.id,
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            amount: true,
            currency: true,
            nextBillingDate: true,
            remindDaysBefore: true,
            logoUrl: true,
          },
        })

        if (subscriptions.length === 0) {
          continue
        }

        // 计算每个订阅距离续费的天数，并筛选需要提醒的
        const today = dayjs().startOf('day')
        const subscriptionsToRemind = subscriptions
          .map((sub) => {
            const nextBilling = dayjs(sub.nextBillingDate).startOf('day')
            const daysUntilRenewal = nextBilling.diff(today, 'day')

            return {
              ...sub,
              daysUntilRenewal,
            }
          })
          .filter((sub) => {
            // 只提醒在提醒天数范围内的订阅
            return sub.daysUntilRenewal >= 0 && sub.daysUntilRenewal <= sub.remindDaysBefore
          })

        // 如果没有需要提醒的订阅，跳过
        if (subscriptionsToRemind.length === 0) {
          continue
        }

        // 按紧急程度分组
        const grouped = {
          urgent: subscriptionsToRemind.filter((s) => s.daysUntilRenewal <= 3),
          soon: subscriptionsToRemind.filter(
            (s) => s.daysUntilRenewal > 3 && s.daysUntilRenewal <= 7
          ),
          upcoming: subscriptionsToRemind.filter((s) => s.daysUntilRenewal > 7),
        }

        // 生成邮件内容（默认中文，可以根据用户设置改为英文）
        const { subject, html } = generateReminderEmail({
          userName: user.name || user.email.split('@')[0],
          subscriptions: grouped,
          locale: 'zh', // TODO: 可以从用户设置中获取语言偏好
        })

        // 发送邮件
        await resend.emails.send({
          from: EMAIL_FROM,
          to: user.email,
          subject,
          html,
        })

        results.emailsSent++
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error)
        results.errors.push(`${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error('Reminder check error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// 也支持 GET 请求（用于测试）
export async function GET(request: NextRequest) {
  // 仅在开发环境允许 GET 请求
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Method not allowed in production' },
      { status: 405 }
    )
  }

  return POST(request)
}
