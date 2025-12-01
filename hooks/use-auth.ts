import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

export function useAuth(requireAuth: boolean = true) {
  const { user, isLoading, isAuthenticated, setUser, setLoading, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.data)
        } else {
          setUser(null)
          if (requireAuth) {
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
        if (requireAuth) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [setUser, setLoading, router, requireAuth])

  return { user, isLoading, isAuthenticated, logout }
}
