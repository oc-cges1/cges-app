// src/features/auth/types.ts

export interface User {
  id:              string
  name:            string
  email:           string
  role:            'USER' | 'ADMIN' | 'OPERATOR'
  isEmailVerified: boolean
  lastLoginAt:     string | null
  createdAt:       string
}

export interface AuthState {
  user:            User | null
  accessToken:     string | null
  isLoading:       boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email:    string
  password: string
}

export interface RegisterData {
  name:     string
  email:    string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user:        User
    accessToken: string
  }
}

export interface ApiError {
  success: false
  message: string
  errors?: { field: string; message: string }[]
}
