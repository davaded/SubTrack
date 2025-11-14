'use client'

import { useAuth } from '@/hooks/use-auth'
import { MobileHeader } from './mobile-header'
import { Sidebar } from './sidebar'
import { MobileNav } from './mobile-nav'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight mx-auto mb-4"></div>
          <p className="text-sub-headline">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <div className="flex">
        {/* 桌面端侧边栏 */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        {/* 主内容区 */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>
      {/* 移动端底部导航 */}
      <MobileNav />
    </div>
  )
}
