'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Check, X, Ban, RefreshCw, Trash2 } from 'lucide-react'

interface User {
  id: number
  email: string
  name: string | null
  role: string
  status: string
  createdAt: string
  lastLoginAt: string | null
  _count: {
    subscriptions: number
  }
}

export default function UsersPage() {
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams?.get('status') || 'all')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [statusFilter])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      if (search) {
        params.append('search', search)
      }

      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()

      if (data.success) {
        setUsers(data.data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (userId: number, action: string) => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this user? This will also delete all their subscriptions.')) {
      return
    }

    setActionLoading(userId)
    try {
      const endpoint = action === 'delete'
        ? `/api/admin/users/${userId}`
        : `/api/admin/users/${userId}/${action}`

      const res = await fetch(endpoint, {
        method: action === 'delete' ? 'DELETE' : 'PATCH'
      })

      const data = await res.json()

      if (data.success) {
        await fetchUsers()
      } else {
        alert(data.error?.message || 'Action failed')
      }
    } catch (error) {
      console.error('Action failed:', error)
      alert('Action failed')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      active: { variant: 'default', label: 'Active' },
      suspended: { variant: 'destructive', label: 'Suspended' },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant as any}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-headline">Users Management</h1>
        <p className="text-paragraph mt-2">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-paragraph" />
              <Input
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'active', 'suspended'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            {/* Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 rounded-lg border-2 border-stroke p-4">
                  <div className="h-10 w-10 rounded-full bg-stroke" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-stroke rounded" />
                    <div className="h-3 w-32 bg-stroke rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-paragraph">
              No users found
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 rounded-lg border-2 border-stroke p-4 transition-all hover:border-highlight md:flex-row md:items-center"
                >
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-headline">
                        {user.name || 'Unnamed'}
                      </h3>
                      {user.role === 'admin' && (
                        <Badge variant="secondary">Admin</Badge>
                      )}
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-sm text-paragraph mt-1">{user.email}</p>
                    <div className="flex gap-4 mt-2 text-xs text-paragraph">
                      <span>{user._count.subscriptions} subscriptions</span>
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      {user.lastLoginAt && (
                        <span>Last login {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {user.role !== 'admin' && (
                    <div className="flex gap-2">
                      {user.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(user.id, 'approve')}
                          disabled={actionLoading === user.id}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}

                      {user.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(user.id, 'suspend')}
                          disabled={actionLoading === user.id}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}

                      {user.status === 'suspended' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(user.id, 'activate')}
                          disabled={actionLoading === user.id}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(user.id, 'delete')}
                        disabled={actionLoading === user.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
