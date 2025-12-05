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
          // 401 是正常的未登录状态，静默处理
          setUser(null)
          if (requireAuth) {
            router.push('/login')
          }
        }
      } catch {
        // 网络错误等异常情况，静默处理
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
