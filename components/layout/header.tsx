'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="border-b-2 border-stroke bg-main sticky top-0 z-50">
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
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
