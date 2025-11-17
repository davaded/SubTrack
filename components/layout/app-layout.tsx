'use client'

import { useAuth } from '@/hooks/use-auth'
import { TopNav } from './top-nav'
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
      {/* 顶部导航栏 */}
      <TopNav />

      {/* 主内容区 - 全宽 */}
      <main className="container mx-auto px-4 py-6 md:py-8 pb-20 md:pb-8">
        {children}
      </main>

      {/* 移动端底部导航 */}
      <MobileNav />
    </div>
  )
}
