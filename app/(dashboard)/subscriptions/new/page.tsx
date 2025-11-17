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
import { useTranslation } from '@/lib/hooks/use-translation'
import dayjs from 'dayjs'

export default function NewSubscriptionPage() {
  const router = useRouter()
  const { t } = useTranslation()
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
        <h1 className="text-2xl font-bold text-headline">{t.subscription.createTitle}</h1>
        <p className="text-sm text-sub-headline mt-0.5">
          {t.subscription.createDesc}
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
              <Label className="text-sm">{t.subscription.quickSelect}</Label>
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
                  {t.subscription.name} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.subscription.namePlaceholder}
                  required
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-sm">
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
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency" className="text-sm">{t.subscription.currency}</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="h-9"
                >
                  <option value="CNY">{t.subscription.currencies.CNY}</option>
                  <option value="USD">{t.subscription.currencies.USD}</option>
                  <option value="EUR">{t.subscription.currencies.EUR}</option>
                  <option value="GBP">{t.subscription.currencies.GBP}</option>
                </Select>
              </div>
            </div>

            {/* 计费信息 - 第二行 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="billingCycle" className="text-sm">
                  {t.subscription.billingCycle} <span className="text-red-500">*</span>
                </Label>
                <Select
                  id="billingCycle"
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleChange}
                  className="h-9"
                >
                  <option value="monthly">{t.subscription.cycles.monthly}</option>
                  <option value="quarterly">{t.subscription.cycles.quarterly}</option>
                  <option value="semi-annually">{t.subscription.cycles.semiAnnually}</option>
                  <option value="annually">{t.subscription.cycles.annually}</option>
                  <option value="custom">{t.subscription.cycles.custom}</option>
                </Select>
              </div>
              {formData.billingCycle === 'custom' && (
                <div className="space-y-1.5">
                  <Label htmlFor="customCycleDays" className="text-sm">
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
                    className="h-9"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="firstBillingDate" className="text-sm">
                  {t.subscription.firstBillingDate} <span className="text-red-500">*</span>
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
                <Label htmlFor="category" className="text-sm">{t.subscription.category}</Label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-9"
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
            </div>

            {/* 网站和提醒 - 第三行 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3 space-y-1.5">
                <Label htmlFor="websiteUrl" className="text-sm">{t.subscription.websiteUrl}</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder={t.subscription.websiteUrlPlaceholder}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="remindDaysBefore" className="text-sm">{t.subscription.remindDaysBefore}</Label>
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
                <Label className="text-sm">{t.subscription.iconSettings}</Label>
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
                  placeholder={t.subscription.logoUrl}
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
                      {t.subscription.fetchFavicon}
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
                      {t.subscription.fetchGoogle}
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
                      {t.subscription.fetchClearbit}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* 备注 */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm">{t.subscription.notes}</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder={t.subscription.notesPlaceholder}
                rows={2}
                className="text-sm"
              />
            </div>

            {/* 按钮 */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isLoading} className="flex-1 h-9">
                {isLoading ? t.subscription.creating : t.subscription.create}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                className="h-9"
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
