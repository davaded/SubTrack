'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

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

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        defaultCurrency: user.defaultCurrency,
      })
    }
  }, [user])

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
          <CardTitle>通知设置</CardTitle>
          <CardDescription>管理您的通知偏好</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-headline">浏览器通知</div>
                <div className="text-sm text-sub-headline">
                  当订阅即将续费时通知您
                </div>
              </div>
              <div className="text-sm text-sub-headline">即将推出</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-headline">邮件通知</div>
                <div className="text-sm text-sub-headline">
                  接收续费提醒邮件
                </div>
              </div>
              <div className="text-sm text-sub-headline">即将推出</div>
            </div>
          </div>
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
