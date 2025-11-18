'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts'
import { useTranslation } from '@/lib/hooks/use-translation'
import { getCurrencySymbol } from '@/lib/currency'

interface Stats {
  totalMonthly: number
  totalYearly: number
  activeCount: number
  cancelledCount: number
  currency: string
  byCategory: Record<string, number>
}

interface TrendData {
  currency: string
  months: Array<{
    month: string
    label: string
    total: number
    newSubscriptions: number
  }>
}

interface UpcomingSubscription {
  id: number
  name: string
  amount: number
  currency: string
  nextBillingDate: string
  daysUntilRenewal: number
  category: string | null
  logoUrl: string | null
}

const COLORS = {
  entertainment: '#ff8ba7',
  productivity: '#ffc6c7',
  education: '#c3f0ca',
  fitness: '#ff8ba7',
  music: '#ffc6c7',
  cloud: '#c3f0ca',
  other: '#594a4e',
}

export default function StatisticsPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<Stats | null>(null)
  const [trends, setTrends] = useState<TrendData | null>(null)
  const [upcoming, setUpcoming] = useState<UpcomingSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 动态分类标签
  const getCategoryLabel = (key: string): string => {
    const labels: Record<string, string> = {
      entertainment: t.subscription.categories.entertainment,
      productivity: t.subscription.categories.productivity,
      education: t.subscription.categories.education,
      fitness: t.subscription.categories.fitness,
      music: t.subscription.categories.music,
      cloud: t.subscription.categories.cloud,
      other: t.subscription.categories.other,
    }
    return labels[key] || key
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, trendsRes, upcomingRes] = await Promise.all([
          fetch('/api/subscriptions/stats'),
          fetch('/api/subscriptions/trends'),
          fetch('/api/subscriptions/upcoming-this-month'),
        ])

        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data.data)
        }

        if (trendsRes.ok) {
          const data = await trendsRes.json()
          setTrends(data.data)
        }

        if (upcomingRes.ok) {
          const data = await upcomingRes.json()
          setUpcoming(data.data)
        }
      } catch (error) {
        console.error('获取数据失败:', error)
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

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-sub-headline">{t.analytics.loadFailed}</p>
      </div>
    )
  }

  // 准备饼图数据
  const categoryData = Object.entries(stats.byCategory).map(([key, value]) => ({
    name: getCategoryLabel(key),
    value: value,
    category: key,
  }))

  // 准备柱状图数据
  const barData = Object.entries(stats.byCategory).map(([key, value]) => ({
    category: getCategoryLabel(key),
    monthly: value,
    yearly: value * 12,
  }))

  const totalCategorySpending = categoryData.reduce(
    (sum, item) => sum + item.value,
    0
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-headline">{t.analytics.title}</h1>
        <p className="text-sub-headline mt-1">{t.analytics.description}</p>
      </div>

      {/* 总览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              {t.analytics.monthlyCost}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              {getCurrencySymbol(stats.currency)}{stats.totalMonthly.toFixed(2)}
            </div>
            <p className="text-xs text-sub-headline mt-1">{t.analytics.monthlyTotal}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              {t.analytics.yearlyCost}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              {getCurrencySymbol(stats.currency)}{stats.totalYearly.toFixed(2)}
            </div>
            <p className="text-xs text-sub-headline mt-1">{t.analytics.yearlyTotal}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              {t.subscription.activeSubscriptions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              {stats.activeCount}
            </div>
            <p className="text-xs text-sub-headline mt-1">{t.analytics.services}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              {t.analytics.cancelledSubscriptions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              {stats.cancelledCount}
            </div>
            <p className="text-xs text-sub-headline mt-1">{t.analytics.services}</p>
          </CardContent>
        </Card>
      </div>

      {/* 月度支出趋势 */}
      {trends && trends.months.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.trend}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends.months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `${getCurrencySymbol(stats?.currency || 'CNY')}${value.toFixed(2)}`}
                  labelFormatter={(label: string) => label}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#ff8ba7"
                  strokeWidth={2}
                  name={t.analytics.monthlyTotal}
                  dot={{ fill: '#ff8ba7', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* 本月即将续费时间线 */}
      {upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.upcomingRenewals}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcoming.map((sub) => {
                const daysColor =
                  sub.daysUntilRenewal <= 3
                    ? 'text-red-500'
                    : sub.daysUntilRenewal <= 7
                    ? 'text-orange-500'
                    : 'text-sub-headline'

                return (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-card-background hover:bg-card-background/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {sub.logoUrl ? (
                        <img
                          src={sub.logoUrl}
                          alt={sub.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-card-background flex items-center justify-center">
                          <span className="text-lg font-semibold text-headline">
                            {sub.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-headline">
                            {sub.name}
                          </h3>
                          {sub.category && (
                            <Badge variant="secondary" className="text-xs">
                              {getCategoryLabel(sub.category)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-sub-headline mt-1">
                          {new Date(sub.nextBillingDate).toLocaleDateString('zh-CN', {
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-headline text-lg">
                        {getCurrencySymbol(sub.currency)}{sub.amount.toFixed(2)}
                      </div>
                      <div className={`text-sm font-medium ${daysColor}`}>
                        {sub.daysUntilRenewal === 0
                          ? t.analytics.renewToday
                          : sub.daysUntilRenewal === 1
                          ? t.analytics.renewTomorrow
                          : `${sub.daysUntilRenewal} ${t.analytics.daysLeft}`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 图表区域 */}
      {categoryData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 饼图 - 分类占比 */}
          <Card>
            <CardHeader>
              <CardTitle>{t.analytics.categorySpending}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[entry.category as keyof typeof COLORS] ||
                          '#594a4e'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${getCurrencySymbol(stats.currency)}${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 柱状图 - 分类对比 */}
          <Card>
            <CardHeader>
              <CardTitle>{t.analytics.monthlyYearlyComparison}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${getCurrencySymbol(stats.currency)}${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="monthly" fill="#ff8ba7" name={t.analytics.monthly} />
                  <Bar dataKey="yearly" fill="#ffc6c7" name={t.analytics.yearly} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sub-headline">{t.analytics.noCategoryData}</p>
          </CardContent>
        </Card>
      )}

      {/* 分类详情列表 */}
      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.analytics.categoryDetails}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((item, index) => {
                const percentage = (item.value / totalCategorySpending) * 100
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor:
                              COLORS[item.category as keyof typeof COLORS] ||
                              '#594a4e',
                          }}
                        />
                        <span className="font-medium text-headline">
                          {item.name}
                        </span>
                        <Badge variant="secondary">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-headline">
                          {getCurrencySymbol(stats.currency)}{item.value.toFixed(2)}
                        </div>
                        <div className="text-xs text-sub-headline">
                          {t.analytics.monthly} / {getCurrencySymbol(stats.currency)}{(item.value * 12).toFixed(2)} {t.analytics.yearly}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-card-background rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            COLORS[item.category as keyof typeof COLORS] ||
                            '#594a4e',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
