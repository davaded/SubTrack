'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login')
      } else if (user.role !== 'admin') {
        router.push('/')
      } else if (user.status !== 'active') {
        router.push('/')
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-highlight border-t-transparent mx-auto mb-4" />
          <p className="text-sub-headline">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-stroke bg-card-background">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b-2 border-stroke px-6">
            <h1 className="text-xl font-bold text-headline">
              SubTrack Admin
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-paragraph transition-all hover:bg-background hover:text-headline"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t-2 border-stroke p-4">
            <div className="mb-3">
              <p className="text-sm font-medium text-headline">{user.name || 'Admin'}</p>
              <p className="text-xs text-paragraph">{user.email}</p>
            </div>
            <button
              onClick={() => {
                logout()
                router.push('/login')
              }}
              className="flex w-full items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-headline transition-all hover:bg-secondary/80"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
