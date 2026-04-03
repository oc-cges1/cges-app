// src/features/auth/api.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { AuthResponse, LoginCredentials, RegisterData, User } from './types'

export const apiClient = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  timeout:         10_000,
  headers:         { 'Content-Type': 'application/json' },
})

// ── Token storage (memoria + sessionStorage) ──────────────────
let _memoryToken: string | null = null

export function storeToken(token: string): void {
  _memoryToken = token
  sessionStorage.setItem('_at', token)
}

export function getStoredToken(): string | null {
  return _memoryToken ?? sessionStorage.getItem('_at')
}

export function removeToken(): void {
  _memoryToken = null
  sessionStorage.removeItem('_at')
}

// ── Interceptor: inyectar access token ────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Interceptor: renovar token si expira ─────────────────────
let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject:  (error: unknown) => void
}> = []

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return apiClient(original)
        })
      }

      original._retry = true
      isRefreshing    = true

      try {
        const { data } = await apiClient.post<{ data: { accessToken: string } }>('/auth/refresh')
        const newToken = data.data.accessToken
        storeToken(newToken)
        pendingQueue.forEach((p) => p.resolve(newToken))
        pendingQueue = []
        original.headers.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      } catch (refreshError) {
        pendingQueue.forEach((p) => p.reject(refreshError))
        pendingQueue = []
        removeToken()
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ── API calls ─────────────────────────────────────────────────

export async function apiRegister(data: RegisterData): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/register', data)
  return res.data
}

export async function apiLogin(data: LoginCredentials): Promise<AuthResponse> {
  const res = await apiClient.post<AuthResponse>('/auth/login', data)
  return res.data
}

export async function apiLogout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function apiGetProfile(): Promise<User> {
  const res = await apiClient.get<{ success: boolean; data: User }>('/auth/profile')
  return res.data.data
}

export async function apiForgotPassword(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email })
}

export async function apiResetPassword(token: string, password: string): Promise<void> {
  await apiClient.post('/auth/reset-password', { token, password })
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? 'Error de conexión.'
  }
  return 'Error inesperado.'
}
