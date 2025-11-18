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
import { useTranslation } from '@/hooks/use-translation'

export default function SettingsPage() {
  const t = useTranslation()
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
        console.error('Failed to fetch notification config:', error)
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
      const errorMessage = t.errors.networkError
      setTestResults({
        ...testResults,
        [channel]: { success: false, message: errorMessage },
      })
      setError(errorMessage)
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
      setMessage(t.settings.profileUpdateSuccess)
      if (user) {
        setUser({
          ...user,
          name: profileData.name,
          defaultCurrency: profileData.defaultCurrency,
        })
      }
    } catch (err) {
      setError(t.errors.updateFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t.errors.passwordMismatch)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError(t.errors.passwordTooShort)
      return
    }

    setIsLoading(true)

    try {
      // 这里应该调用修改密码的 API
      // 暂时模拟成功
      setMessage(t.settings.passwordChangeSuccess)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err) {
      setError(t.settings.passwordChangeFailed)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-headline">{t.settings.title}</h1>
        <p className="text-sub-headline mt-1">{t.settings.description}</p>
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
          <CardTitle>{t.settings.profile}</CardTitle>
          <CardDescription>{t.settings.profileDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.settings.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-card-background"
              />
              <p className="text-xs text-sub-headline">{t.settings.emailCannotChange}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t.settings.nameLabel}</Label>
              <Input
                id="name"
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                placeholder={t.settings.namePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t.settings.defaultCurrency}</Label>
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
                <option value="CNY">{t.subscription.currencies.CNY}</option>
                <option value="USD">{t.subscription.currencies.USD}</option>
                <option value="EUR">{t.subscription.currencies.EUR}</option>
                <option value="GBP">{t.subscription.currencies.GBP}</option>
              </Select>
              <p className="text-xs text-sub-headline">
                {t.settings.defaultCurrencyHint}
              </p>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? t.subscription.saving : t.subscription.saveChanges}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 修改密码 */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.changePassword}</CardTitle>
          <CardDescription>{t.settings.changePasswordDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t.settings.currentPassword}</Label>
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
              <Label htmlFor="newPassword">{t.settings.newPassword}</Label>
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
              <p className="text-xs text-sub-headline">{t.settings.passwordMinLength}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.settings.confirmNewPassword}</Label>
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
              {isLoading ? t.settings.passwordChanging : t.settings.changePassword}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 通知设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t.settings.notificationTest}
          </CardTitle>
          <CardDescription>
            {t.settings.notificationTestDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notificationConfig === null ? (
            <div className="flex items-center justify-center py-8 text-sub-headline">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              {t.settings.loadingConfig}
            </div>
          ) : !notificationConfig.hasAnyConfig ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-900">
                    {t.settings.noChannelConfigured}
                  </div>
                  <div className="text-sm text-yellow-700 mt-1">
                    {t.settings.configureChannelHint}
                  </div>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1 ml-4 list-disc">
                    <li>RESEND_API_KEY + EMAIL_FROM</li>
                    <li>DINGTALK_WEBHOOK + DINGTALK_SECRET</li>
                    <li>FEISHU_WEBHOOK + FEISHU_SECRET</li>
                  </ul>
                  <div className="text-sm text-yellow-700 mt-2">
                    NOTIFICATION_SETUP.md
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
                          📧 {t.settings.emailChannel}
                        </div>
                        <div className="text-sm text-sub-headline mt-1">
                          {t.settings.sender}{notificationConfig.email.from || '未设置'}
                        </div>
                        <div className="text-sm text-sub-headline">
                          {t.settings.receiver}{user?.email}
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
                          {t.settings.sending}
                        </>
                      ) : (
                        t.settings.sendTest
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
                          📱 {t.settings.dingtalkChannel}
                        </div>
                        <div className="text-sm text-sub-headline mt-1">
                          {t.settings.webhookConfigured}
                        </div>
                        <div className="text-sm text-sub-headline">
                          {t.settings.signatureVerification}
                          {notificationConfig.dingtalk.secured ? (
                            <span className="text-green-600">✓ {t.settings.signatureEnabled}</span>
                          ) : (
                            <span className="text-yellow-600">{t.settings.signatureDisabled}</span>
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
                          {t.settings.sending}
                        </>
                      ) : (
                        t.settings.sendTest
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
                          📱 {t.settings.feishuChannel}
                        </div>
                        <div className="text-sm text-sub-headline mt-1">
                          {t.settings.webhookConfigured}
                        </div>
                        <div className="text-sm text-sub-headline">
                          {t.settings.signatureVerification}
                          {notificationConfig.feishu.secured ? (
                            <span className="text-green-600">✓ {t.settings.signatureEnabled}</span>
                          ) : (
                            <span className="text-yellow-600">{t.settings.signatureDisabled}</span>
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
                          {t.settings.sending}
                        </>
                      ) : (
                        t.settings.sendTest
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-900">
                  <strong>💡 {t.settings.testTip}</strong>
                  <ul className="mt-1 ml-4 list-disc space-y-0.5">
                    <li>{t.settings.checkEmail}</li>
                    <li>{t.settings.checkDingtalk}</li>
                    <li>{t.settings.checkFeishu}</li>
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
          <CardTitle>{t.settings.dataManagement}</CardTitle>
          <CardDescription>{t.settings.dataManagementDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-headline">{t.settings.exportData}</div>
                <div className="text-sm text-sub-headline">
                  {t.settings.exportDataDescription}
                </div>
              </div>
              <Button variant="outline" disabled>
                {t.settings.exportCSV}
              </Button>
            </div>
            <div className="border-t-2 border-stroke pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-red-600">{t.settings.deleteAccount}</div>
                  <div className="text-sm text-sub-headline">
                    {t.settings.deleteAccountWarning}
                  </div>
                </div>
                <Button variant="destructive" disabled>
                  {t.settings.deleteAccount}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 关于 */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.about}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-sub-headline">
            <p>{t.settings.appTitle}</p>
            <p>{t.settings.version}: 1.0.0</p>
            <p>
              <a href="#" className="text-highlight hover:underline">
                {t.settings.termsOfService}
              </a>
              {' • '}
              <a href="#" className="text-highlight hover:underline">
                {t.settings.privacyPolicy}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
