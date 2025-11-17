import crypto from 'crypto'

interface FeishuMessage {
  title: string
  content: string
}

/**
 * 发送飞书群机器人消息
 * @param webhookUrl 飞书机器人 Webhook URL
 * @param secret 签名密钥（可选）
 * @param message 消息内容
 */
export async function sendFeishuMessage(
  webhookUrl: string,
  secret: string | undefined,
  message: FeishuMessage
) {
  const timestamp = Math.floor(Date.now() / 1000)
  let sign: string | undefined

  // 如果配置了签名，生成签名
  if (secret) {
    const stringToSign = `${timestamp}\n${secret}`
    sign = crypto.createHmac('sha256', stringToSign).digest('base64')
  }

  const body: any = {
    msg_type: 'interactive',
    card: {
      config: {
        wide_screen_mode: true,
      },
      header: {
        title: {
          tag: 'plain_text',
          content: message.title,
        },
        template: 'red', // 红色主题
      },
      elements: [
        {
          tag: 'markdown',
          content: message.content,
        },
      ],
    },
  }

  // 添加签名
  if (sign) {
    body.timestamp = timestamp.toString()
    body.sign = sign
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const result = await response.json()

  if (result.code !== 0) {
    throw new Error(`Feishu API Error: ${result.msg}`)
  }

  return result
}

/**
 * 发送飞书富文本消息（支持按钮）
 */
export async function sendFeishuInteractiveCard(
  webhookUrl: string,
  secret: string | undefined,
  data: {
    title: string
    content: string
    buttonText: string
    buttonUrl: string
  }
) {
  const timestamp = Math.floor(Date.now() / 1000)
  let sign: string | undefined

  if (secret) {
    const stringToSign = `${timestamp}\n${secret}`
    sign = crypto.createHmac('sha256', stringToSign).digest('base64')
  }

  const body: any = {
    msg_type: 'interactive',
    card: {
      config: {
        wide_screen_mode: true,
      },
      header: {
        title: {
          tag: 'plain_text',
          content: data.title,
        },
        template: 'red',
      },
      elements: [
        {
          tag: 'markdown',
          content: data.content,
        },
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: {
                tag: 'plain_text',
                content: data.buttonText,
              },
              type: 'primary',
              url: data.buttonUrl,
            },
          ],
        },
      ],
    },
  }

  if (sign) {
    body.timestamp = timestamp.toString()
    body.sign = sign
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return response.json()
}
