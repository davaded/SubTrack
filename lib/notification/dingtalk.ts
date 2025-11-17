import crypto from 'crypto'

interface DingTalkMessage {
  title: string
  text: string
}

/**
 * 发送钉钉群机器人消息
 * @param webhookUrl 钉钉机器人 Webhook URL
 * @param secret 加签密钥（可选）
 * @param message 消息内容
 */
export async function sendDingTalkMessage(
  webhookUrl: string,
  secret: string | undefined,
  message: DingTalkMessage
) {
  let url = webhookUrl

  // 如果配置了加签，生成签名
  if (secret) {
    const timestamp = Date.now()
    const stringToSign = `${timestamp}\n${secret}`
    const sign = crypto
      .createHmac('sha256', secret)
      .update(stringToSign)
      .digest('base64')

    url = `${webhookUrl}&timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      msgtype: 'markdown',
      markdown: {
        title: message.title,
        text: message.text,
      },
    }),
  })

  const result = await response.json()

  if (result.errcode !== 0) {
    throw new Error(`DingTalk API Error: ${result.errmsg}`)
  }

  return result
}

/**
 * 发送钉钉 ActionCard 消息（带按钮）
 */
export async function sendDingTalkActionCard(
  webhookUrl: string,
  secret: string | undefined,
  data: {
    title: string
    text: string
    buttonTitle: string
    buttonUrl: string
  }
) {
  let url = webhookUrl

  if (secret) {
    const timestamp = Date.now()
    const stringToSign = `${timestamp}\n${secret}`
    const sign = crypto
      .createHmac('sha256', secret)
      .update(stringToSign)
      .digest('base64')

    url = `${webhookUrl}&timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      msgtype: 'actionCard',
      actionCard: {
        title: data.title,
        text: data.text,
        singleTitle: data.buttonTitle,
        singleURL: data.buttonUrl,
      },
    }),
  })

  return response.json()
}
