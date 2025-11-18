import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, EMAIL_FROM } from '@/lib/email/resend'
import { generateReminderEmail } from '@/lib/email/templates'
import { verifyAuth } from '@/lib/auth'
import dayjs from 'dayjs'

// 测试邮件发送（仅发送给当前登录用户）
export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const authResult = await verifyAuth(request)
    if (!authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = authResult.user.id

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // 查询该用户的所有活跃订阅
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
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
      take: 10, // 最多显示 10 个
    })

    if (subscriptions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active subscriptions found. Please add some subscriptions first.',
        },
        { status: 400 }
      )
    }

    // 计算每个订阅距离续费的天数
    const today = dayjs().startOf('day')
    const subscriptionsWithDays = subscriptions.map((sub) => {
      const nextBilling = dayjs(sub.nextBillingDate).startOf('day')
      const daysUntilRenewal = nextBilling.diff(today, 'day')

      return {
        ...sub,
        daysUntilRenewal,
      }
    })

    // 按紧急程度分组（测试邮件显示所有订阅，不管是否在提醒范围内）
    const grouped = {
      urgent: subscriptionsWithDays.filter((s) => s.daysUntilRenewal <= 3 && s.daysUntilRenewal >= 0),
      soon: subscriptionsWithDays.filter(
        (s) => s.daysUntilRenewal > 3 && s.daysUntilRenewal <= 7
      ),
      upcoming: subscriptionsWithDays.filter((s) => s.daysUntilRenewal > 7),
    }

    // 如果所有分组都是空的，使用所有订阅作为测试数据
    if (grouped.urgent.length === 0 && grouped.soon.length === 0 && grouped.upcoming.length === 0) {
      grouped.upcoming = subscriptionsWithDays
    }

    // 检查邮件服务是否配置
    if (!resend || !process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email service is not configured. Please set RESEND_API_KEY in environment variables.',
        },
        { status: 400 }
      )
    }

    // 生成邮件内容
    const { subject, html } = generateReminderEmail({
      userName: user.name || user.email.split('@')[0],
      subscriptions: grouped,
      locale: 'zh', // TODO: 可以从用户设置中获取
    })

    // 发送测试邮件
    await resend.emails.send({
      from: EMAIL_FROM,
      to: user.email,
      subject: `[测试] ${subject}`,
      html,
    })

    return NextResponse.json({
      success: true,
      data: {
        message: `Test email sent to ${user.email}`,
        subscriptionsCount: subscriptions.length,
      },
    })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test email',
      },
      { status: 500 }
    )
  }
}
