// src/features/auth/hooks/useAuth.ts

import { useAuthContext } from '../context'

export function useAuth() {
  const ctx = useAuthContext()

  return {
    user:            ctx.user,
    isLoading:       ctx.isLoading,
    isAuthenticated: ctx.isAuthenticated,
    role:            ctx.user?.role ?? null,
    isAdmin:         ctx.user?.role === 'ADMIN',
    isOperator:      ctx.user?.role === 'OPERATOR',
    login:           ctx.login,
    register:        ctx.register,
    logout:          ctx.logout,
  }
}
