'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SubscriptionCard } from '@/components/subscription/subscription-card'
import { DollarSign, CreditCard, Plus, Bell } from 'lucide-react'

interface Stats {
  totalMonthly: number
  totalYearly: number
  activeCount: number
  cancelledCount: number
}

interface Subscription {
  id: number
  name: string
  amount: number
  currency: string
  billingCycle: string
  nextBillingDate: string
  category?: string | null
  isActive: boolean
  daysUntilRenewal: number
  shouldRemind: boolean
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [upcoming, setUpcoming] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, upcomingRes] = await Promise.all([
          fetch('/api/subscriptions/stats'),
          fetch('/api/subscriptions/upcoming?days=30'),
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.data)
        }

        if (upcomingRes.ok) {
          const upcomingData = await upcomingRes.json()
          setUpcoming(
            upcomingData.data.map((sub: any) => ({
              ...sub,
              nextBillingDate: new Date(sub.nextBillingDate),
            }))
          )
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-headline">Dashboard</h1>
          <p className="text-sub-headline mt-1">
            Overview of your subscription expenses
          </p>
        </div>
        <Link href="/subscriptions/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Subscription
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              Monthly Cost
            </CardTitle>
            <DollarSign className="h-4 w-4 text-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              ¥{stats?.totalMonthly.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-sub-headline mt-1">
              ¥{stats?.totalYearly.toFixed(2) || '0.00'} per year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              Active Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              {stats?.activeCount || 0}
            </div>
            <p className="text-xs text-sub-headline mt-1">
              {stats?.cancelledCount || 0} cancelled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              Upcoming Renewals
            </CardTitle>
            <Bell className="h-4 w-4 text-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              {upcoming.filter((s) => s.shouldRemind).length}
            </div>
            <p className="text-xs text-sub-headline mt-1">
              In the next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Renewals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-headline">
            Upcoming Renewals
          </h2>
          <Link href="/subscriptions">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-sub-headline/30 mx-auto mb-4" />
              <p className="text-sub-headline">No upcoming renewals in the next 30 days</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.slice(0, 6).map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
