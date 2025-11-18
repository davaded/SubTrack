'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Bell, Mail, Loader2, CheckCircle2, XCircle } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // 个人信息表单
  const [profileData, setProfileData] = useState({
    name: '',
    defaultCurrency: 'CNY',
  })

  // 密码修改表单
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // 通知配置状态
  const [notificationConfig, setNotificationConfig] = useState<{
    email: { configured: boolean; from: string | null }
    dingtalk: { configured: boolean; secured: boolean }
    feishu: { configured: boolean; secured: boolean }
    hasAnyConfig: boolean
  } | null>(null)

  // 测试通知状态
  const [testingChannel, setTestingChannel] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<{
    [key: string]: { success: boolean; message: string } | null
  }>({})

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        defaultCurrency: user.defaultCurrency,
      })
    }
  }, [user])

  // 获取通知配置状态
  useEffect(() => {
    async function fetchNotificationConfig() {
      try {
        const response = await fetch('/api/notifications/test')
        if (response.ok) {
          const config = await response.json()
          setNotificationConfig(config)
        }
      } catch (error) {
        console.error('获取通知配置失败:', error)
      }
    }
    fetchNotificationConfig()
  }, [])

  // 测试通知函数
  const testNotification = async (channel: 'email' | 'dingtalk' | 'feishu') => {
    setTestingChannel(channel)
    setTestResults({ ...testResults, [channel]: null })

    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          userEmail: user?.email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResults({
          ...testResults,
          [channel]: { success: true, message: data.message },
        })
        setMessage(data.message)
      } else {
        setTestResults({
          ...testResults,
          [channel]: { success: false, message: data.error },
        })
        setError(data.error)
      }
    } catch (err: any) {
      setTestResults({
        ...testResults,
        [channel]: { success: false, message: '网络错误，请重试' },
      })
      setError('网络错误，请重试')
    } finally {
      setTestingChannel(null)
      // 3秒后清除测试结果
      setTimeout(() => {
        setTestResults({ ...testResults, [channel]: null })
      }, 3000)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      // 这里应该调用更新用户信息的 API
      // 暂时模拟成功
      setMessage('个人信息更新成功')
      if (user) {
        setUser({
          ...user,
          name: profileData.name,
          defaultCurrency: profileData.defaultCurrency,
        })
      }
    } catch (err) {
      setError('更新失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('新密码和确认密码不一致')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('新密码至少需要 6 位字符')
      return
    }

    setIsLoading(true)

    try {
      // 这里应该调用修改密码的 API
      // 暂时模拟成功
      setMessage('密码修改成功')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      setError('密码修改失败，请检查当前密码是否正确')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-headline">设置</h1>
        <p className="text-sub-headline mt-1">管理您的账户设置和偏好</p>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className="p-4 bg-tertiary/20 border-2 border-tertiary text-headline rounded-md">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {/* 个人信息 */}
      <Card>
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
          <CardDescription>更新您的个人资料</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-card-background"
              />
              <p className="text-xs text-sub-headline">邮箱无法修改</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                placeholder="您的姓名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">默认货币</Label>
              <Select
                id="currency"
                value={profileData.defaultCurrency}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    defaultCurrency: e.target.value,
                  })
                }
              >
                <option value="CNY">人民币 (¥)</option>
                <option value="USD">美元 ($)</option>
                <option value="EUR">欧元 (€)</option>
                <option value="GBP">英镑 (£)</option>
              </Select>
              <p className="text-xs text-sub-headline">
                新添加的订阅将默认使用此货币
              </p>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存更改'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 修改密码 */}
      <Card>
        <CardHeader>
          <CardTitle>修改密码</CardTitle>
          <CardDescription>为了安全，请定期更新您的密码</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="••••••"
                required
              />
              <p className="text-xs text-sub-headline">至少 6 位字符</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? '修改中...' : '修改密码'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 通知设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            通知渠道测试
          </CardTitle>
          <CardDescription>
            测试您配置的通知渠道是否正常工作
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notificationConfig === null ? (
            <div className="flex items-center justify-center py-8 text-sub-headline">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              加载配置中...
            </div>
          ) : !notificationConfig.hasAnyConfig ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-900">
                    未配置任何通知渠道
                  </div>
                  <div className="text-sm text-yellow-700 mt-1">
                    请在项目的 <code className="bg-yellow-100 px-1 rounded">.env</code> 文件中配置至少一个通知渠道：
                  </div>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1 ml-4 list-disc">
                    <li>邮件通知：RESEND_API_KEY + EMAIL_FROM</li>
                    <li>钉钉通知：DINGTALK_WEBHOOK + DINGTALK_SECRET</li>
                    <li>飞书通知：FEISHU_WEBHOOK + FEISHU_SECRET</li>
                  </ul>
                  <div className="text-sm text-yellow-700 mt-2">
                    配置后重启应用即可使用。详见：<code className="bg-yellow-100 px-1 rounded">NOTIFICATION_SETUP.md</code>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 邮件通知 */}
              {notificationConfig.email.configured && (
                <div className="border-2 border-stroke rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-headline">
                          📧 邮件通知 (Resend)
                        </div>
                        <div className="text-sm text-sub-headline mt-1">
                          发件人：{notificationConfig.email.from || '未设置'}
                        </div>
                        <div className="text-sm text-sub-headline">
                          接收邮箱：{user?.email}
                        </div>
                        {testResults.email && (
                          <div
                            className={`mt-2 text-sm flex items-center gap-1 ${
                              testResults.email.success
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {testResults.email.success ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            {testResults.email.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => testNotification('email')}
                      disabled={testingChannel !== null}
                      variant="outline"
                      size="sm"
                    >
                      {testingChannel === 'email' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          发送中...
                        </>
                      ) : (
                        '发送测试'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* 钉钉通知 */}
              {notificationConfig.dingtalk.configured && (
                <div className="border-2 border-stroke rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-headline">
                          📱 钉钉通知
                        </div>
                        <div className="text-sm text-sub-headline mt-1">
                          Webhook：已配置
                        </div>
                        <div className="text-sm text-sub-headline">
                          加签验证：
                          {notificationConfig.dingtalk.secured ? (
                            <span className="text-green-600">✓ 已启用</span>
                          ) : (
                            <span className="text-yellow-600">未启用</span>
                          )}
                        </div>
                        {testResults.dingtalk && (
                          <div
                            className={`mt-2 text-sm flex items-center gap-1 ${
                              testResults.dingtalk.success
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {testResults.dingtalk.success ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            {testResults.dingtalk.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => testNotification('dingtalk')}
                      disabled={testingChannel !== null}
                      variant="outline"
                      size="sm"
                    >
                      {testingChannel === 'dingtalk' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          发送中...
                        </>
                      ) : (
                        '发送测试'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* 飞书通知 */}
              {notificationConfig.feishu.configured && (
                <div className="border-2 border-stroke rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Bell className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-headline">
                          📱 飞书通知
                        </div>
                        <div className="text-sm text-sub-headline mt-1">
                          Webhook：已配置
                        </div>
                        <div className="text-sm text-sub-headline">
                          签名验证：
                          {notificationConfig.feishu.secured ? (
                            <span className="text-green-600">✓ 已启用</span>
                          ) : (
                            <span className="text-yellow-600">未启用</span>
                          )}
                        </div>
                        {testResults.feishu && (
                          <div
                            className={`mt-2 text-sm flex items-center gap-1 ${
                              testResults.feishu.success
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {testResults.feishu.success ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            {testResults.feishu.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => testNotification('feishu')}
                      disabled={testingChannel !== null}
                      variant="outline"
                      size="sm"
                    >
                      {testingChannel === 'feishu' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          发送中...
                        </>
                      ) : (
                        '发送测试'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-900">
                  <strong>💡 提示：</strong>点击"发送测试"按钮后：
                  <ul className="mt-1 ml-4 list-disc space-y-0.5">
                    <li>邮件通知：检查您的邮箱收件箱</li>
                    <li>钉钉通知：检查您的钉钉群消息</li>
                    <li>飞书通知：检查您的飞书群消息</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 数据管理 */}
      <Card>
        <CardHeader>
          <CardTitle>数据管理</CardTitle>
          <CardDescription>导出或删除您的数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-headline">导出数据</div>
                <div className="text-sm text-sub-headline">
                  下载您的所有订阅数据
                </div>
              </div>
              <Button variant="outline" disabled>
                导出 CSV
              </Button>
            </div>
            <div className="border-t-2 border-stroke pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-red-600">删除账户</div>
                  <div className="text-sm text-sub-headline">
                    永久删除您的账户和所有数据
                  </div>
                </div>
                <Button variant="destructive" disabled>
                  删除账户
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 关于 */}
      <Card>
        <CardHeader>
          <CardTitle>关于</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-sub-headline">
            <p>SubTrack - 订阅管理系统</p>
            <p>版本: 1.0.0</p>
            <p>
              <a href="#" className="text-highlight hover:underline">
                使用条款
              </a>
              {' • '}
              <a href="#" className="text-highlight hover:underline">
                隐私政策
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
