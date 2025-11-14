'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, CreditCard, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/subscriptions', label: '订阅', icon: CreditCard },
  { href: '/statistics', label: '统计', icon: BarChart3 },
  { href: '/settings', label: '设置', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-main border-t-2 border-stroke lg:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive
                  ? 'text-highlight'
                  : 'text-sub-headline hover:text-headline'
              )}
            >
              <Icon className={cn('h-5 w-5 mb-1', isActive && 'fill-current')} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
