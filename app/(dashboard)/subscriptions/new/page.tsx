'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-headline">Add Subscription</h1>
        <p className="text-sub-headline mt-1">
          Track a new subscription service
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-red-50 border-2 border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Subscription Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Netflix"
                required
              />
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount <span className="text-red-500">*</span>
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
                <Label htmlFor="currency">Currency</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option value="CNY">CNY (¥)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </Select>
              </div>
            </div>

            {/* Billing Cycle */}
            <div className="space-y-2">
              <Label htmlFor="billingCycle">
                Billing Cycle <span className="text-red-500">*</span>
              </Label>
              <Select
                id="billingCycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semi-annually">Semi-Annually</option>
                <option value="annually">Annually</option>
                <option value="custom">Custom</option>
              </Select>
            </div>

            {/* Custom Cycle Days */}
            {formData.billingCycle === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customCycleDays">
                  Custom Cycle Days <span className="text-red-500">*</span>
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

            {/* First Billing Date */}
            <div className="space-y-2">
              <Label htmlFor="firstBillingDate">
                First Billing Date <span className="text-red-500">*</span>
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

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="entertainment">Entertainment</option>
                <option value="productivity">Productivity</option>
                <option value="education">Education</option>
                <option value="fitness">Fitness</option>
                <option value="music">Music</option>
                <option value="cloud">Cloud</option>
                <option value="other">Other</option>
              </Select>
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            {/* Remind Days Before */}
            <div className="space-y-2">
              <Label htmlFor="remindDaysBefore">Remind Me (Days Before)</Label>
              <Input
                id="remindDaysBefore"
                name="remindDaysBefore"
                type="number"
                value={formData.remindDaysBefore}
                onChange={handleChange}
                min="0"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes..."
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Creating...' : 'Create Subscription'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
