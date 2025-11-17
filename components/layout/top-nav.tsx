'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { Home, CreditCard, BarChart3, Settings, LogOut, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/hooks/use-translation'

export function TopNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { t, locale, setLocale } = useTranslation()

  const navItems = [
    { href: '/', label: t.nav.dashboard, icon: Home },
    { href: '/subscriptions', label: t.nav.subscriptions, icon: CreditCard },
    { href: '/statistics', label: t.nav.analytics, icon: BarChart3 },
    { href: '/settings', label: t.nav.settings, icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      logout()
      router.push('/login')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  const toggleLanguage = () => {
    setLocale(locale === 'zh' ? 'en' : 'zh')
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
          <div className="hidden md:flex items-center space-x-2">
            {user && (
              <>
                <span className="text-sm text-sub-headline">
                  {user.name || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="gap-1"
                  title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
                >
                  <Languages className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {locale === 'zh' ? 'EN' : '中'}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t.nav.logout}
                </Button>
              </>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="p-2"
              title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <Languages className="h-4 w-4" />
            </Button>
            <span className="text-sm text-sub-headline">
              {user?.name || user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
