import dayjs from 'dayjs'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, ExternalLink } from 'lucide-react'
import { useTranslation } from '@/lib/hooks/use-translation'

interface Subscription {
  id: number
  name: string
  amount: number
  currency: string
  billingCycle: string
  nextBillingDate: Date
  category?: string | null
  logoUrl?: string | null
  isActive: boolean
  daysUntilRenewal?: number
}

interface SubscriptionCardProps {
  subscription: Subscription
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const { t } = useTranslation()
  const daysUntil = subscription.daysUntilRenewal ?? 0
  const isUpcoming = daysUntil <= 7 && daysUntil >= 0

  return (
    <Card className={isUpcoming ? 'border-highlight' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* 图标 */}
            {subscription.logoUrl ? (
              <img
                src={subscription.logoUrl}
                alt={subscription.name}
                className="w-12 h-12 rounded-lg object-cover border-2 border-stroke"
                onError={(e) => {
                  // 图片加载失败时显示首字母
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            {/* 首字母备用图标 */}
            <div
              className={`w-12 h-12 rounded-lg bg-highlight flex items-center justify-center text-main font-bold text-xl ${
                subscription.logoUrl ? 'hidden' : ''
              }`}
            >
              {subscription.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">{subscription.name}</CardTitle>
              {subscription.category && (
                <Badge variant="secondary" className="mt-2 capitalize">
                  {subscription.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-highlight">
              {subscription.currency} {subscription.amount}
            </div>
            <div className="text-sm text-sub-headline capitalize">
              {subscription.billingCycle.replace('-', ' ')}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-sub-headline">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {t.subscription.nextBilling}{dayjs(subscription.nextBillingDate).format('MMM DD, YYYY')}
            </span>
          </div>
          {daysUntil !== undefined && (
            <div
              className={`text-sm font-medium ${
                isUpcoming ? 'text-highlight' : 'text-sub-headline'
              }`}
            >
              {daysUntil === 0
                ? t.subscription.renewingToday
                : daysUntil === 1
                ? t.subscription.renewingTomorrow
                : daysUntil > 0
                ? t.subscription.renewingInDays.replace('{days}', daysUntil.toString())
                : t.subscription.overdueDays.replace('{days}', Math.abs(daysUntil).toString())}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Link href={`/subscriptions/${subscription.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t.subscription.viewDetails}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
