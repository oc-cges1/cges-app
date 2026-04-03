// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken }               from '../utils/jwt'

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string }
}

export function authMiddleware(
  req:  AuthRequest,
  res:  Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Token requerido.' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyAccessToken(token)
    req.user = { userId: payload.userId, email: payload.email, role: payload.role }
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido o expirado.' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Acceso denegado.' })
      return
    }
    next()
  }
}
