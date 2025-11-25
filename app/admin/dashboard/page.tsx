'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, Clock } from 'lucide-react'

interface Stats {
  total: number
  pending: number
  active: number
  suspended: number
  admins: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()

      if (data.success) {
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-headline">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-stroke rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-stroke rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Approval',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Active Users',
      value: stats?.active || 0,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Suspended',
      value: stats?.suspended || 0,
      icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-headline">Dashboard</h1>
        <p className="text-paragraph mt-2">
          Overview of your SubTrack system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-card-paragraph">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-headline">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/admin/users?status=pending"
              className="flex items-center gap-3 rounded-lg border-2 border-stroke bg-background p-4 transition-all hover:border-highlight hover:shadow-md"
            >
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-headline">
                  Review Pending Users
                </h3>
                <p className="text-sm text-paragraph">
                  {stats?.pending || 0} users waiting for approval
                </p>
              </div>
            </a>

            <a
              href="/admin/settings"
              className="flex items-center gap-3 rounded-lg border-2 border-stroke bg-background p-4 transition-all hover:border-highlight hover:shadow-md"
            >
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-headline">
                  System Settings
                </h3>
                <p className="text-sm text-paragraph">
                  Configure registration and limits
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between border-b border-stroke pb-2">
            <span className="text-paragraph">Total Administrators</span>
            <span className="font-semibold text-headline">{stats?.admins || 0}</span>
          </div>
          <div className="flex justify-between border-b border-stroke pb-2">
            <span className="text-paragraph">Active Users</span>
            <span className="font-semibold text-headline">{stats?.active || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-paragraph">Inactive Users</span>
            <span className="font-semibold text-headline">
              {(stats?.pending || 0) + (stats?.suspended || 0)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
