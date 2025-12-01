'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { COMMON_SERVICES, getLogoFromDomain } from '@/lib/common-services'
import dayjs from 'dayjs'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/lib/hooks/use-translation'

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
  params: { id: string }
}) {
  const router = useRouter()
  const { t } = useTranslation()
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
        const response = await fetch(`/api/subscriptions/${params.id}`, { credentials: 'include' })
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
  }, [params.id, router])

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

      const response = await fetch(`/api/subscriptions/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/subscriptions/${params.id}`)
      } else {
        setError(data.error.message || t.errors.updateFailed)
      }
    } catch (err) {
      setError(t.errors.unknownError)
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
          {t.common.back}
        </Button>
        <h1 className="text-3xl font-bold text-headline">{t.subscription.editTitle}</h1>
        <p className="text-sub-headline mt-1">{t.subscription.editDesc.replace('{name}', subscription.name)}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.subscription.detailsTitle}</CardTitle>
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
                {t.subscription.name} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.subscription.namePlaceholder}
                required
              />
            </div>

            {/* Logo 选择器 */}
            <div className="space-y-3 p-4 bg-card-background rounded-lg">
              <Label>{t.subscription.iconLogoOptional}</Label>

              {/* 当前图标预览 */}
              {formData.logoUrl && (
                <div className="flex items-center gap-3">
                  <img
                    src={formData.logoUrl}
                    alt="Logo preview"
                    className="w-12 h-12 rounded-lg object-cover border-2 border-stroke"
                    onError={(e) => {
                      e.currentTarget.src = ''
                      setFormData({ ...formData, logoUrl: '' })
                    }}
                  />
                  <span className="text-sm text-sub-headline">{t.subscription.currentIcon}</span>
                </div>
              )}

              {/* 常见服务快速选择 */}
              <div>
                <p className="text-sm text-sub-headline mb-2">{t.subscription.quickSelectLabel}</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {COMMON_SERVICES.slice(0, 12).map((service) => (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          logoUrl: service.logoUrl,
                        })
                      }}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-secondary transition-colors border-2 border-transparent hover:border-highlight"
                      title={service.name}
                    >
                      <img
                        src={service.logoUrl}
                        alt={service.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="text-xs mt-1 truncate w-full text-center">
                        {service.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 自定义 Logo URL */}
              <div className="space-y-2">
                <Label htmlFor="logoUrl">{t.subscription.customIconUrl}</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  type="url"
                />
                {formData.websiteUrl && (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const logo = getLogoFromDomain(formData.websiteUrl, 'favicon')
                        if (logo) {
                          setFormData({ ...formData, logoUrl: logo })
                        }
                      }}
                    >
                      {t.subscription.fetchFavicon}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const logo = getLogoFromDomain(formData.websiteUrl, 'google')
                        if (logo) {
                          setFormData({ ...formData, logoUrl: logo })
                        }
                      }}
                    >
                      {t.subscription.fetchGoogle}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const logo = getLogoFromDomain(formData.websiteUrl, 'clearbit')
                        if (logo) {
                          setFormData({ ...formData, logoUrl: logo })
                        }
                      }}
                    >
                      {t.subscription.fetchClearbit}
                    </Button>
                  </div>
                )}
                <p className="text-xs text-sub-headline">
                  {t.subscription.iconTip}
                </p>
              </div>
            </div>

            {/* 金额和货币 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  {t.subscription.amount} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder={t.subscription.amountPlaceholder}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t.subscription.currency}</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option value="CNY">{t.subscription.currencies.CNY}</option>
                  <option value="USD">{t.subscription.currencies.USD}</option>
                  <option value="EUR">{t.subscription.currencies.EUR}</option>
                  <option value="GBP">{t.subscription.currencies.GBP}</option>
                </Select>
              </div>
            </div>

            {/* 计费周期 */}
            <div className="space-y-2">
              <Label htmlFor="billingCycle">
                {t.subscription.billingCycle} <span className="text-red-500">*</span>
              </Label>
              <Select
                id="billingCycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
              >
                <option value="monthly">{t.subscription.cycles.monthly}</option>
                <option value="quarterly">{t.subscription.cycles.quarterly}</option>
                <option value="semi-annually">{t.subscription.cycles.semiAnnually}</option>
                <option value="annually">{t.subscription.cycles.annually}</option>
                <option value="custom">{t.subscription.cycles.custom}</option>
              </Select>
            </div>

            {/* 自定义周期天数 */}
            {formData.billingCycle === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customCycleDays">
                  {t.subscription.customCycleDays} <span className="text-red-500">*</span>
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
                {t.subscription.firstBillingDate} <span className="text-red-500">*</span>
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
              <Label htmlFor="category">{t.subscription.category}</Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">{t.subscription.categorySelect}</option>
                <option value="entertainment">{t.subscription.categories.entertainment}</option>
                <option value="productivity">{t.subscription.categories.productivity}</option>
                <option value="education">{t.subscription.categories.education}</option>
                <option value="fitness">{t.subscription.categories.fitness}</option>
                <option value="music">{t.subscription.categories.music}</option>
                <option value="cloud">{t.subscription.categories.cloud}</option>
                <option value="other">{t.subscription.categories.other}</option>
              </Select>
            </div>

            {/* 网站链接 */}
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">{t.subscription.websiteUrl}</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder={t.subscription.websiteUrlPlaceholder}
              />
            </div>

            {/* 提醒天数 */}
            <div className="space-y-2">
              <Label htmlFor="remindDaysBefore">{t.subscription.remindDaysBefore}</Label>
              <Input
                id="remindDaysBefore"
                name="remindDaysBefore"
                type="number"
                value={formData.remindDaysBefore}
                onChange={handleChange}
                min="0"
              />
              <p className="text-xs text-sub-headline">
                {t.subscription.daysBeforeRenewal.replace('{days}', formData.remindDaysBefore)}
              </p>
            </div>

            {/* 备注 */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t.subscription.notes}</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t.subscription.notesPlaceholder}
                rows={3}
              />
            </div>

            {/* 订阅状态 */}
            <div className="space-y-2">
              <Label htmlFor="isActive">{t.subscription.status}</Label>
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
                <option value="true">{t.common.active}</option>
                <option value="false">{t.common.inactive}</option>
              </Select>
              {!formData.isActive && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{t.subscription.canceledNote}</Badge>
                </div>
              )}
            </div>

            {/* 按钮 */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? t.subscription.saving : t.subscription.saveChanges}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSaving}
              >
                {t.common.cancel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
