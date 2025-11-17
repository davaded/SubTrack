'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { COMMON_SERVICES, getLogoFromDomain } from '@/lib/common-services'
import dayjs from 'dayjs'

export default function NewSubscriptionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    currency: 'CNY',
    billingCycle: 'monthly',
    customCycleDays: '',
    firstBillingDate: dayjs().format('YYYY-MM-DD'),
    category: '',
    websiteUrl: '',
    logoUrl: '',
    notes: '',
    remindDaysBefore: '3',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        customCycleDays: formData.customCycleDays
          ? parseInt(formData.customCycleDays)
          : undefined,
        remindDaysBefore: parseInt(formData.remindDaysBefore),
        category: formData.category || undefined,
        websiteUrl: formData.websiteUrl || undefined,
        logoUrl: formData.logoUrl || undefined,
        notes: formData.notes || undefined,
      }

      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/subscriptions')
      } else {
        setError(data.error.message || 'Failed to create subscription')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-headline">添加订阅</h1>
        <p className="text-sm text-sub-headline mt-0.5">
          快速添加新的订阅服务
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-2 text-sm bg-red-50 border-2 border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {/* 常见服务快速选择 */}
            <div className="p-3 bg-card-background rounded-lg">
              <Label className="text-sm">快速选择常见服务</Label>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-2">
                {COMMON_SERVICES.slice(0, 10).map((service) => (
                  <button
                    key={service.name}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        name: service.name,
                        logoUrl: service.logoUrl,
                        category: service.category,
                      })
                    }}
                    className="flex flex-col items-center p-1.5 rounded-lg hover:bg-secondary transition-colors border-2 border-transparent hover:border-highlight"
                    title={service.name}
                  >
                    <img
                      src={service.logoUrl}
                      alt={service.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="text-xs mt-0.5 truncate w-full text-center">
                      {service.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 基本信息 - 第一行 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm">
                  订阅名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="如：Netflix"
                  required
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-sm">
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
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency" className="text-sm">货币</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="h-9"
                >
                  <option value="CNY">¥ 人民币</option>
                  <option value="USD">$ 美元</option>
                  <option value="EUR">€ 欧元</option>
                  <option value="GBP">£ 英镑</option>
                </Select>
              </div>
            </div>

            {/* 计费信息 - 第二行 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="billingCycle" className="text-sm">
                  计费周期 <span className="text-red-500">*</span>
                </Label>
                <Select
                  id="billingCycle"
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleChange}
                  className="h-9"
                >
                  <option value="monthly">每月</option>
                  <option value="quarterly">每季度</option>
                  <option value="semi-annually">每半年</option>
                  <option value="annually">每年</option>
                  <option value="custom">自定义</option>
                </Select>
              </div>
              {formData.billingCycle === 'custom' && (
                <div className="space-y-1.5">
                  <Label htmlFor="customCycleDays" className="text-sm">
                    自定义天数 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customCycleDays"
                    name="customCycleDays"
                    type="number"
                    value={formData.customCycleDays}
                    onChange={handleChange}
                    placeholder="30"
                    required
                    className="h-9"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="firstBillingDate" className="text-sm">
                  首次计费日期 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstBillingDate"
                  name="firstBillingDate"
                  type="date"
                  value={formData.firstBillingDate}
                  onChange={handleChange}
                  required
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-sm">分类</Label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-9"
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
            </div>

            {/* 网站和提醒 - 第三行 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3 space-y-1.5">
                <Label htmlFor="websiteUrl" className="text-sm">网站链接</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="remindDaysBefore" className="text-sm">提前提醒(天)</Label>
                <Input
                  id="remindDaysBefore"
                  name="remindDaysBefore"
                  type="number"
                  value={formData.remindDaysBefore}
                  onChange={handleChange}
                  min="0"
                  className="h-9"
                />
              </div>
            </div>

            {/* 图标设置 */}
            <div className="p-3 bg-card-background rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm">图标设置</Label>
                {formData.logoUrl && (
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="w-6 h-6 rounded object-cover border border-stroke"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="图标 URL"
                  type="url"
                  className="h-8 text-sm flex-1 min-w-[200px]"
                />
                {formData.websiteUrl && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const logo = getLogoFromDomain(formData.websiteUrl, 'favicon')
                        if (logo) setFormData({ ...formData, logoUrl: logo })
                      }}
                      className="h-8 text-xs"
                    >
                      Favicon
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const logo = getLogoFromDomain(formData.websiteUrl, 'google')
                        if (logo) setFormData({ ...formData, logoUrl: logo })
                      }}
                      className="h-8 text-xs"
                    >
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const logo = getLogoFromDomain(formData.websiteUrl, 'clearbit')
                        if (logo) setFormData({ ...formData, logoUrl: logo })
                      }}
                      className="h-8 text-xs"
                    >
                      Clearbit
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* 备注 */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm">备注</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="添加备注信息..."
                rows={2}
                className="text-sm"
              />
            </div>

            {/* 按钮 */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isLoading} className="flex-1 h-9">
                {isLoading ? '创建中...' : '创建订阅'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                className="h-9"
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
