'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { Home, CreditCard, BarChart3, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/subscriptions', label: '订阅管理', icon: CreditCard },
  { href: '/statistics', label: '统计分析', icon: BarChart3 },
  { href: '/settings', label: '设置', icon: Settings },
]

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      logout()
      router.push('/login')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <header className="border-b-2 border-stroke bg-main sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-headline">
              SubTrack
            </Link>
          </div>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-md transition-colors',
                    isActive
                      ? 'bg-highlight text-main font-medium'
                      : 'text-sub-headline hover:bg-card-background hover:text-headline'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* 用户信息和登出 */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-sub-headline">
                  {user.name || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  登出
                </Button>
              </>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <span className="text-sm text-sub-headline mr-3">
              {user?.name || user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
