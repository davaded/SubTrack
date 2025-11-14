import dayjs from 'dayjs'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, ExternalLink } from 'lucide-react'

interface Subscription {
  id: number
  name: string
  amount: number
  currency: string
  billingCycle: string
  nextBillingDate: Date
  category?: string | null
  isActive: boolean
  daysUntilRenewal?: number
}

interface SubscriptionCardProps {
  subscription: Subscription
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const daysUntil = subscription.daysUntilRenewal ?? 0
  const isUpcoming = daysUntil <= 7 && daysUntil >= 0

  return (
    <Card className={isUpcoming ? 'border-highlight' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{subscription.name}</CardTitle>
            {subscription.category && (
              <Badge variant="secondary" className="mt-2 capitalize">
                {subscription.category}
              </Badge>
            )}
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
              Next billing: {dayjs(subscription.nextBillingDate).format('MMM DD, YYYY')}
            </span>
          </div>
          {daysUntil !== undefined && (
            <div
              className={`text-sm font-medium ${
                isUpcoming ? 'text-highlight' : 'text-sub-headline'
              }`}
            >
              {daysUntil === 0
                ? 'Renewing today'
                : daysUntil === 1
                ? 'Renewing tomorrow'
                : daysUntil > 0
                ? `Renewing in ${daysUntil} days`
                : `Overdue by ${Math.abs(daysUntil)} days`}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Link href={`/subscriptions/${subscription.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
