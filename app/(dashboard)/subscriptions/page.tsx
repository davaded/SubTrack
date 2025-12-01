'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { SubscriptionCard } from '@/components/subscription/subscription-card'
import { Plus, Search } from 'lucide-react'
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

export default function SubscriptionsPage() {
  const { t } = useTranslation()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    Subscription[]
  >([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const response = await fetch('/api/subscriptions', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          const subs = data.data.map((sub: any) => ({
            ...sub,
            nextBillingDate: new Date(sub.nextBillingDate),
          }))
          setSubscriptions(subs)
          setFilteredSubscriptions(subs)
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptions()
  }, [])

  useEffect(() => {
    let filtered = subscriptions

    if (search) {
      filtered = filtered.filter((sub) =>
        sub.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter((sub) => sub.category === categoryFilter)
    }

    setFilteredSubscriptions(filtered)
  }, [search, categoryFilter, subscriptions])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-headline">{t.subscription.title}</h1>
          <p className="text-sub-headline mt-1">
            {t.subscription.manageDescription}
          </p>
        </div>
        <Link href="/subscriptions/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t.subscription.addNew}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sub-headline" />
          <Input
            placeholder={t.subscription.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-48"
        >
          <option value="">{t.subscription.allCategories}</option>
          <option value="entertainment">{t.subscription.categories.entertainment}</option>
          <option value="productivity">{t.subscription.categories.productivity}</option>
          <option value="education">{t.subscription.categories.education}</option>
          <option value="fitness">{t.subscription.categories.fitness}</option>
          <option value="music">{t.subscription.categories.music}</option>
          <option value="cloud">{t.subscription.categories.cloud}</option>
          <option value="other">{t.subscription.categories.other}</option>
        </Select>
      </div>

      {/* Subscriptions Grid */}
      {filteredSubscriptions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sub-headline mb-4">
            {search || categoryFilter
              ? t.subscription.noMatchingSubscriptions
              : t.subscription.noSubscriptions}
          </p>
          {!search && !categoryFilter && (
            <Link href="/subscriptions/new">
              <Button>{t.subscription.addFirstSubscription}</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      )}
    </div>
  )
}
