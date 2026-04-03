// src/models/user.model.ts

export interface UserPublic {
  id:              string
  name:            string
  email:           string
  role:            string
  isEmailVerified: boolean
  lastLoginAt:     Date | null
  createdAt:       Date
}

export interface AuthResponse {
  user:        UserPublic
  accessToken: string
}

export function toPublicUser(user: {
  id:              string
  name:            string
  email:           string
  role:            string
  isEmailVerified: boolean
  lastLoginAt:     Date | null
  createdAt:       Date
}): UserPublic {
  return {
    id:              user.id,
    name:            user.name,
    email:           user.email,
    role:            user.role,
    isEmailVerified: user.isEmailVerified,
    lastLoginAt:     user.lastLoginAt,
    createdAt:       user.createdAt,
  }
}
