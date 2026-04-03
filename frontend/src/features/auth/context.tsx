// src/features/auth/context.tsx

import {
  createContext, useContext, useEffect,
  useReducer, useCallback, ReactNode,
} from 'react'
import {
  apiLogin, apiLogout, apiRegister, apiGetProfile,
  storeToken, removeToken, getStoredToken, extractErrorMessage,
} from './api'
import type { AuthState, User, LoginCredentials, RegisterData } from './types'

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER';    payload: { user: User; accessToken: string } }
  | { type: 'CLEAR_USER' }

const initialState: AuthState = {
  user:            null,
  accessToken:     null,
  isLoading:       true,
  isAuthenticated: false,
}

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user:            action.payload.user,
        accessToken:     action.payload.accessToken,
        isLoading:       false,
        isAuthenticated: true,
      }
    case 'CLEAR_USER':
      return { ...initialState, isLoading: false }
    default:
      return state
  }
}

interface AuthContextValue extends AuthState {
  login:    (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData)            => Promise<void>
  logout:   ()                              => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const token = getStoredToken()
    if (!token) { dispatch({ type: 'CLEAR_USER' }); return }

    apiGetProfile()
      .then((user) => dispatch({ type: 'SET_USER', payload: { user, accessToken: token } }))
      .catch(() => { removeToken(); dispatch({ type: 'CLEAR_USER' }) })
  }, [])

  useEffect(() => {
    const handleForceLogout = () => { removeToken(); dispatch({ type: 'CLEAR_USER' }) }
    window.addEventListener('auth:logout', handleForceLogout)
    return () => window.removeEventListener('auth:logout', handleForceLogout)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await apiLogin(credentials)
      storeToken(res.data.accessToken)
      dispatch({ type: 'SET_USER', payload: res.data })
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw new Error(extractErrorMessage(err))
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await apiRegister(data)
      storeToken(res.data.accessToken)
      dispatch({ type: 'SET_USER', payload: res.data })
    } catch (err) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw new Error(extractErrorMessage(err))
    }
  }, [])

  const logout = useCallback(async () => {
    try { await apiLogout() } finally {
      removeToken()
      dispatch({ type: 'CLEAR_USER' })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>')
  return ctx
}
