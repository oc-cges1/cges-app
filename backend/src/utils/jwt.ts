// src/utils/jwt.ts

import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken'
import { env } from '../config/env'

export interface TokenPayload extends JwtPayload {
  userId: string
  email:  string
  role:   string
}

export interface TokenPair {
  accessToken:  string
  refreshToken: string
}

export function generateTokenPair(
  payload: Omit<TokenPayload, 'iat' | 'exp'>
): TokenPair {
  const accessToken = jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES } as SignOptions
  )
  const refreshToken = jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES } as SignOptions
  )
  return { accessToken, refreshToken }
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload
}
