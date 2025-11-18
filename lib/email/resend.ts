import { Resend } from 'resend'

// 只在配置了 RESEND_API_KEY 时才创建实例
// 如果未配置，resend 将为 null，调用方需要在使用前检查
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export const EMAIL_FROM = process.env.EMAIL_FROM || 'SubTrack <noreply@subtrack.app>'
