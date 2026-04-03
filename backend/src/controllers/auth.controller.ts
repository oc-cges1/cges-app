// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express'
import * as AuthService                    from '../services/auth.service'
import { AuthRequest }                     from '../middlewares/auth.middleware'
import { env }                             from '../config/env'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge:   7 * 24 * 60 * 60 * 1000,
  path:     '/',
}

export async function register(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body
    const result = await AuthService.registerUser(name, email, password)
    res.status(201).json({ success: true, data: result })
  } catch (err) { next(err) }
}

export async function login(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body
    const { response, refreshToken } = await AuthService.loginUser(email, password)
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    res.json({ success: true, data: response })
  } catch (err) { next(err) }
}

export async function refresh(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.refreshToken
    if (!token) {
      res.status(401).json({ success: false, message: 'Refresh token requerido.' })
      return
    }
    const tokens = await AuthService.refreshAccessToken(token)
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS)
    res.json({ success: true, data: { accessToken: tokens.accessToken } })
  } catch (err) { next(err) }
}

export async function logout(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    if (req.user) await AuthService.logoutUser(req.user.userId)
    res.clearCookie('refreshToken', { path: '/' })
    res.json({ success: true, message: 'Sesión cerrada correctamente.' })
  } catch (err) { next(err) }
}

export async function getProfile(
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> {
  try {
    const user = await AuthService.getUserProfile(req.user!.userId)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
}

export async function forgotPassword(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    await AuthService.forgotPassword(req.body.email)
    res.json({ success: true, message: 'Si el correo existe, recibirás instrucciones.' })
  } catch (err) { next(err) }
}

export async function resetPassword(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const { token, password } = req.body
    await AuthService.resetPassword(token, password)
    res.json({ success: true, message: 'Contraseña actualizada correctamente.' })
  } catch (err) { next(err) }
}

export async function verifyEmail(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    await AuthService.verifyEmail(req.query.token as string)
    res.json({ success: true, message: 'Correo verificado correctamente.' })
  } catch (err) { next(err) }
}
