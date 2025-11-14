'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import dayjs from 'dayjs'
import { ArrowLeft } from 'lucide-react'

interface Subscription {
  id: number
  name: string
  amount: number
  currency: string
  billingCycle: string
  customCycleDays: number | null
  firstBillingDate: string
  category: string | null
  websiteUrl: string | null
  logoUrl: string | null
  notes: string | null
  remindDaysBefore: number
  isActive: boolean
}

export default function EditSubscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: 'CNY',
    billingCycle: 'monthly',
    customCycleDays: '',
    firstBillingDate: '',
    category: '',
    websiteUrl: '',
    logoUrl: '',
    notes: '',
    remindDaysBefore: '3',
    isActive: true,
  })

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch(`/api/subscriptions/${resolvedParams.id}`)
        if (response.ok) {
          const data = await response.json()
          const sub = data.data
          setSubscription(sub)

          // 填充表单
          setFormData({
            name: sub.name,
            amount: sub.amount.toString(),
            currency: sub.currency,
            billingCycle: sub.billingCycle,
            customCycleDays: sub.customCycleDays?.toString() || '',
            firstBillingDate: dayjs(sub.firstBillingDate).format('YYYY-MM-DD'),
            category: sub.category || '',
            websiteUrl: sub.websiteUrl || '',
            logoUrl: sub.logoUrl || '',
            notes: sub.notes || '',
            remindDaysBefore: sub.remindDaysBefore.toString(),
            isActive: sub.isActive,
          })
        } else {
          router.push('/subscriptions')
        }
      } catch (error) {
        console.error('获取订阅信息失败:', error)
        router.push('/subscriptions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [resolvedParams.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      const payload = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        billingCycle: formData.billingCycle,
        customCycleDays: formData.customCycleDays
          ? parseInt(formData.customCycleDays)
          : undefined,
        firstBillingDate: formData.firstBillingDate,
        category: formData.category || undefined,
        websiteUrl: formData.websiteUrl || undefined,
        logoUrl: formData.logoUrl || undefined,
        notes: formData.notes || undefined,
        remindDaysBefore: parseInt(formData.remindDaysBefore),
        isActive: formData.isActive,
      }

      const response = await fetch(`/api/subscriptions/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/subscriptions/${resolvedParams.id}`)
      } else {
        setError(data.error.message || '更新订阅失败')
      }
    } catch (err) {
      setError('发生错误，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
      </div>
    )
  }

  if (!subscription) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <h1 className="text-3xl font-bold text-headline">编辑订阅</h1>
        <p className="text-sub-headline mt-1">修改 {subscription.name} 的信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>订阅详情</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-red-50 border-2 border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {/* 订阅名称 */}
            <div className="space-y-2">
              <Label htmlFor="name">
                订阅名称 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="例如: Netflix"
                required
              />
            </div>

            {/* 金额和货币 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  金额 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="30.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">货币</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option value="CNY">人民币 (¥)</option>
                  <option value="USD">美元 ($)</option>
                  <option value="EUR">欧元 (€)</option>
                  <option value="GBP">英镑 (£)</option>
                </Select>
              </div>
            </div>

            {/* 计费周期 */}
            <div className="space-y-2">
              <Label htmlFor="billingCycle">
                计费周期 <span className="text-red-500">*</span>
              </Label>
              <Select
                id="billingCycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
              >
                <option value="monthly">每月</option>
                <option value="quarterly">每季度</option>
                <option value="semi-annually">每半年</option>
                <option value="annually">每年</option>
                <option value="custom">自定义</option>
              </Select>
            </div>

            {/* 自定义周期天数 */}
            {formData.billingCycle === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customCycleDays">
                  自定义周期天数 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customCycleDays"
                  name="customCycleDays"
                  type="number"
                  value={formData.customCycleDays}
                  onChange={handleChange}
                  placeholder="30"
                  required
                />
              </div>
            )}

            {/* 首次计费日期 */}
            <div className="space-y-2">
              <Label htmlFor="firstBillingDate">
                首次计费日期 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstBillingDate"
                name="firstBillingDate"
                type="date"
                value={formData.firstBillingDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* 分类 */}
            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">选择分类</option>
                <option value="entertainment">娱乐</option>
                <option value="productivity">工作</option>
                <option value="education">学习</option>
                <option value="fitness">健身</option>
                <option value="music">音乐</option>
                <option value="cloud">云服务</option>
                <option value="other">其他</option>
              </Select>
            </div>

            {/* 网站链接 */}
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">网站链接</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            {/* 提醒天数 */}
            <div className="space-y-2">
              <Label htmlFor="remindDaysBefore">提前提醒天数</Label>
              <Input
                id="remindDaysBefore"
                name="remindDaysBefore"
                type="number"
                value={formData.remindDaysBefore}
                onChange={handleChange}
                min="0"
              />
              <p className="text-xs text-sub-headline">
                在续费日期前 {formData.remindDaysBefore} 天提醒
              </p>
            </div>

            {/* 备注 */}
            <div className="space-y-2">
              <Label htmlFor="notes">备注</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="添加任何备注信息..."
                rows={3}
              />
            </div>

            {/* 订阅状态 */}
            <div className="space-y-2">
              <Label htmlFor="isActive">订阅状态</Label>
              <Select
                id="isActive"
                name="isActive"
                value={formData.isActive.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.value === 'true',
                  })
                }
              >
                <option value="true">活跃</option>
                <option value="false">已取消</option>
              </Select>
              {!formData.isActive && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">已取消的订阅将不计入统计</Badge>
                </div>
              )}
            </div>

            {/* 按钮 */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? '保存中...' : '保存更改'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSaving}
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
