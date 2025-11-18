#!/usr/bin/env node

/**
 * 钉钉通知测试脚本
 * 使用方法：node test-dingtalk.js
 */

const crypto = require('crypto')

// 从环境变量读取配置
require('dotenv').config()

const DINGTALK_WEBHOOK = process.env.DINGTALK_WEBHOOK
const DINGTALK_SECRET = process.env.DINGTALK_SECRET

if (!DINGTALK_WEBHOOK) {
  console.error('❌ 错误：未设置 DINGTALK_WEBHOOK 环境变量')
  console.log('\n请在 .env 文件中添加：')
  console.log('DINGTALK_WEBHOOK="https://oapi.dingtalk.com/robot/send?access_token=xxx"')
  console.log('DINGTALK_SECRET="SECxxxxx"（可选，但推荐）')
  process.exit(1)
}

console.log('✅ 已找到钉钉 Webhook 配置')
console.log('🔐 加签模式：', DINGTALK_SECRET ? '启用' : '未启用')

// 生成签名
function generateSign(secret) {
  const timestamp = Date.now()
  const stringToSign = `${timestamp}\n${secret}`
  const sign = crypto
    .createHmac('sha256', secret)
    .update(stringToSign)
    .digest('base64')
  return { timestamp, sign }
}

// 发送测试消息
async function sendTestMessage() {
  let url = DINGTALK_WEBHOOK

  // 如果配置了 Secret，添加签名
  if (DINGTALK_SECRET) {
    const { timestamp, sign } = generateSign(DINGTALK_SECRET)
    url = `${DINGTALK_WEBHOOK}&timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`
    console.log(`\n🔑 已生成签名（时间戳：${timestamp}）`)
  }

  const message = {
    msgtype: 'markdown',
    markdown: {
      title: 'SubTrack 测试通知',
      text: `### 🎉 SubTrack 钉钉通知测试\n\n**测试时间：** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n\n**状态：** ✅ 钉钉机器人配置成功！\n\n---\n\n这是一条测试消息，如果你看到这条消息，说明钉钉通知功能正常工作。\n\n**测试订阅示例：**\n- 📺 **Netflix** - 还有 3 天到期\n- 🎵 **Spotify** - 还有 7 天到期\n- ☁️  **iCloud** - 还有 15 天到期`,
    },
  }

  console.log('\n📤 正在发送测试消息...')

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    const result = await response.json()

    if (result.errcode === 0) {
      console.log('\n✅ 成功！测试消息已发送到钉钉群')
      console.log('👀 请检查你的钉钉群，应该能看到一条测试消息')
    } else {
      console.error('\n❌ 发送失败：', result.errmsg)
      console.log('\n常见错误解决方案：')
      console.log('1. 签名错误：检查 DINGTALK_SECRET 是否正确（格式：SECxxxxx）')
      console.log('2. token无效：检查 DINGTALK_WEBHOOK 的 access_token 是否正确')
      console.log('3. 关键词错误：如果使用"自定义关键词"安全设置，确保消息包含关键词')
    }
  } catch (error) {
    console.error('\n❌ 请求失败：', error.message)
    console.log('\n可能的原因：')
    console.log('1. 网络连接问题')
    console.log('2. Webhook URL 格式错误')
    console.log('3. 钉钉服务暂时不可用')
  }
}

// 运行测试
console.log('\n🧪 SubTrack - 钉钉通知测试\n' + '='.repeat(50))
sendTestMessage()
