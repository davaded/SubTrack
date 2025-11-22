import { NextRequest, NextResponse } from 'next/server'
import { sendDingTalkMessage } from '@/lib/notification/dingtalk'
import { sendFeishuInteractiveCard } from '@/lib/notification/feishu'
import { resend } from '@/lib/email/resend'

/**
 * 测试通知 API
 * POST /api/notifications/test
 * Body: { channel: 'email' | 'dingtalk' | 'feishu', userEmail?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { channel, userEmail } = body

    // 获取当前时间
    const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })

    switch (channel) {
      case 'email': {
        // 检查是否配置了邮件
        if (!resend || !process.env.RESEND_API_KEY) {
          return NextResponse.json(
            { error: '邮件服务未配置', configured: false },
            { status: 400 }
          )
        }

        if (!userEmail) {
          return NextResponse.json(
            { error: '缺少用户邮箱', configured: true },
            { status: 400 }
          )
        }

        // 发送测试邮件
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: userEmail,
          subject: '🧪 SubTrack 测试通知 - Test Notification',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                  .success { background: #10b981; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
                  .info { background: #e5e7eb; padding: 15px; border-radius: 8px; margin: 20px 0; }
                  .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🎉 测试通知成功！</h1>
                    <h2>Test Notification Success!</h2>
                  </div>
                  <div class="content">
                    <div class="success">
                      <strong>✅ 邮件通知配置正常</strong><br>
                      Email notification is working properly
                    </div>
                    <div class="info">
                      <strong>测试信息 / Test Info:</strong><br>
                      <ul>
                        <li><strong>测试时间 / Time:</strong> ${now}</li>
                        <li><strong>接收邮箱 / Email:</strong> ${userEmail}</li>
                        <li><strong>服务商 / Provider:</strong> Resend</li>
                      </ul>
                    </div>
                    <p>如果您看到这封邮件，说明邮件提醒功能已经配置成功！您将会在订阅即将到期时收到提醒。</p>
                    <p>If you received this email, it means the email reminder feature is configured correctly! You will receive reminders when your subscriptions are about to expire.</p>
                    <div class="footer">
                      <p>SubTrack - Subscription Management System</p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
        })

        return NextResponse.json({
          success: true,
          message: '测试邮件已发送',
          channel: 'email',
        })
      }

      case 'dingtalk': {
        // 检查是否配置了钉钉
        if (!process.env.DINGTALK_WEBHOOK) {
          return NextResponse.json(
            { error: '钉钉通知未配置', configured: false },
            { status: 400 }
          )
        }

        const message = {
          title: 'SubTrack 测试通知',
          text: `### 🎉 测试通知成功！\n\n**✅ 钉钉通知配置正常**\n\n---\n\n**测试信息：**\n- ⏰ **测试时间：** ${now}\n- 📱 **通知渠道：** 钉钉群机器人\n- 🔐 **加签验证：** ${process.env.DINGTALK_SECRET ? '已启用' : '未启用'}\n\n---\n\n如果您看到这条消息，说明钉钉提醒功能已经配置成功！您将会在订阅即将到期时收到提醒。\n\n**测试订阅示例：**\n- 📺 **Netflix** - 还有 3 天到期 💰 ¥30.00/月\n- 🎵 **Spotify** - 还有 7 天到期 💰 ¥15.00/月\n- ☁️  **iCloud** - 还有 15 天到期 💰 ¥21.00/月`,
        }

        await sendDingTalkMessage(
          process.env.DINGTALK_WEBHOOK,
          process.env.DINGTALK_SECRET,
          message
        )

        return NextResponse.json({
          success: true,
          message: '测试消息已发送到钉钉',
          channel: 'dingtalk',
        })
      }

      case 'feishu': {
        // 检查是否配置了飞书
        if (!process.env.FEISHU_WEBHOOK) {
          return NextResponse.json(
            { error: '飞书通知未配置', configured: false },
            { status: 400 }
          )
        }

        await sendFeishuInteractiveCard(
          process.env.FEISHU_WEBHOOK,
          process.env.FEISHU_SECRET,
          {
            title: '🎉 测试通知成功！',
            content: `**✅ 飞书通知配置正常**\n\n---\n\n**测试信息：**\n⏰ 测试时间：${now}\n📱 通知渠道：飞书群机器人\n🔐 签名验证：${process.env.FEISHU_SECRET ? '已启用' : '未启用'}\n\n---\n\n如果您看到这条消息，说明飞书提醒功能已经配置成功！您将会在订阅即将到期时收到提醒。\n\n**测试订阅示例：**\n📺 Netflix - 还有 3 天到期 💰 ¥30.00/月\n🎵 Spotify - 还有 7 天到期 💰 ¥15.00/月\n☁️ iCloud - 还有 15 天到期 💰 ¥21.00/月`,
            buttonText: '查看订阅',
            buttonUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          }
        )

        return NextResponse.json({
          success: true,
          message: '测试消息已发送到飞书',
          channel: 'feishu',
        })
      }

      default:
        return NextResponse.json(
          { error: '不支持的通知渠道' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('发送测试通知失败:', error)
    return NextResponse.json(
      { error: error.message || '发送测试通知失败' },
      { status: 500 }
    )
  }
}

/**
 * 检查通知配置状态
 * GET /api/notifications/test
 */
export async function GET() {
  const config = {
    email: {
      configured: !!process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || null,
    },
    dingtalk: {
      configured: !!process.env.DINGTALK_WEBHOOK,
      secured: !!process.env.DINGTALK_SECRET,
    },
    feishu: {
      configured: !!process.env.FEISHU_WEBHOOK,
      secured: !!process.env.FEISHU_SECRET,
    },
  }

  const hasAnyConfig = config.email.configured || config.dingtalk.configured || config.feishu.configured

  return NextResponse.json({
    ...config,
    hasAnyConfig,
  })
}
