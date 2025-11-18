'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  DollarSign,
  Globe,
  Edit,
  Trash2,
  ArrowLeft,
} from 'lucide-react'
import { useTranslation } from '@/lib/hooks/use-translation'

interface Subscription {
  id: number
  name: string
  amount: number
  currency: string
  billingCycle: string
  customCycleDays: number | null
  firstBillingDate: string
  nextBillingDate: string
  category: string | null
  websiteUrl: string | null
  logoUrl: string | null
  notes: string | null
  remindDaysBefore: number
  isActive: boolean
  daysUntilRenewal: number
}

export default function SubscriptionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const t = useTranslation()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch(`/api/subscriptions/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setSubscription(data.data)
        } else {
          router.push('/subscriptions')
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
        router.push('/subscriptions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [params.id, router])

  const handleDelete = async () => {
    if (!confirm(t.subscription.deleteConfirm)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/subscriptions/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/subscriptions')
      }
    } catch (error) {
      console.error('Failed to delete subscription:', error)
      alert(t.errors.deleteFailed)
    } finally {
      setIsDeleting(false)
    }
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.common.back}
        </Button>
        <h1 className="text-3xl font-bold text-headline">
          {subscription.name}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{subscription.name}</CardTitle>
              <div className="flex gap-2 mt-2">
                {subscription.category && (
                  <Badge variant="secondary" className="capitalize">
                    {subscription.category}
                  </Badge>
                )}
                <Badge variant={subscription.isActive ? 'success' : 'outline'}>
                  {subscription.isActive ? t.common.active : t.common.cancelled}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-highlight">
                {subscription.currency} {subscription.amount}
              </div>
              <div className="text-sm text-sub-headline capitalize">
                {subscription.billingCycle.replace('-', ' ')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-sub-headline mb-1">
                  {t.subscription.firstBillingDate}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-highlight" />
                  <span className="font-medium">
                    {dayjs(subscription.firstBillingDate).format('MMM DD, YYYY')}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-sub-headline mb-1">
                  {t.subscription.nextBillingDate}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-highlight" />
                  <span className="font-medium">
                    {dayjs(subscription.nextBillingDate).format('MMM DD, YYYY')}
                  </span>
                </div>
                <div className="text-sm text-sub-headline mt-1">
                  {subscription.daysUntilRenewal === 0
                    ? t.subscription.renewingToday
                    : subscription.daysUntilRenewal === 1
                    ? t.subscription.renewingTomorrow
                    : subscription.daysUntilRenewal > 0
                    ? t.subscription.renewingInDays.replace('{days}', subscription.daysUntilRenewal.toString())
                    : t.subscription.overdueDays.replace('{days}', Math.abs(subscription.daysUntilRenewal).toString())}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-sub-headline mb-1">
                  {t.subscription.reminderSettings}
                </div>
                <div className="font-medium">
                  {t.subscription.daysBeforeRenewal.replace('{days}', subscription.remindDaysBefore.toString())}
                </div>
              </div>

              {subscription.websiteUrl && (
                <div>
                  <div className="text-sm text-sub-headline mb-1">{t.subscription.website}</div>
                  <a
                    href={subscription.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-highlight hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="break-all">{subscription.websiteUrl}</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {subscription.notes && (
            <div>
              <div className="text-sm text-sub-headline mb-1">{t.subscription.notes}</div>
              <p className="text-card-paragraph whitespace-pre-wrap">
                {subscription.notes}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t-2 border-stroke">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/subscriptions/${subscription.id}/edit`)
              }
              className="flex-1 gap-2"
            >
              <Edit className="h-4 w-4" />
              {t.common.edit}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? t.subscription.deleting : t.common.delete}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
