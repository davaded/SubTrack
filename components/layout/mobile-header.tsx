'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Menu, X, LogOut } from 'lucide-react'

export function MobileHeader() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      logout()
      router.push('/login')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <>
      <header className="border-b-2 border-stroke bg-main sticky top-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-headline">SubTrack</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-card-background rounded-md"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-headline" />
            ) : (
              <Menu className="h-5 w-5 text-headline" />
            )}
          </button>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="border-t-2 border-stroke bg-main px-4 py-3">
            <div className="space-y-3">
              <div className="text-sm text-sub-headline">
                {user?.name || user?.email}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                登出
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* 桌面端 Header */}
      <header className="border-b-2 border-stroke bg-main sticky top-0 z-50 hidden lg:block">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-headline">SubTrack</h1>
          </div>
          <div className="flex items-center space-x-4">
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
        </div>
      </header>
    </>
  )
}
