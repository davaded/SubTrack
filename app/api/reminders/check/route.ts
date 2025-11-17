import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, EMAIL_FROM } from '@/lib/email/resend'
import { generateReminderEmail } from '@/lib/email/templates'
import { sendDingTalkMessage } from '@/lib/notification/dingtalk'
import { sendFeishuInteractiveCard } from '@/lib/notification/feishu'
import { generateDingTalkMessage, generateFeishuMessage } from '@/lib/notification/templates'
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
      dingTalkSent: 0,
      feishuSent: 0,
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

        const userName = user.name || user.email.split('@')[0]
        const locale = 'zh' // TODO: 可以从用户设置中获取语言偏好

        // 1. 发送邮件（如果配置了 Resend）
        if (process.env.RESEND_API_KEY) {
          try {
            const { subject, html } = generateReminderEmail({
              userName,
              subscriptions: grouped,
              locale,
            })

            await resend.emails.send({
              from: EMAIL_FROM,
              to: user.email,
              subject,
              html,
            })

            results.emailsSent++
          } catch (error) {
            console.error(`Failed to send email to ${user.email}:`, error)
            results.errors.push(`Email to ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }

        // 2. 发送钉钉通知（如果配置了 Webhook）
        if (process.env.DINGTALK_WEBHOOK) {
          try {
            const dingTalkMsg = generateDingTalkMessage({
              userName,
              subscriptions: grouped,
              locale,
            })

            await sendDingTalkMessage(
              process.env.DINGTALK_WEBHOOK,
              process.env.DINGTALK_SECRET,
              dingTalkMsg
            )

            results.dingTalkSent++
          } catch (error) {
            console.error(`Failed to send DingTalk message:`, error)
            results.errors.push(`DingTalk: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }

        // 3. 发送飞书通知（如果配置了 Webhook）
        if (process.env.FEISHU_WEBHOOK) {
          try {
            const feishuMsg = generateFeishuMessage({
              userName,
              subscriptions: grouped,
              locale,
            })

            await sendFeishuInteractiveCard(
              process.env.FEISHU_WEBHOOK,
              process.env.FEISHU_SECRET,
              feishuMsg
            )

            results.feishuSent++
          } catch (error) {
            console.error(`Failed to send Feishu message:`, error)
            results.errors.push(`Feishu: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }
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
