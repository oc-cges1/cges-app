// src/services/auth.service.ts

import { randomUUID }                        from 'crypto'
import { prisma }                            from '../config/database'
import { hashPassword, comparePassword }     from '../utils/hash'
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt'
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/email'
import { toPublicUser, AuthResponse }        from '../models/user.model'

// ── Registro ──────────────────────────────────────────────────

export async function registerUser(
  name:  string,
  email: string,
  pass:  string
): Promise<AuthResponse> {
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) throw { status: 409, message: 'El correo ya está registrado.' }

  const password           = await hashPassword(pass)
  const emailVerifyToken   = randomUUID()
  const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const user = await prisma.user.create({
    data: { name, email, password, emailVerifyToken, emailVerifyExpires },
  })

  sendVerificationEmail(email, emailVerifyToken).catch(console.error)

  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role })

  await prisma.user.update({
    where: { id: user.id },
    data:  { refreshToken: tokens.refreshToken },
  })

  return { user: toPublicUser(user), accessToken: tokens.accessToken }
}

// ── Login ─────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  pass:  string
): Promise<{ response: AuthResponse; refreshToken: string }> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw { status: 401, message: 'Credenciales incorrectas.' }

  const valid = await comparePassword(pass, user.password)
  if (!valid) throw { status: 401, message: 'Credenciales incorrectas.' }

  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role })

  await prisma.user.update({
    where: { id: user.id },
    data:  { refreshToken: tokens.refreshToken, lastLoginAt: new Date() },
  })

  return {
    response:     { user: toPublicUser(user), accessToken: tokens.accessToken },
    refreshToken: tokens.refreshToken,
  }
}

// ── Refresh ───────────────────────────────────────────────────

export async function refreshAccessToken(
  incoming: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = verifyRefreshToken(incoming)
  const user    = await prisma.user.findUnique({ where: { id: payload.userId } })

  if (!user || user.refreshToken !== incoming) {
    throw { status: 401, message: 'Refresh token inválido.' }
  }

  const tokens = generateTokenPair({ userId: user.id, email: user.email, role: user.role })

  await prisma.user.update({
    where: { id: user.id },
    data:  { refreshToken: tokens.refreshToken },
  })

  return tokens
}

// ── Logout ────────────────────────────────────────────────────

export async function logoutUser(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data:  { refreshToken: null },
  })
}

// ── Perfil ────────────────────────────────────────────────────

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw { status: 404, message: 'Usuario no encontrado.' }
  return toPublicUser(user)
}

// ── Recuperación de contraseña ────────────────────────────────

export async function forgotPassword(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return // Respuesta silenciosa — no revelar si el email existe

  const token   = randomUUID()
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1h

  await prisma.user.update({
    where: { id: user.id },
    data:  { resetPasswordToken: token, resetPasswordExpires: expires },
  })

  await sendPasswordResetEmail(email, token)
}

export async function resetPassword(
  token:   string,
  newPass: string
): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken:   token,
      resetPasswordExpires: { gt: new Date() },
    },
  })

  if (!user) throw { status: 400, message: 'Token inválido o expirado.' }

  const password = await hashPassword(newPass)

  await prisma.user.update({
    where: { id: user.id },
    data:  {
      password,
      resetPasswordToken:   null,
      resetPasswordExpires: null,
      refreshToken:         null,
    },
  })
}

// ── Verificación de email ─────────────────────────────────────

export async function verifyEmail(token: string): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken:   token,
      emailVerifyExpires: { gt: new Date() },
    },
  })

  if (!user) throw { status: 400, message: 'Token de verificación inválido o expirado.' }

  await prisma.user.update({
    where: { id: user.id },
    data:  {
      isEmailVerified:    true,
      emailVerifyToken:   null,
      emailVerifyExpires: null,
    },
  })
}
