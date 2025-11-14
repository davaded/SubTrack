'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, CreditCard, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/statistics', label: 'Statistics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r-2 border-stroke bg-card-background min-h-screen">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-md transition-colors',
                isActive
                  ? 'bg-highlight text-main font-medium'
                  : 'text-card-paragraph hover:bg-secondary hover:text-headline'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
