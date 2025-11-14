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
} from 'recharts'

interface Stats {
  totalMonthly: number
  totalYearly: number
  activeCount: number
  cancelledCount: number
  byCategory: Record<string, number>
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

const CATEGORY_LABELS: Record<string, string> = {
  entertainment: '娱乐',
  productivity: '工作',
  education: '学习',
  fitness: '健身',
  music: '音乐',
  cloud: '云服务',
  other: '其他',
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/subscriptions/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.data)
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
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
        <p className="text-sub-headline">加载统计数据失败</p>
      </div>
    )
  }

  // 准备饼图数据
  const categoryData = Object.entries(stats.byCategory).map(([key, value]) => ({
    name: CATEGORY_LABELS[key] || key,
    value: value,
    category: key,
  }))

  // 准备柱状图数据
  const barData = Object.entries(stats.byCategory).map(([key, value]) => ({
    category: CATEGORY_LABELS[key] || key,
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
        <h1 className="text-3xl font-bold text-headline">统计分析</h1>
        <p className="text-sub-headline mt-1">查看您的订阅支出详情</p>
      </div>

      {/* 总览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              月度支出
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              ¥{stats.totalMonthly.toFixed(2)}
            </div>
            <p className="text-xs text-sub-headline mt-1">每月总计</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              年度支出
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              ¥{stats.totalYearly.toFixed(2)}
            </div>
            <p className="text-xs text-sub-headline mt-1">每年总计</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              活跃订阅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              {stats.activeCount}
            </div>
            <p className="text-xs text-sub-headline mt-1">个服务</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-sub-headline">
              已取消订阅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-headline">
              {stats.cancelledCount}
            </div>
            <p className="text-xs text-sub-headline mt-1">个服务</p>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      {categoryData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 饼图 - 分类占比 */}
          <Card>
            <CardHeader>
              <CardTitle>分类支出占比</CardTitle>
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
                    formatter={(value: number) => `¥${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 柱状图 - 分类对比 */}
          <Card>
            <CardHeader>
              <CardTitle>月度/年度支出对比</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `¥${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="monthly" fill="#ff8ba7" name="月度" />
                  <Bar dataKey="yearly" fill="#ffc6c7" name="年度" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sub-headline">暂无分类数据</p>
          </CardContent>
        </Card>
      )}

      {/* 分类详情列表 */}
      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>分类详情</CardTitle>
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
                          ¥{item.value.toFixed(2)}
                        </div>
                        <div className="text-xs text-sub-headline">
                          月度 / ¥{(item.value * 12).toFixed(2)} 年度
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
